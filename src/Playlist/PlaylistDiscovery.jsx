import { useState } from "react";
import { getPlaylist } from "../Common/requests";
import TrackList from "./TrackList";
import PlaylistInput from "../Common/PlaylistInput";
import { useSelector } from "react-redux";

const PlaylistDiscovery = () => {
  const [loading, setLoading] = useState(false);
  const [playlistUri, setPlaylistUri] = useState("5h0RKfezC0vmHziRkXdWzI");
  const [tracks, setTracks] = useState();
  const [playlist, setPlaylist] = useState();

  const auth = useSelector((state) => state.auth);

  const readPlaylist = async () => {
    try {
      setLoading(true);
      const { tracks, playlist } = await getPlaylist(
        playlistUri,
        auth?.access_token
      );
      setTracks(tracks);
      setPlaylist(playlist);
      setLoading(false);
    } catch (e) {
      console.log(e);
      window.alert(
        "Sorry, something went wrong. Have you provided the correct playlist URI or URL?"
      );
    }
  };

  return (
    <div className="playlist-discovery">
      <div className="control-panel">
        <h4 className="description">Browse specified playlist</h4>
        <PlaylistInput
          setPlaylistUri={setPlaylistUri}
          onButtonClick={readPlaylist}
          loading={loading}
        />
      </div>
      {playlist && (
        <div className="analysing-header">
          Now Analysing {playlist.name} by {playlist.owner.display_name}
        </div>
      )}
      <TrackList tracks={tracks} />
    </div>
  );
};

export default PlaylistDiscovery;
