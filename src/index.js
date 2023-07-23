import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {RouterProvider} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material";
import * as PropTypes from "prop-types";
import {Provider} from "react-redux";
import store from "./store/store";
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";

const persistor = persistStore(store);


const root = ReactDOM.createRoot(document.getElementById("root"));

const theme = createTheme({
  palette: {
    primary: {
      main: "#386488",
    },
    secondary: {
      main: "#388885",
    },
    tertiary: {
      main: "#edf5f5"
    },
    success: {
      main: "#42ad42",
      text: "#dee5de"
    },
    components: {
      MuiButton: {
        styleOverrides: {
          // root: ({ ownerState }) => ({
          //   ...(ownerState.variant === "contained" &&
          //     ownerState.color === "primary" && {
          //       backgroundColor: "#202020",
          //       color: "#fff",
          //     }),
          // }),
          /* root: {
          height: "3.4rem",
        },*/
        },
      },
    },
  },
});

RouterProvider.propTypes = {router: PropTypes.any};
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App/>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
