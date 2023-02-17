import { useState } from "react";
import { getPlaylist } from "../Common/requests";
import TrackList from "./TrackList";
import PlaylistInput from "../Common/PlaylistInput";

const PlaylistDiscovery = () => {
  const [loading, setLoading] = useState(false);
  const [playlistUri, setPlaylistUri] = useState("5h0RKfezC0vmHziRkXdWzI");
  const [tracks, setTracks] = useState();
  const [playlist, setPlaylist] = useState();

  const readPlaylist = async () => {
    try {
      setLoading(true);
      const { tracks, playlist } = await getPlaylist(playlistUri);
      setTracks(tracks);
      setPlaylist(playlist);
      setLoading(false);
    } catch (e) {
      window.alert(
        "Sorry, something went wrong. Have you provided the correct playlist URI or URL?"
      );
    }
  };

  return (
    <div className="playlist-discovery">
      Browse specified playlist <br />
      <PlaylistInput
        setPlaylistUri={setPlaylistUri}
        onButtonClick={readPlaylist}
        loading={loading}
      />
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
