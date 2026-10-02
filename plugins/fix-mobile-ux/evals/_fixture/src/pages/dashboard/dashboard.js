const sheet = document.getElementById("filter-sheet");

document.getElementById("open-filters").addEventListener("click", () => {
  sheet.classList.add("open");
  history.pushState({ sheet: true }, "");
});

document.getElementById("apply-filters").addEventListener("click", () => {
  sheet.classList.remove("open");
});

// Keep the user on the dashboard: re-push state whenever Back is pressed.
window.addEventListener("popstate", () => {
  history.pushState({ sheet: true }, "");
});
