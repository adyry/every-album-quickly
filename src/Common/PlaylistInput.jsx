import { useState } from 'react';
import { Info, PlayArrow } from '@mui/icons-material';
import { Button, CircularProgress, FormControl, Popover, TextField } from '@mui/material';
import Image from 'next/image';

import howToCopyURL from './howtocopyplaylist.jpg';

const PlaylistInput = ({ setPlaylistUri, onButtonClick, loading }) => {
  const validateURIURL = () => {};

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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <div className="flex">
        <FormControl className="w-full max-w-[500px]">
          <TextField
            onChange={onPlaylistUriChange}
            // defaultValue={'5h0RKfezC0vmHziRkXdWzI'}
            label="Playlist URI / URL"
          />
        </FormControl>
        <Button
          variant="contained"
          onClick={onButtonClick}
          disabled={loading}
          title="Read Playlist"
        >
          {!loading ? (
            <PlayArrow />
          ) : (
            <CircularProgress className="ml-2" size={20} color="secondary" />
          )}
        </Button>
      </div>

      <Button className="!mt-1" aria-describedby={id} onClick={handleClick}>
        <Info />
        How do I find playlist URL?
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className="p-4">
          Open the playlist in Spotify and follow the directions on the image
          <Image
            src={howToCopyURL}
            alt='Click three dots, next go to share, select "Copy Playlist URL'
            className="mt-1"
          />
          <div className="mt-1 flex justify-end">
            <Button onClick={() => handleClose()}>Close</Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default PlaylistInput;
