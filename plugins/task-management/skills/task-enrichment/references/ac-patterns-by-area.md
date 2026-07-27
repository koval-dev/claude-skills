# Acceptance Criteria Patterns by Area

Task-specific patterns for generating acceptance criteria.

## Blog (BLOG-*)

### CMS Content Update

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Body content matches source file"
    verification:
      type: query
      target: sanity
      query: "document.body == sourceContent"
      expected: "match"
  - id: AC-2
    text: "Slug unchanged"
    verification:
      type: query
      target: sanity
      query: "document.slug.current"
      expected: "equals original"
complexity: 3
executionMode: autonomous
requiredContext:
  - "raw/articles/{source-file}.md"
  - "Sanity document: blogPost with slug {slug}"
validationCommands:
  - "diff <(source) <(sanity-body)"
guardrails:
  - "Do not modify other posts"
  - "Do not change slug for SEO"
```

### Fact-Check Gate

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Expert confirms statement X is accurate"
    verification:
      type: manual
complexity: 8
executionMode: human-only
requiredContext:
  - "Article: {source-file}.md"
  - "Reference: {external-source-url}"
executionSteps:
  1. "Read the article section on X"
  2. "Compare with external source"
  3. "Confirm if statement is accurate"
  4. "Reply with your assessment"
```

## Service Page (SVC-*)

### FAQ Update

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "FAQ answer shows expected value"
    verification:
      type: query
      target: sanity
      query: "faq[_key == '{faq-key}'].answer"
      expected: "contains '{expected-value}'"
  - id: AC-2
    text: "No prohibited terms in FAQ"
    verification:
      type: grep
      command: "grep -c '{prohibited-term}' {file}"
      expected: "output == 0"
complexity: 3
executionMode: autonomous
requiredContext:
  - "Sanity document: service with slug {slug}"
  - "Article: {source-file}.md"
validationCommands:
  - "npx sanity document list --type service"
guardrails:
  - "Do not modify FAQ question, only answer"
  - "Do not change related service pages"
```

### Pricing/Term Update

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Pricing shows {amount} {currency}"
    verification:
      type: grep
      command: "grep -c '{amount}' {file}"
      expected: "output >= 1"
  - id: AC-2
    text: "Term shows {duration}"
    verification:
      type: grep
      command: "grep -c '{duration}' {file}"
      expected: "output >= 1"
complexity: 4
executionMode: ai-draft-human-review
requiredContext:
  - "Sanity document: service with slug {slug}"
  - "Owner confirmation: {ver-task-id}"
validationCommands:
  - "grep -c '{amount}' {source-file}"
guardrails:
  - "Do not change pricing without owner confirmation"
  - "Do not modify related services"
```

## Images (IMG-*)

### Image Replacement

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "New image uploaded to Sanity"
    verification:
      type: query
      target: sanity
      query: "asset.url"
      expected: "new-image-url"
  - id: AC-2
    text: "Image dimensions match requirements"
    verification:
      type: manual
complexity: 2
executionMode: autonomous
requiredContext:
  - "Image file: {path-to-image}"
  - "Sanity document: {document-type} {document-id}"
validationCommands:
  - "identify {image-file}  # ImageMagick"
guardrails:
  - "Do not compress below quality threshold"
  - "Do not change aspect ratio"
```

## Linking (LINK-*)

### Internal Link Update

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Link points to correct URL"
    verification:
      type: curl
      command: "curl -s -o /dev/null -w '%{http_code}' {url}"
      expected: "200"
  - id: AC-2
    text: "Anchor text is descriptive"
    verification:
      type: manual
complexity: 2
executionMode: autonomous
requiredContext:
  - "File containing link: {file-path}"
  - "Target URL: {target-url}"
validationCommands:
  - "curl -s -o /dev/null -w '%{http_code}' {url}"
guardrails:
  - "Do not add nofollow unless required"
  - "Do not change link context"
```

## Fact-Check (FC-*)

### Expert Review Gate

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Expert confirms {specific-statement}"
    verification:
      type: manual
complexity: 9
executionMode: human-only
requiredContext:
  - "Article: {source-file}.md"
  - "Reference: {legal-document-or-source}"
executionSteps:
  1. "Read the article section on {topic}"
  2. "Review against {reference}"
  3. "Confirm if statement is legally/factually accurate"
  4. "Note any corrections needed"
  5. "Reply with your assessment"
```

### Legal Sign-Off

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Lawyer confirms compliance with {regulation}"
    verification:
      type: manual
complexity: 10
executionMode: human-only
requiredContext:
  - "Article: {source-file}.md"
  - "Legal reference: {legal-text}"
  - "Regulation: {regulation-name}"
executionSteps:
  1. "Read the article claims about {topic}"
  2. "Compare with {regulation} text"
  3. "Confirm if claims are compliant"
  4. "Note any required corrections"
  5. "Provide legal sign-off or rejection"
guardrails:
  - "Do not add legal interpretations without basis"
  - "Do not promise services not offered"
```

## SEO (SEO-*)

### Schema Markup

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Schema validates against Google's tool"
    verification:
      type: curl
      command: "curl -s 'https://search.google.com/test/rich-results?url={page-url}' | grep 'valid'"
      expected: "no errors"
  - id: AC-2
    text: "Required fields present"
    verification:
      type: grep
      command: "grep -c '{schema-field}' {file}"
      expected: "output >= 1"
complexity: 5
executionMode: autonomous
requiredContext:
  - "File: {file-with-schema}"
  - "Page URL: {url}"
validationCommands:
  - "curl -s 'https://search.google.com/test/rich-results?url={url}'"
guardrails:
  - "Do not add虚假 ratings"
  - "Do not use prohibited schema types"
```

### Meta Tags

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Title tag contains target keyword"
    verification:
      type: grep
      command: "grep -c '{keyword}' {file}"
      expected: "output >= 1"
  - id: AC-2
    text: "Meta description is 150-160 chars"
    verification:
      type: manual
complexity: 3
executionMode: autonomous
requiredContext:
  - "File: {file-with-meta}"
  - "Target keyword: {keyword}"
validationCommands:
  - "grep '{keyword}' {file}"
guardrails:
  - "Do not keyword stuff"
  - "Do not exceed character limits"
```

## CMS (INFRA-*) & Naming (DOM-*)

### Schema Deployment

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Schema deploys successfully"
    verification:
      type: schema_check
      command: "npx sanity schema deploy --dataset production"
      expected: "exit 0"
complexity: 5
executionMode: autonomous
requiredContext:
  - "sanity/schemas/{schema-file}.ts"
validationCommands:
  - "npx sanity schema validate"
  - "npx sanity schema deploy --dataset production"
guardrails:
  - "Do not deploy without validation"
  - "Do not modify production data"
```

### Domain/Brand Cleanup

```yaml
acceptanceCriteria:
  - id: AC-1
    text: "Correct domain spelling used everywhere"
    verification:
      type: grep
      command: "grep -r '{wrong-spelling}' {directory} --include='*.{ext}' -l | wc -l"
      expected: "output == 0"
complexity: 4
executionMode: autonomous
requiredContext:
  - "Directory to search: {directory}"
  - "Wrong spelling: {wrong}"
  - "Correct spelling: {correct}"
validationCommands:
  - "grep -r '{wrong}' {directory} --include='*.{ext}' -l"
guardrails:
  - "Do not change brand name, only domain spelling"
  - "Do not modify URLs that are already correct"
```
