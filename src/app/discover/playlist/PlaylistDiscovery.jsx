'use client';

import { useState } from 'react';

import PlaylistInput from '../../../Common/PlaylistInput';
import { getPlaylist } from '../../../Common/requests';
import TrackList from './TrackList';

const PlaylistDiscovery = () => {
  const [loading, setLoading] = useState(false);
  const [playlistUri, setPlaylistUri] = useState();
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
      console.log(e);
      window.alert(
        'Sorry, something went wrong. Have you provided the correct playlist URI or URL?'
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
        <h1 className="analysing-header">
          Now Analysing {playlist.name} by {playlist.owner.display_name}
        </h1>
      )}
      <TrackList tracks={tracks} />
    </div>
  );
};

export default PlaylistDiscovery;
