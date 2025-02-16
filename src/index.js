import "./styles.css";
import logoSVG from "./images/checklist.svg";
import removeSVG from "./images/delete.svg";
import arrow_downSVG from "./images/arrow_down.svg";
import editSVG from "./images/edit.svg";

const body = document.querySelector("body");

const showButton = document.querySelector("#create");
const closeButton = document.querySelector("#close-dialog");
const dialog = document.querySelector("dialog");

class Note {
  constructor(title, description, date, importance) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.importance = importance;
    this.id = Note.generateId();
  }
  static idCounter = 0;

  static generateId() {
    return this.idCounter++;
  }
}

const test_note = new Note(
  "Title",
  "This is a description",
  "14/08/2024",
  "High"
);

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
    remove.addEventListener("click", {});

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

const renderEntryElement = (function () {
  const leftTop = (entry) => {
    const container = document.createElement("div");
    container.classList.add("top-left");

    const status = document.createElement("input");
    status.type = "checkbox";
    status.id = "status";
    status.name = "status";

    const title = document.createElement("h3");
    title.textContent = entry.title;

    container.append(status, title);

    return container;
  };

  const rightTop = (entry) => {
    const container = document.createElement("div");
    container.classList.add("top-right");

    const dueDate = document.createElement("p");
    dueDate.textContent = entry.date;

    const importance = document.createElement("p");
    importance.textContent = entry.importance;

    container.append(importance, dueDate);

    return container;
  };

  const top = (entry) => {
    const container = document.createElement("div");
    container.classList.add("top-container");

    const left = leftTop(entry);
    const right = rightTop(entry);

    container.append(left, right);

    return container;
  };

  return { top };
})();

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
  const defaultContainer = document.querySelector(".default");
  // will need to pass some kind of an array,
  // will be using placeholder for now.

  const entries = (entry) => {
    const entryElement = document.createElement("div");
    entryElement.classList.add("entry");

    // from array => entry.text

    const title = renderEntryElement.top(entry);

    const description = document.createElement("p");
    description.classList.add("entry-description");
    description.textContent = entry.description;

    const actions = renderBar.actions();

    entryElement.append(title, description, actions);
    defaultContainer.append(entryElement);
  };

  return { entries };
})();

renderContent.entries(test_note);

renderBar.header("Boy Next Door");
renderBar.footer("©");
