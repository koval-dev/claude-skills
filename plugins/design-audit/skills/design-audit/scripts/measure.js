// Design-audit measurements. Run inside a rendered page and read the returned JSON.
//
// - Browser tool with JS execution: paste this whole file as the script; it evaluates to an object.
// - Playwright/Puppeteer: page.evaluate(fs.readFileSync('measure.js', 'utf8'))  (audit_url.mjs does this)
//
// Everything here is a heuristic to support the visual review, not a verdict on its own.
(() => {
  const MAX_LIST = 25;

  const parseColor = (s) => {
    const m = s && s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const hex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const lum = (c) => {
    const ch = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const blend = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });

  const isVisible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : [];
    if (cls.length) s += '.' + cls.join('.');
    const parent = el.parentElement;
    if (parent && parent !== document.body) {
      let p = parent.tagName.toLowerCase();
      if (parent.id) p += '#' + parent.id;
      else if (typeof parent.className === 'string' && parent.className.trim()) p += '.' + parent.className.trim().split(/\s+/)[0];
      s = p + ' > ' + s;
    }
    return s;
  };
  const snippet = (el) => (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 60);

  // Effective background: walk up until an opaque background; note if an image/gradient is in the way.
  const effectiveBg = (el) => {
    const layers = [];
    let hasImage = false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') hasImage = true;
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0) {
        layers.push(c);
        if (c.a >= 1) break;
      }
    }
    let bg = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) bg = blend(layers[i], bg);
    return { bg, hasImage };
  };

  const count = (map, key) => map.set(key, (map.get(key) || 0) + 1);
  const top = (map, n = MAX_LIST) => [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([value, count]) => ({ value, count }));

  const all = [...document.body.querySelectorAll('*')].filter((el) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'PATH'].includes(el.tagName.toUpperCase()));
  const visible = all.filter(isVisible);

  // Elements that directly contain text.
  const textEls = visible.filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));

  const fontSizes = new Map(), fontWeights = new Map(), fontFamilies = new Map(), textColors = new Map(), bgColors = new Map();
  const contrastFailures = [], textOnImage = [], leftEdgeMap = new Map();

  for (const el of textEls) {
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    count(fontSizes, Math.round(size * 10) / 10 + 'px');
    count(fontWeights, String(weight));
    count(fontFamilies, cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
    const fg = parseColor(cs.color);
    if (fg) count(textColors, hex(fg));

    const { bg, hasImage } = effectiveBg(el);
    count(bgColors, hex(bg));
    if (fg) {
      const fgFlat = fg.a < 1 ? blend(fg, bg) : fg;
      const r = ratio(fgFlat, bg);
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      if (hasImage) {
        if (textOnImage.length < MAX_LIST) textOnImage.push({ element: describe(el), text: snippet(el), note: 'background image/gradient: check contrast visually' });
      } else if (r < need) {
        contrastFailures.push({ element: describe(el), text: snippet(el), fg: hex(fgFlat), bg: hex(bg), ratio: Math.round(r * 100) / 100, required: need, fontSize: size + 'px', fontWeight: weight });
      }
    }

    const rect = el.getBoundingClientRect();
    count(leftEdgeMap, Math.round(rect.left + window.scrollX));
  }

  // Spacing values in use.
  const spacing = new Map();
  for (const el of visible) {
    const cs = getComputedStyle(el);
    for (const prop of ['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'rowGap', 'columnGap']) {
      const v = parseFloat(cs[prop]);
      if (v > 0) count(spacing, Math.round(v) + 'px');
    }
  }
  const spacingValues = top(spacing, 40);
  const offScale = spacingValues.filter((s) => parseInt(s.value, 10) % 4 !== 0).map((s) => s.value);

  // Left edges and near-misses (edges 1-6px apart are probably meant to align).
  const edges = [...leftEdgeMap.entries()].sort((a, b) => a[0] - b[0]);
  const nearMisses = [];
  for (let i = 1; i < edges.length; i++) {
    const d = edges[i][0] - edges[i - 1][0];
    if (d > 0 && d <= 6) nearMisses.push({ edges: [edges[i - 1][0], edges[i][0]], counts: [edges[i - 1][1], edges[i][1]], deltaPx: d });
  }

  // Interactive elements: tap target size and button styles.
  const interactive = visible.filter((el) => el.matches('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [tabindex]:not([tabindex="-1"])'));
  const smallTargets = [];
  const buttonStyles = new Map();
  const buttonExamples = new Map();
  for (const el of interactive) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const inlineInText = el.tagName === 'A' && cs.display === 'inline' && el.parentElement && [...el.parentElement.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!inlineInText && (r.width < 24 || r.height < 24)) {
      if (smallTargets.length < MAX_LIST) smallTargets.push({ element: describe(el), text: snippet(el), size: `${Math.round(r.width)}x${Math.round(r.height)}` });
    }
    const bg = parseColor(cs.backgroundColor);
    const looksLikeButton = el.matches('button, [role=button], input[type=submit], input[type=button]') || (bg && bg.a > 0) || parseFloat(cs.borderTopWidth) > 0;
    if (looksLikeButton && !el.matches('input:not([type=submit]):not([type=button]), select, textarea')) {
      const sig = [
        'bg ' + (bg && bg.a > 0 ? hex(bg) : 'none'),
        'text ' + hex(parseColor(cs.color) || { r: 0, g: 0, b: 0 }),
        'radius ' + cs.borderTopLeftRadius,
        'pad ' + cs.paddingTop + '/' + cs.paddingLeft,
        'font ' + cs.fontSize + '/' + cs.fontWeight,
        'border ' + cs.borderTopWidth,
      ].join(' | ');
      count(buttonStyles, sig);
      if (!buttonExamples.has(sig)) buttonExamples.set(sig, snippet(el));
    }
  }

  // Box nesting: visible containers (border, shadow, or background different from the parent's).
  const isBox = (el) => {
    const cs = getComputedStyle(el);
    if (parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.borderBottomWidth) > 0 && parseFloat(cs.borderLeftWidth) > 0) return true;
    if (cs.boxShadow && cs.boxShadow !== 'none') return true;
    const bg = parseColor(cs.backgroundColor);
    if (bg && bg.a > 0 && el.parentElement) {
      const pbg = effectiveBg(el.parentElement).bg;
      return hex(bg) !== hex(pbg);
    }
    return false;
  };
  let maxBoxNesting = 0, deepestBox = null;
  const boxes = visible.filter((el) => !el.matches('a, button, input, select, textarea, span, img, svg') && isBox(el));
  const boxSet = new Set(boxes);
  for (const el of boxes) {
    let depth = 0;
    for (let n = el; n; n = n.parentElement) if (boxSet.has(n)) depth++;
    if (depth > maxBoxNesting) { maxBoxNesting = depth; deepestBox = describe(el); }
  }

  // Headings outline and images without alt.
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(isVisible).map((h) => ({ level: Number(h.tagName[1]), text: snippet(h), fontSize: getComputedStyle(h).fontSize }));
  const headingSkips = [];
  for (let i = 1; i < headings.length; i++) if (headings[i].level > headings[i - 1].level + 1) headingSkips.push(`h${headings[i - 1].level} → h${headings[i].level} ("${headings[i].text}")`);
  const imagesMissingAlt = [...document.querySelectorAll('img')].filter((img) => isVisible(img) && !img.hasAttribute('alt')).map(describe).slice(0, MAX_LIST);

  // Focus styles removed in accessible stylesheets.
  const focusOutlineRemoved = [];
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch (e) { continue; }
    for (const rule of rules || []) {
      if (rule.selectorText && /:focus/.test(rule.selectorText) && /outline\s*:\s*(none|0)/.test(rule.cssText) && !/box-shadow|border/.test(rule.style.cssText.replace(/outline[^;]*;?/g, ''))) {
        focusOutlineRemoved.push(rule.selectorText);
      }
    }
  }

  // Line length of paragraphs (approximate characters per line).
  const longLines = [];
  for (const p of visible.filter((el) => el.matches('p, li') && (el.innerText || '').length > 120)) {
    const cs = getComputedStyle(p);
    const charsPerLine = Math.round(p.getBoundingClientRect().width / (parseFloat(cs.fontSize) * 0.5));
    if (charsPerLine > 90 && longLines.length < 10) longLines.push({ element: describe(p), approxCharsPerLine: charsPerLine, width: Math.round(p.getBoundingClientRect().width) + 'px' });
  }

  const reducedMotion = [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.media && /prefers-reduced-motion/.test(r.media.mediaText)); } catch (e) { return false; } });
  const animated = visible.filter((el) => { const cs = getComputedStyle(el); return cs.animationName !== 'none' || (cs.transitionDuration && cs.transitionDuration !== '0s'); }).length;

  return {
    page: { url: location.href, title: document.title, viewport: `${innerWidth}x${innerHeight}`, documentHeight: document.documentElement.scrollHeight, horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1 },
    typography: { fontSizes: top(fontSizes), distinctFontSizes: fontSizes.size, fontWeights: top(fontWeights), fontFamilies: top(fontFamilies), longLines },
    colors: { text: top(textColors, 15), distinctTextColors: textColors.size, backgrounds: top(bgColors, 15), distinctBackgrounds: bgColors.size },
    contrast: { failures: contrastFailures.sort((a, b) => a.ratio - b.ratio).slice(0, MAX_LIST), failureCount: contrastFailures.length, textOnImage },
    spacing: { values: spacingValues, distinctValues: spacing.size, offFourPointScale: offScale },
    alignment: { distinctLeftEdges: edges.length, leftEdges: edges.slice(0, 40).map(([x, c]) => ({ x, count: c })), nearMisses: nearMisses.slice(0, MAX_LIST) },
    components: { buttonStyles: top(buttonStyles).map((b) => ({ ...b, example: buttonExamples.get(b.value) })), distinctButtonStyles: buttonStyles.size },
    regions: { maxBoxNesting, deepestBox },
    accessibility: { smallTargets, headings, headingSkips, imagesMissingAlt, focusOutlineRemoved: focusOutlineRemoved.slice(0, MAX_LIST), animatedElements: animated, hasReducedMotionQuery: reducedMotion },
  };
})()
