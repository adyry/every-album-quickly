import PlaylistInput from "../Common/PlaylistInput";
import { useState } from "react";
import { extractTracksFromAlbums, getPlaylist } from "../Common/requests";
import { selectTracks } from "../store/selectedSlice";
import { useDispatch, useSelector } from "react-redux";

const EnrichPage = () => {
  const [playlistUri, setPlaylistUri] = useState("5h0RKfezC0vmHziRkXdWzI");
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState();
  const [count, setCount] = useState();

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const readPlaylist = async () => {
    try {
      setLoading(true);
      const { tracks, playlist } = await getPlaylist(
        playlistUri,
        auth?.access_token
      );
      const albumUris = tracks.map((track) =>
        track.album.uri.replace("spotify:album:", "")
      );
      const uniqAlbumUris = [...new Set(albumUris)];

      const albumPackets = [];
      for (let i = 0; i * 20 < uniqAlbumUris.length; i++) {
        albumPackets[i] = uniqAlbumUris.slice(20 * i, 20 + 20 * i);
      }
      const albums = await extractTracksFromAlbums(
        albumPackets,
        auth?.access_token
      );

      const newTracks = albums
        .map((a) => a.tracks.items.map((t) => t.uri))
        .flat();
      setPlaylist(playlist);
      setCount(newTracks.length);
      dispatch(
        selectTracks({
          uris: newTracks,
        })
      );

      setLoading(false);
    } catch (e) {
      window.alert(
        "Sorry, something went wrong. Have you provided the correct playlist URI or URL?"
      );
    }
  };

  return (
    <>
      <div className="control-panel">
        <h4 className="description">Add whole albums to your single tracks</h4>
        <PlaylistInput
          setPlaylistUri={setPlaylistUri}
          onButtonClick={readPlaylist}
          loading={loading}
        />
      </div>
      {playlist && (
        <div>
          Found {count} new tracks by adding whole albums to the tracks from "
          {playlist.name}". Provide a name for your new playlist and use "Add"
          button below.
        </div>
      )}
    </>
  );
};

export default EnrichPage;
