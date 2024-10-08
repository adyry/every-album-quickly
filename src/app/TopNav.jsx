import { useContext, useEffect } from 'react';
import { Home } from '@mui/icons-material'; // Amplify.configure(awsconfig);
import ChecklistIcon from '@mui/icons-material/Checklist';
import ExpandIcon from '@mui/icons-material/Expand';
import { AppBar, Button, Container, Slide, Toolbar, useScrollTrigger } from '@mui/material';
import axios from 'axios';
import Link from 'next/link'; // import {Amplify} from "aws-amplify";

// import awsconfig from "./aws-exports";
import { AuthCred } from './providers';

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

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}

const TopNav = () => {
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
    <>
      <HideOnScroll>
        <AppBar position="fixed" color="default">
          <Container maxWidth="lg" disableGutters>
            <Toolbar className="max-w-scren-xl flex gap-4">
              <Button
                variant="outlined"
                linkComponent={Link}
                href={'/'}
                aria-label="Home page
              "
              >
                <Home />
              </Button>
              {authorized && (
                <>
                  <Button variant="outlined" linkComponent={Link} href={'/discover/enrich'}>
                    <ExpandIcon /> Expand
                  </Button>
                  <Button variant="outlined" linkComponent={Link} href={'/discover/playlist'}>
                    <ChecklistIcon />
                    Explore
                  </Button>
                  {/*<Link to={"/everynoise"}><Button variant="outlined"><ManageSearchIcon/> Find new albums by genre</Button></Link>*/}
                </>
              )}
              {!authorized && (
                <Button variant="contained" onClick={authorise}>
                  Authorize
                </Button>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      <div className="h-14" />
    </>
  );
};

export default TopNav;
