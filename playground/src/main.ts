const libraryScss = "My library SCSS content";

const appElement = document.querySelector<HTMLDivElement>("#app");
if (appElement) {
  appElement.innerHTML = `<pre>${libraryScss}</pre>`;
}
