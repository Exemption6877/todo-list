import "./styles.css";
import logoSVG from "./images/checklist.svg";
import removeSVG from "./images/delete.svg";
import arrow_downSVG from "./images/arrow_down.svg";
import editSVG from "./images/edit.svg";

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
  //separate factory for actions later
  const actions = () => {
    const container = document.createElement("div");
    container.classList.add("actions");

    const remove = createButtonImage(removeSVG, "remove button");

    const expand = createButtonImage(arrow_downSVG, "expand button");

    const edit = createButtonImage(editSVG, "edit button");

    container.append(expand, edit, remove);
    return container;
  };
  const header = (name) => {
    const head = document.createElement("header");
    const logo = document.createElement("img");
    logo.src = logoSVG;
    logo.alt = "logo";
    logo.height = "2 rem";
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

  return { actions, header, footer };
})();

// const renderEntryElement = (function () {
//     const
// })();

const createButtonImage = (imgSrc, alt) => {
  const button = document.createElement("button");
  const image = document.createElement("img");
  image.src = imgSrc;
  image.alt = alt;
  button.append(image);

  return button;
};
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

    const actions = renderBar.actions();
    entry.append(title, description, actions);
    content.append(entry);
  };

  return { entries };
})();

renderContent.entries();
renderBar.header("Boy Next Door");
renderBar.footer("©");
