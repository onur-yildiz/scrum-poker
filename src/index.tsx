import "./index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline";
import { HubContextProdiver } from "./store/hubContext";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import lightTheme from "./themes/light";
import reportWebVitals from "./reportWebVitals";
import store from "./store/store";

// import darkTheme from "./themes/dark";




const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <HubContextProdiver>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </HubContextProdiver>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
