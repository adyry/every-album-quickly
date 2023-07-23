import {createBrowserRouter, Route, RouterProvider, Routes, useNavigate,} from "react-router-dom";
import "./styles.scss";
import axios from "axios";
import {createContext, useContext, useEffect, useState} from "react";
import Dashboard from "./Dashboard";
import {Button} from "@mui/material";
import {Amplify} from "aws-amplify";
import awsconfig from "./aws-exports";
import EnrichPage from "./Enrich/Enrich.page";
import SelectionManager from "./Common/SelectionManager";
import EverynoiseDiscovery from "./Everynoise/EverynoiseDiscovery";
import PlaylistDiscovery from "./Playlist/PlaylistDiscovery";

Amplify.configure(awsconfig);

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

  const {setAuth} = useContext(AuthCred);

  useEffect(() => {
    setAuth(params);
    localStorage.setItem("auth", JSON.stringify(params));
    navigate("/");
  }, [navigate, params, setAuth]);
};

const authorise = () => {
  const client_id = "58b9602ee77944afa945595f99adb56a";
  const redirect_uri = window.location.origin + "/callback/";

  const state = generateRandomString(16);

  localStorage.setItem(stateKey, state);
  const scope =
    "user-read-private user-read-email playlist-modify-private playlist-modify-public";

  let url = "https://accounts.spotify.com/authorize";
  url += "?response_type=token";
  url += "&client_id=" + encodeURIComponent(client_id);
  url += "&scope=" + encodeURIComponent(scope);
  url += "&redirect_uri=" + encodeURIComponent(redirect_uri);
  url += "&state=" + encodeURIComponent(state);

  window.location = url;
};

export const spotifyRequest = async (...params) => {

  try {
    const {data} = await axios.get(params);
    return data;
  } catch (e) {
    if (e.response.status === 401) {
      localStorage.removeItem("auth");
    } else {
      window.alert("Sorry, unhandler error encountered " + e.message);
    }
  }
}

const Content = () => {
  const storageAuth = JSON.parse(localStorage.getItem("auth"));
  const {auth, setAuth} = useContext(AuthCred);

  useEffect(() => {
    const getMe = async () => {
      if (
        storageAuth?.access_token &&
        (!auth?.auth || !auth?.auth?.access_token)
      ) {
        try {
          const {data} = await axios.get(`https://api.spotify.com/v1/me`, {
            headers: {
              Authorization: "Bearer " + storageAuth?.access_token,
            },
          });

          if (data) {
            setAuth({auth: storageAuth, me: data});
            axios.defaults.headers["Authorization"] =
              "Bearer " + storageAuth.access_token;
          }
        } catch (e) {
          if (e.response.status === 401) {
            setAuth({auth: null, me: null});
            localStorage.removeItem("auth");
          } else {
            window.alert("Sorry, unhandler error encountered " + e.message);
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
        {authorized && <Dashboard/>}
        {!authorized && (
          <Button variant="contained" onClick={authorise}>
            Authorize with Spotify
          </Button>
        )}
      </header>
      {authorized && (
        <>
          <Routes>
            <Route element={<SelectionManager/>}>
              <Route path={"/playlist"} element={<PlaylistDiscovery/>}/>
              <Route path={"/everynoise"} element={<EverynoiseDiscovery/>}/>
              <Route path={"/enrich"} element={<EnrichPage/>}/>
            </Route>
          </Routes>
        </>
      )}
    </div>
  );
};

const router = createBrowserRouter([
  {path: "/callback/*", element: <AuthCallback/>},
  {
    path: "*",
    element: <Content/>,
  },
]);

export const AuthCred = createContext(null);

function App() {
  const [auth, setAuth] = useState({me: null, auth: null});

  return (
    <AuthCred.Provider value={{auth, setAuth}}>
      <RouterProvider router={router}/>
    </AuthCred.Provider>
  );
}

export default App;
