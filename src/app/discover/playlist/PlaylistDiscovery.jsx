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
  console.log(playlist);
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
      {playlist ? (
        <>
          <h1 className="pb-4 text-xl">Analysing playlist:</h1>
          <div className="control-panel max-xs:max-w-[250px] mb-8">
            <div className="block md:flex">
              <div className="flex-[0_1_425px] self-center">
                <img src={playlist.images[0].url} alt="Playlist image" width={425} height={425} />
              </div>
              <div className="overflow-anywhere max-md:pt-4 md:pl-4">
                <span className="text-xs">Playlist name:</span>
                <br />
                <span>{playlist.name}</span>
                <br />
                <span className="text-xs">Playlist author:</span>
                <br />
                <span className="italic">{playlist.owner.display_name}</span>
                <div className="max-md:hidden">
                  <span className="text-xs">Tracks count:</span>
                  <br />
                  <span className="italic">{playlist.tracks.total}</span>
                </div>
              </div>
            </div>
          </div>
          <h2 className="pb-4 text-xl">Select tracks to save to a new playlist:</h2>
        </>
      ) : (
        <div className="control-panel mb-4">
          <h4 className="description">
            Browse specified playlist, quickly select track which you do like and save them to a new
            playlist
          </h4>
          <PlaylistInput
            setPlaylistUri={setPlaylistUri}
            onButtonClick={readPlaylist}
            loading={loading}
            playlistUri={playlistUri}
          />
        </div>
      )}

      <TrackList tracks={tracks} />
    </div>
  );
};

export default PlaylistDiscovery;
