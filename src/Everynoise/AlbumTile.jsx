import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';

import { selectTrack } from '../store/selectedSlice';
import TrackTile from './TrackTile';

const AlbumTile = ({ images, tracks, name, artists, label }) => {
  const dispatch = useDispatch();

  const addAll = () => {
    tracks.items.forEach((track) => {
      dispatch(selectTrack({ uri: track.uri, checked: true }));
    });
  };

  const onAlbumKeyPress = (e) => {
    if (e.key === 'a') {
      addAll();
    }
  };

  return (
    <div className="album-tile" onKeyPress={onAlbumKeyPress}>
      <div className="heading">
        <div className="cover">
          <img src={images[1].url} alt="cover" />{' '}
        </div>
        <div className="description">
          <div>
            <h4>
              {artists.map(({ name, id, external_urls: { spotify: artist_link } }) => name + ' ')}-{' '}
              <i>{name}</i>
            </h4>
          </div>
          <div>
            <h5>label: {label}</h5>
          </div>
          <Button onClick={addAll} size="small" variant="contained" color="tertiary">
            select all
          </Button>
        </div>
      </div>

      <div>
        {tracks.items.map((track) => (
          <TrackTile key={track.uri} {...track} />
        ))}
      </div>
      <div className="background-image">
        <img src={images[2].url} alt="" />
      </div>
    </div>
  );
};

export default AlbumTile;
