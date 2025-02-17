import "./styles.css";
import * as icons from "./images/icons.js";
import { format, parseISO } from "date-fns";

const body = document.querySelector("body");

let note_stash = [];
let category_stash = ["General"];

class Note {
  // will need to track the category as well.
  // I will filter them by categories by .filter on button press.
  constructor(title, description, date, importance, category = "General") {
    this.title = title;
    this.description = description;
    this.date = date;
    this.importance = importance;
    this.category = category || "General";
    this.id = Note.generateId();
  }
  static idCounter = 1;

  static generateId() {
    return this.idCounter++;
  }
}

const submitCategory = document.querySelector("#submit-category");
submitCategory.addEventListener("click", (event) => {
  event.preventDefault();
  const categoryName = document.querySelector("#category-name").value;
  const categoryCheck = category_stash.find(
    (element) => element === categoryName
  );
  if (categoryCheck === undefined) {
    category_stash.push(categoryName);
    menuRender();
    console.log(category_stash);
  } else {
    console.log("Same exists");
  }
});

const menuRender = () => {
  if (category_stash.length > 0) {
    const menu = document.querySelector(".menu");
    const selectAllChildren = document.querySelectorAll(".category-entry");

    selectAllChildren.forEach((element) => element.remove());

    category_stash.forEach((element) => {
      const categoryEntry = document.createElement("button");
      categoryEntry.classList.add("category-entry");
      categoryEntry.textContent = element;

      categoryEntry.addEventListener("click", () => {
        const filteredNotes = note_stash.filter(
          (note) => note.category === element
        );
        renderContent.refresh();
        filteredNotes.forEach(renderContent.entries);
      });
      menu.appendChild(categoryEntry);
      categoryOption();
    });
  }
};

const categoryOption = () => {
  if (category_stash.length > 0) {
    const selectInput = document.querySelector("#category");
    selectInput.innerHTML = "";
    category_stash.forEach((element) => {
      const option = document.createElement("option");
      option.value = element;
      option.textContent = element;
      selectInput.append(option);
    });
  }
};

const submitEntry = document.querySelector("#submit");
submitEntry.addEventListener("click", (event) => {
  const title = document.querySelector("#title").value;
  const description = document.querySelector("#description").value;
  const date = document.querySelector("#date").value;
  const importance = document.querySelector("#importance").value;
  const category = document.querySelector("#category").value;

  event.preventDefault();
  const entry = new Note(title, description, date, importance, category);

  note_stash.push(entry);

  renderContent.refresh();
  note_stash.forEach((element) => {
    renderContent.entries(element);
  });
  console.log(note_stash);
});

// delete item with filter and id

// move it inside a factory

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
      const entryElement = document.getElementById(`description-${entry.id}`);
      if (entryElement) {
        entryElement.classList.toggle("hidden");
      }
    });
    const edit = createButtonImage(icons.editSVG, "edit button");
    edit.addEventListener("click", () => {
      const entryContainer = document.getElementById(`container-${entry.id}`);
      const titleInput = entryContainer.querySelector(".entry-title");
      const descriptionInput =
        entryContainer.querySelector(".entry-description");

      const isEditable = titleInput.getAttribute("contenteditable") === "true";

      if (isEditable) {
        entry.title = titleInput.textContent;
        entry.description = descriptionInput.textContent;

        titleInput.setAttribute("contenteditable", "false");
        descriptionInput.setAttribute("contenteditable", "false");
      } else {
        titleInput.setAttribute("contenteditable", "true");
        descriptionInput.setAttribute("contenteditable", "true");

        edit.textContent = "Save";
        edit.style.color = "white";
      }
    });

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
    title.classList.add("entry-title");
    title.textContent = entry.title;
    title.setAttribute("contenteditable", "false");

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
    head.append(logo, logoName);

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
  const defaultContainer = document.querySelector(".default");
  const refresh = () => {
    defaultContainer.innerHTML = "";
  };
  const entries = (entry) => {
    const entryContainer = document.createElement("div");
    entryContainer.classList.add("entry");
    entryContainer.id = `container-${entry.id}`;

    const top = entryElement.top(entry);

    const description = document.createElement("p");
    description.classList.add("entry-description");
    description.classList.add("hidden");
    description.textContent = entry.description;
    description.setAttribute("contenteditable", "false");
    description.id = `description-${entry.id}`;

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

categoryOption();
menuRender();
renderBody.header("The Todo List");
renderBody.footer("Copyright ©");
