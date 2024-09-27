import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import { Button, createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';

import { AuthCred } from './app/providers';
import SelectionManager from './Common/SelectionManager';
// import {Amplify} from "aws-amplify";
// import awsconfig from "./aws-exports";
import EnrichPage from './Enrich/Enrich.page';
import EverynoiseDiscovery from './Everynoise/EverynoiseDiscovery';
import PlaylistDiscovery from './Playlist/PlaylistDiscovery';
import store from './store/store';
import Dashboard from './Dashboard';

import './styles.scss';
import './index.css';

// Amplify.configure(awsconfig);

const authorise = () => {
  const client_id = '58b9602ee77944afa945595f99adb56a';
  const redirect_uri = window.location.origin + '/callback/';

  const state = generateRandomString(16);

  localStorage.setItem(stateKey, state);
  const scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';

  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  url += '&state=' + encodeURIComponent(state);

  window.location = url;
};

const stateKey = 'spotify_auth_state';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export const spotifyRequest = async (...params) => {
  try {
    const { data } = await axios.get(params);
    return data;
  } catch (e) {
    if (e.response.status === 401) {
      localStorage.removeItem('auth');
    } else {
      window.alert('Sorry, unhandler error encountered ' + e.message);
    }
  }
};

const Content = () => {
  const storageAuth = JSON.parse(localStorage.getItem('auth'));
  const { auth, setAuth } = useContext(AuthCred);

  useEffect(() => {
    const getMe = async () => {
      if (storageAuth?.access_token && (!auth?.auth || !auth?.auth?.access_token)) {
        try {
          const { data } = await axios.get(`https://api.spotify.com/v1/me`, {
            headers: {
              Authorization: 'Bearer ' + storageAuth?.access_token,
            },
          });

          if (data) {
            setAuth({ auth: storageAuth, me: data });
            axios.defaults.headers['Authorization'] = 'Bearer ' + storageAuth.access_token;
          }
        } catch (e) {
          if (e.response.status === 401) {
            setAuth({ auth: null, me: null });
            localStorage.removeItem('auth');
          } else {
            window.alert('Sorry, unhandler error encountered ' + e.message);
          }
        }
      }
    };

    getMe();
  }, [auth, setAuth, storageAuth]);

  const authorized = storageAuth?.access_token;

  return (
    <div className="App">
      <header className="app-header">
        {authorized && <Dashboard />}
        {!authorized && (
          <Button variant="contained" onClick={authorise}>
            Authorize with Spotify
          </Button>
        )}
      </header>
      {authorized && (
        <>
          <Routes>
            <Route element={<SelectionManager />}>
              <Route path={'/playlist'} element={<PlaylistDiscovery />} />
              <Route path={'/everynoise'} element={<EverynoiseDiscovery />} />
              <Route path={'/enrich'} element={<EnrichPage />} />
            </Route>
          </Routes>
        </>
      )}
    </div>
  );
};

const router = createBrowserRouter([
  // { path: '/callback/*', element: <AuthCallback /> },
  {
    path: '*',
    element: <Content />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
