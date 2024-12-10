import libraryScss from "virtual:scss-bundle";

const appElement = document.querySelector<HTMLDivElement>("#app");
if (appElement) {
  appElement.innerHTML = `<pre>${libraryScss}</pre>`;
}
