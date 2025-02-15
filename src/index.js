import "./styles.css";
import logoSVG from "./images/checklist.svg";

const body = document.querySelector("body");

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

renderBar.header("Boy Next Door");
renderBar.footer("©");
