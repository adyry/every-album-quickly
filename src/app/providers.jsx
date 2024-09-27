'use client';

import { createContext, useState } from 'react';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import store from '../store/store';

export const AuthCred = createContext(null);

const persistor = persistStore(store);

const theme = createTheme({
  palette: {
    primary: {
      main: '#386488',
    },
    secondary: {
      main: '#388885',
    },
    tertiary: {
      main: '#edf5f5',
    },
    success: {
      main: '#42ad42',
      text: '#dee5de',
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

export function Providers({ children }) {
  const [auth, setAuth] = useState({ me: null, auth: null });

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AuthCred.Provider value={{ auth, setAuth }}>{children}</AuthCred.Provider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
