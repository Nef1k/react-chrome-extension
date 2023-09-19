import React from 'react';
import ReactDOM from 'react-dom/client';
import './popup.css';
import App from "../components/App/App";

const rootInjector = document.body;

const root = ReactDOM.createRoot(rootInjector);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
