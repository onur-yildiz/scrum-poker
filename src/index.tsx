import "./index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline";
import { HubConnectionState } from "@microsoft/signalr";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import hub from "./hub";
// import darkTheme from "./themes/dark";
import lightTheme from "./themes/light";
import reportWebVitals from "./reportWebVitals";
import store from "./store/store";

const run = async () => {
  if (hub.connection.state !== HubConnectionState.Disconnected) return;
  await hub.connection.start();

  const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
};

run();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
