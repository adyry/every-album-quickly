import { useContext } from 'react';
import axios from 'axios';
import Link from 'next/link'; // import {Amplify} from "aws-amplify";

import { AuthCred } from './providers';
// import {Amplify} from "aws-amplify";
// import awsconfig from "./aws-exports";

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

const Home = () => {
  const {
    auth: { me },
  } = useContext(AuthCred);
  console.log(me);
  return me ? (
    <div>
      Welcome to Every Album Quickly. This is an application meant for record digging on spotify.
      <br />
      <br />
      Quickly browse through tracks from the selected playlist and save them to the new spotify
      playlist, using{' '}
      <Link className="text-blue-700 hover:text-blue-950" href={'/discover/playlist'}>
        Explore
      </Link>{' '}
      option
      <br />
      <br />
      Create a playlist with full albums based on the single tracks playlist using{' '}
      <Link className="text-blue-700 hover:text-blue-950" href={'/discover/expand'}>
        Expand
      </Link>{' '}
      option
      <br />
      <br />
    </div>
  ) : (
    <div>Please Authorize</div>
  );
};

export default Home;
