import "./index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { HubContextProdiver } from "./store/hubContext";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import reportWebVitals from "./reportWebVitals";
import store from "./store/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <Provider store={store}>
          <HubContextProdiver>
            <App />
          </HubContextProdiver>
        </Provider>
      </SnackbarProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
