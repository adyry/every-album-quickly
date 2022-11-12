import "./App.scss";
import axios from "axios";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

var stateKey = "spotify_auth_state";

const AuthCallback = () => {
  const params = getHashParams();
  const navigate = useNavigate();

  const { setAuth } = useContext(AuthCred);

  useEffect(() => {
    setAuth(params);
    navigate("/");
  }, [params]);
  console.log(setAuth);
  console.log(params);
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
  const auth = useContext(AuthCred);
  console.log(auth);

  const getTracks = async () => {
    axios.get("http://localhost:9000/album2track");
  };

  return (
    <div className="App">
      <button onClick={getTracks}>get tracks</button>
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
  const params = useParams();

  const [auth, setAuth] = useState();

  console.log(params);

  return (
    <AuthCred.Provider value={{ auth, setAuth }}>
      <RouterProvider router={router} />
    </AuthCred.Provider>
  );
}

export default App;
