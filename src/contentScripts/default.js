import React from "react";
import ReactDOM from "react-dom/client";
import Content from "../components/Content/Content";
import "../index.css";

document.onreadystatechange = function () {setTimeout(() => {
  const rootInjector = document.querySelectorAll(
    "div.score-separator"
  )[0];  // Locate an element where react root will be injected
  console.log("Injecting into", rootInjector);

  rootInjector.innerHTML = "";
  const root = ReactDOM.createRoot(rootInjector);
  root.render(
    <React.StrictMode>
      <Content />
    </React.StrictMode>
  );
}, 500)};

// const root = ReactDOM.createRoot(rootInjector);
// root.render(
//   <React.StrictMode>
//     <Content />
//   </React.StrictMode>
// );
