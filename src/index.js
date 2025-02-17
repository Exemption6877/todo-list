import "./styles.css";
import * as icons from "./images/index.js";
import { format, parseISO } from "date-fns";

const body = document.querySelector("body");

class Note {
  // will need to track the category as well.
  // I will filter them by categories by .filter on button press.
  constructor(title, description, date, importance) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.importance = importance;
    this.id = Note.generateId();
  }
  static idCounter = 1;

  static generateId() {
    return this.idCounter++;
  }
}

const submitEntry = document.querySelector("#submit");
submitEntry.addEventListener("click", (event) => {
  const title = document.querySelector("#title").value;
  const description = document.querySelector("#description").value;
  const date = document.querySelector("#date").value;
  const importance = document.querySelector("#importance").value;

  event.preventDefault();
  const entry = new Note(title, description, date, importance);

  note_stash.push(entry);
  renderContent.refresh();
  note_stash.forEach((element) => {
    renderContent.entries(element);
  });

  console.log(note_stash);
});

// delete item with filter and id

// move it inside a factory
let note_stash = [];

const entryElement = (function () {
  // need to do button's logic obviously
  const actions = (entry) => {
    const container = document.createElement("div");
    container.classList.add("actions");

    const remove = createButtonImage(icons.removeSVG, "remove button");
    remove.id = entry.id;
    remove.addEventListener("click", () => {
      note_stash = note_stash.filter((element) => element.id != remove.id);
      renderContent.refresh();
      note_stash.forEach((element) => {
        renderContent.entries(element);
      });
    });

    const expand = createButtonImage(icons.arrow_downSVG, "expand button");
    expand.addEventListener("click", () => {
      const entryElement = document.getElementById(entry.id);
      if (entryElement) {
        entryElement.classList.toggle("hidden");
      }
    });
    const edit = createButtonImage(icons.editSVG, "edit button");

    container.append(expand, edit, remove);
    return container;
  };

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
    const date = parseISO(entry.date);
    dueDate.textContent = format(date, "PP");

    const importance = document.createElement("p");
    importance.textContent = entry.importance;
    const importanceSVG = document.createElement("img");
    importanceSVG.src = icons.prioritySVG;

    container.append(importanceSVG, importance, dueDate);

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

  return { actions, top };
})();

const renderBody = (function () {
  const header = (name) => {
    const head = document.createElement("header");
    const logo = document.createElement("img");
    logo.src = icons.logoSVG;
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

const createButtonImage = (imgSrc, alt) => {
  const button = document.createElement("button");
  const image = document.createElement("img");
  image.src = imgSrc;
  image.alt = alt;
  button.append(image);

  return button;
};

const renderContent = (function () {
  const menu = document.querySelector(".menu");
  const defaultContainer = document.querySelector(".default");
  const refresh = () => {
    defaultContainer.innerHTML = "";
  };
  const entries = (entry) => {
    const entryContainer = document.createElement("div");
    entryContainer.classList.add("entry");

    const top = entryElement.top(entry);

    const description = document.createElement("p");
    description.classList.add("entry-description");
    description.classList.add("hidden");
    description.textContent = entry.description;
    description.id = entry.id;

    const actions = entryElement.actions(entry);

    entryContainer.append(top, description, actions);
    defaultContainer.append(entryContainer);
  };

  return { entries, refresh };
})();

const dialogLogic = (open, close, dialog) => {
  open.addEventListener("click", (event) => {
    dialog.show();
    event.preventDefault();
  });

  close.addEventListener("click", (event) => {
    dialog.close();
    event.preventDefault();
  });
};

const dialogCategory = document.querySelector("#menu-creation");
const showCategory = document.querySelector("#create-category");
const closeCategory = document.querySelector("#close-category");
dialogLogic(showCategory, closeCategory, dialogCategory);

const dialogEntry = document.querySelector("#entry-creation");
const showEntry = document.querySelector("#create-entry");
const closeEntry = document.querySelector("#close-entry");
dialogLogic(showEntry, closeEntry, dialogEntry);

if (note_stash.length > 0) {
  note_stash.forEach(renderContent.entries);
}
renderBody.header("The Todo List");
renderBody.footer("Copyright ©");
