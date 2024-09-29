'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert } from '@mui/material';

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
      {playlist ? (
        <>
          <h1 className="pb-4 text-xl">Extending playlist:</h1>
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
          <h2 className="pb-4 text-xl">
            <Alert severity="success">
              Found {count} new tracks by adding whole albums to the tracks from &quot;
              {playlist.name}
              &quot;. Save it using using Save button below.
            </Alert>
          </h2>
        </>
      ) : (
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
      )}
    </>
  );
};

export default Enrich;
