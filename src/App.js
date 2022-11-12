import "./App.scss";
import axios from "axios";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const stateKey = "spotify_auth_state";

const AuthCallback = () => {
  const params = getHashParams();
  const navigate = useNavigate();

  const { setAuth } = useContext(AuthCred);

  useEffect(() => {
    setAuth(params);
    localStorage.setItem("auth", JSON.stringify(params));
    navigate("/");
  }, [navigate, params, setAuth]);
};

const authorise = () => {
  const client_id = "58b9602ee77944afa945595f99adb56a"; // Your client id
  const redirect_uri = "http://localhost:3000/callback/"; // Your redirect uri

  const state = generateRandomString(16);

  localStorage.setItem(stateKey, state);
  const scope = "user-read-private user-read-email";

  let url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
  url += "&state=" + encodeURIComponent(state);

  window.location = url;
};

const Content = () => {
  const storageAuth = JSON.parse(localStorage.getItem("auth"));

  const { auth, setAuth } = useContext(AuthCred);

  useEffect(() => {
    if (storageAuth?.access_token && (!auth || !auth?.access_token)) {
      setAuth(storageAuth);
    }
  }, [auth, setAuth, storageAuth]);

  return (
    <div className="App">
      {storageAuth.access_token && <Dashboard />}
      <button onClick={authorise}>auth</button>
    </div>
  );
};

const router = createBrowserRouter([
  { path: "/callback/*", element: <AuthCallback /> },
  {
    path: "*",
    element: <Content />,
  },
]);

export const AuthCred = createContext(null);

function App() {
  const [auth, setAuth] = useState();

  return (
    <AuthCred.Provider value={{ auth, setAuth }}>
      <RouterProvider router={router} />
    </AuthCred.Provider>
  );
}

export default App;
