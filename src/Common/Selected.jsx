import { useDispatch, useSelector } from "react-redux";
import { useContext, useState } from "react";
import { AuthCred } from "../App";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Modal,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import { clearTracks } from "../store/selectedSlice";

const Selected = () => {
  const selected = useSelector((state) => state.selected);
  const dispatch = useDispatch();
  const [publicPlaylist, setPublicPlaylist] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {
    auth: { me },
  } = useContext(AuthCred);

  const [playlistName, setPlaylistName] = useState(
    `Discovered ${new Date().toDateString()}`
  );

  const onTextChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const togglePublic = (e) => {
    setPublicPlaylist(e.target.checked);
  };

  const addToPlaylist = async () => {
    setLoading(true);
    const playlist = await axios.post(
      `https://api.spotify.com/v1/users/${me.id}/playlists`,
      {
        name: playlistName,
        public: publicPlaylist,
        description: "Generated by every album quickly",
      }
    );

    if (playlist.data) {
      const id = playlist.data.id;

      const packets = [];
      const inc = 100;
      for (let i = 0; i * inc < selected.length; i++) {
        packets[i] = selected.slice(inc * i, inc + inc * i);
      }

      const result = await Promise.all(
        packets.map((packet) =>
          axios.post(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
            uris: packet,
          })
        )
      );
      setLoading(false);
      if (result.data) {
        setSuccess(true);
      }
    }
  };

  const clear = () => {
    dispatch(clearTracks());
  };

  return (
    <>
      <div>
        <TextField
          onChange={onTextChange}
          value={playlistName}
          sx={{ minWidth: 260 }}
          label="Name of the playlist"
        />
        <FormControlLabel
          control={<Switch onChange={togglePublic} />}
          label="Public"
        />
        <Button
          variant="contained"
          onClick={addToPlaylist}
          disabled={loading || selected?.length === 0}
        >
          Add {selected.length} to the Playlist{" "}
          {loading && <CircularProgress color="secondary" />}
        </Button>
        <Button variant="contained" color="secondary" onClick={clear}>
          Clear Selection
        </Button>
      </div>
      <Modal open={success} onClose={() => setSuccess(false)}>
        <div className="modal-content">
          Successufully saved your selection to the playlist
          <Button variant="contained">Clear Selection</Button>
          <Button variant="contained">Close Modal</Button>
        </div>
      </Modal>
    </>
  );
};

export default Selected;
