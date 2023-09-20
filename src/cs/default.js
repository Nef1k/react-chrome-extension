import React from 'react';
import ReactDOM from 'react-dom/client';
import './popup.css';
import Content from "../components/Content/Content";

const rootInjector = document.body;  // Locate an element where react root will be injected

const root = ReactDOM.createRoot(rootInjector);
root.render(
  <React.StrictMode>
    <Content />
  </React.StrictMode>
);
