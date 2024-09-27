import { PlayArrow } from '@mui/icons-material';
import { Button, CircularProgress, FormControl, TextField } from '@mui/material';

const PlaylistInput = ({ setPlaylistUri, onButtonClick, loading }) => {
  const onPlaylistUriChange = (e) => {
    const matchURI = e.target.value.match(/spotify:playlist:.*/);
    const matchURL = e.target.value.match(/https:\/\/open.spotify.com\/playlist\/.*\?/);

    if (e.target.value === '') {
      return;
    }

    if (matchURI && matchURI[0]) {
      setPlaylistUri(e.target.value.match(/spotify:playlist:(.*)?/)[1]);
    } else if (matchURL && matchURL[0]) {
      setPlaylistUri(e.target.value.match(/https:\/\/open.spotify.com\/playlist\/(.*?)\?/)[1]);
    } else {
      window.alert("Sorry, looks like it's not a correct playlist URL or URI");
      setPlaylistUri(e.target.value);
    }
  };

  return (
    <div className="flex">
      <FormControl className="w-full max-w-[500px]">
        <TextField
          onChange={onPlaylistUriChange}
          defaultValue={'5h0RKfezC0vmHziRkXdWzI'}
          label="Playlist URI / URL"
        />
      </FormControl>
      <Button variant="contained" onClick={onButtonClick} disabled={loading} title="Read Playlist">
        {!loading ? (
          <PlayArrow />
        ) : (
          <CircularProgress className="ml-2" size={20} color="secondary" />
        )}
      </Button>
    </div>
  );
};

export default PlaylistInput;
