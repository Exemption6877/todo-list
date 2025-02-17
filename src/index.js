import "./styles.css";
import * as icons from "./images/icons.js";
import { format, parseISO, isValid } from "date-fns";

const body = document.querySelector("body");

//local storage for idcounter and these two
let note_stash = JSON.parse(localStorage.getItem("note_stash")) || [];
let category_stash = JSON.parse(localStorage.getItem("category_stash")) || [
  "General",
];

class Note {
  // implement input checks

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
    const newId = this.idCounter;
    this.idCounter++;
    localStorage.setItem("idCounter", this.idCounter);
    return newId;
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
    localStorage.setItem("category_stash", JSON.stringify(category_stash));

    menuRender();

    console.log(category_stash);
  } else {
    console.log("Same exists");
  }
});

const inputValidation = (function () {
  const textInput = (text) => {
    return text.length > 0;
  };

  const dateInput = (date) => {
    return isValid(parseISO(date));
  };

  const selectInput = (selectQuery) => {
    const options = Array.from(selectQuery.options).map(
      (option) => option.value
    );

    return options.includes(selectQuery.value);
  };

  const throwError = (invalid) => {
    return `Invalid ${invalid} input.`;
  };

  return { textInput, dateInput, selectInput, throwError };
})();

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
  event.preventDefault();
  const title = document.querySelector("#title").value;

  const description = document.querySelector("#description").value;

  const date = document.querySelector("#date").value;

  const importance = document.querySelector("#importance").value;

  const category = document.querySelector("#category").value;

  const entryDialog = document.querySelector("#entry-creation");

  const categorySelector = document.querySelector("#category");
  const importanceSelector = document.querySelector("#importance");
  const errorDOM = document.createElement("p");
  errorDOM.classList.add("entry-error");

  const queryError = document.querySelector(".entry-error");
  if (queryError) {
    queryError.remove();
  }

  if (
    inputValidation.dateInput(date) &&
    inputValidation.textInput(title) &&
    inputValidation.selectInput(categorySelector) &&
    inputValidation.selectInput(importanceSelector)
  ) {
    const entry = new Note(title, description, date, importance, category);

    note_stash.push(entry);
    localStorage.setItem("note_stash", JSON.stringify(note_stash));

    renderContent.refresh();
    note_stash.forEach((element) => {
      renderContent.entries(element);
    });
    console.log(note_stash);
  } else if (!inputValidation.dateInput(date)) {
    errorDOM.textContent = inputValidation.throwError("date");
    entryDialog.prepend(errorDOM);
  } else if (!inputValidation.textInput(title)) {
    errorDOM.textContent = inputValidation.throwError("title");
    entryDialog.prepend(errorDOM);
  } else if (!inputValidation.selectInput(categorySelector)) {
    errorDOM.textContent = inputValidation.throwError("select option");
    entryDialog.prepend(errorDOM);
  }
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
      localStorage.setItem("note_stash", JSON.stringify(note_stash));
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
        localStorage.setItem("note_stash", JSON.stringify(note_stash));
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
    const date = entry.date;
    dueDate.textContent = format(parseISO(date), "PP");

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
    entryContainer.classList.add(`${entry.importance}`);
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

const dialogLogic = (open, close, dialogElem) => {
  const dialog = document.querySelector(dialogElem);
  const show = document.querySelector(open);
  const closeElem = document.querySelector(close);
  show.addEventListener("click", (event) => {
    dialog.show();
    event.preventDefault();
  });

  closeElem.addEventListener("click", (event) => {
    dialog.close();
    event.preventDefault();
  });
};

dialogLogic("#create-category", "#close-category", "#menu-creation");
dialogLogic("#create-entry", "#close-entry", "#entry-creation");

if (note_stash.length > 0) {
  note_stash.forEach(renderContent.entries);
}

categoryOption();
menuRender();
renderBody.header("The Todo List");
renderBody.footer("Copyright ©");
