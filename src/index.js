import "./styles.css";
import logoSVG from "./images/checklist.svg";

const body = document.querySelector("body");

const showButton = document.querySelector("#create");
const closeButton = document.querySelector("#close-dialog");
const dialog = document.querySelector("dialog");

showButton.addEventListener("click", (event) => {
  dialog.show();
  event.preventDefault();
});

closeButton.addEventListener("click", (event) => {
  dialog.close();
  event.preventDefault();
});

const renderBar = (function () {
  const header = (name) => {
    const head = document.createElement("header");
    const logo = document.createElement("img");
    logo.src = logoSVG;
    logo.alt = "logo";
    const logoName = document.createElement("h1");
    logoName.textContent = name;
    head.appendChild(logo);
    head.appendChild(logoName);
    body.prepend(head);
  };
  const footer = (text) => {
    const foot = document.createElement("footer");
    foot.textContent = `${text} ${new Date().getFullYear()}`;
    body.append(foot);
  };

  return { header, footer };
})();

// const renderEntryElement = (function () {
//     const
// })();

// I will pass inside a class objects to generate an entry.
// TODO: static id generator in entry class.
const renderContent = (function () {
  const menu = document.querySelector(".menu");
  // will need to pass some kind of an array,
  // will be using placeholder for now.

  const entries = () => {
    const content = document.querySelector(".content");
    const entry = document.createElement("div");
    entry.classList.add("entry");

    // from array => entry.text
    const title = document.createElement("h3");
    title.textContent = "Placeholder Title";

    const description = document.createElement("p");
    description.textContent = "Description Test";

    entry.append(title, description);
    content.append(entry);
  };

  return { entries };
})();

renderContent.entries();
renderBar.header("Boy Next Door");
renderBar.footer("©");
