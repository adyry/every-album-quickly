'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';

import PlaylistInput from '../../../Common/PlaylistInput';
import { extractTracksFromAlbums, getPlaylist } from '../../../Common/requests';
import { selectTracks } from '../../../store/selectedSlice';

const Enrich = () => {
  const [playlistUri, setPlaylistUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState();
  const [count, setCount] = useState();

  const dispatch = useDispatch();

  const readPlaylist = async () => {
    try {
      setLoading(true);
      const { tracks, playlist } = await getPlaylist(playlistUri);
      const albumUris = tracks.map((track) => track.album.uri.replace('spotify:album:', ''));
      const uniqAlbumUris = [...new Set(albumUris)];

      const albumPackets = [];
      for (let i = 0; i * 20 < uniqAlbumUris.length; i++) {
        albumPackets[i] = uniqAlbumUris.slice(20 * i, 20 + 20 * i);
      }
      const albums = await extractTracksFromAlbums(albumPackets);

      const newTracks = albums.map((a) => a.tracks.items.map((t) => t.uri)).flat();
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
        'Sorry, something went wrong. Have you provided the correct playlist URI or URL?'
      );
    }
  };

  return (
    <>
      <div className="control-panel mb-4">
        <h4 className="description">
          Create a new playlist with all albums containing the track from the original playlist
        </h4>
        <PlaylistInput
          setPlaylistUri={setPlaylistUri}
          onButtonClick={readPlaylist}
          loading={loading}
          playlistUri={playlistUri}
        />
      </div>
      {playlist && (
        <div>
          Found {count} new tracks by adding whole albums to the tracks from &quot;{playlist.name}
          &quot;. Provide a name for your new playlist and use &quot;Add&quot; button below.
        </div>
      )}
    </>
  );
};

export default Enrich;
