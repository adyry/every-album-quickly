import {
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";

const PlaylistInput = ({ setPlaylistUri, onButtonClick, loading }) => {
  const onPlaylistUriChange = (e) => {
    const matchURI = e.target.value.match(/spotify:playlist:.*/);
    const matchURL = e.target.value.match(
      /https:\/\/open.spotify.com\/playlist\/.*\?/
    );

    if (e.target.value === "") {
      return;
    }

    if (matchURI && matchURI[0]) {
      setPlaylistUri(e.target.value.match(/spotify:playlist:(.*)?/)[1]);
    } else if (matchURL && matchURL[0]) {
      setPlaylistUri(
        e.target.value.match(/https:\/\/open.spotify.com\/playlist\/(.*?)\?/)[1]
      );
    } else {
      window.alert("Sorry, looks like it's not a correct playlist URL or URI");
      setPlaylistUri(e.target.value);
    }
  };

  return (
    <>
      <FormControl>
        <TextField
          onChange={onPlaylistUriChange}
          defaultValue={"5h0RKfezC0vmHziRkXdWzI"}
          label="Playlist URI / URL"
          sx={{ width: 350 }}
        />
      </FormControl>
      <Button variant="contained" onClick={onButtonClick} disabled={loading}>
        read playlist {loading && <CircularProgress color="secondary" />}
      </Button>
    </>
  );
};

export default PlaylistInput;
