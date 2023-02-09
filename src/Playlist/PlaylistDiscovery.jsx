import {
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";

import { useState } from "react";
import { getPlaylist } from "../Common/requests";
import TrackList from "../Common/TrackList";

const PlaylistDiscovery = () => {
  const [loading, setLoading] = useState(false);
  const [playlistUri, setPlaylistUri] = useState("5h0RKfezC0vmHziRkXdWzI");
  const [tracks, setTracks] = useState();

  const onPlaylistUriChange = (e) => {
    const matchURI = e.target.value.match(/spotify:playlist:.*/);
    const matchURL = e.target.value.match(
      /https:\/\/open.spotify.com\/playlist\/.*\?/
    );

    if (e.target.value === "") {
      return;
    }

    if (matchURI && matchURI[0]) {
      setPlaylistUri(e.target.value.match(/(?<=spotify:playlist:).*/)[0]);
    } else if (matchURL && matchURL[0]) {
      setPlaylistUri(
        e.target.value.match(
          /(?<=https:\/\/open.spotify.com\/playlist\/).*(?=\?)/
        )[0]
      );
    } else {
      window.alert("Sorry, looks like it's not a correct playlist URL or URI");
      setPlaylistUri(e.target.value);
    }
  };

  const readPlaylist = async () => {
    try {
      setLoading(true);
      const result = await getPlaylist(playlistUri);
      setTracks(result);
      setLoading(false);
    } catch (e) {
      window.alert(
        "Sorry, something went wrong. Have you provided the correct playlist URI or URL?"
      );
    }
  };

  return (
    <>
      Browse through specified playlist <br />
      <FormControl>
        <TextField
          onChange={onPlaylistUriChange}
          defaultValue={"5h0RKfezC0vmHziRkXdWzI"}
          label="Playlist URI / URL"
          sx={{ width: 350 }}
        />
      </FormControl>
      <Button variant="contained" onClick={readPlaylist} disabled={loading}>
        read playlist {loading && <CircularProgress color="secondary" />}
      </Button>
      <TrackList tracks={tracks} />
    </>
  );
};

export default PlaylistDiscovery;
