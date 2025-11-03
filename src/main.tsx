import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { DataProviderContext } from "./providers/DataProviderContext";
import { DataProviderFactory } from "./data/DataProviderFactory";
import { ToastProvider } from "./providers/ToastProvider";

const dataProvider = DataProviderFactory.create("mock");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProviderContext.Provider value={dataProvider}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </DataProviderContext.Provider>
    </BrowserRouter>
  </React.StrictMode>,
);

