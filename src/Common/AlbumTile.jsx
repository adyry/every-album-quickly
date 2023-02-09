import { useDispatch } from "react-redux";
import { selectTrack } from "../store/selectedSlice";
import TrackTile from "./TrackTile";

const AlbumTile = ({ images, tracks, name, artists, label }) => {
  const dispatch = useDispatch();

  const onAlbumKeyPress = (e) => {
    if (e.key === "a") {
      tracks.items.forEach((track) => {
        dispatch(selectTrack({ uri: track.uri, checked: true }));
      });
    }
  };

  return (
    <div className="album-tile" onKeyPress={onAlbumKeyPress}>
      <div>
        {artists.map(
          ({ name, id, external_urls: { spotify: artist_link } }) => name + " "
        )}
        - {name}
      </div>
      <div>label: {label}</div>
      <div>
        <img src={images[2].url} alt="cover" />{" "}
      </div>
      <div>
        {tracks.items.map((track) => (
          <TrackTile key={track.uri} {...track} />
        ))}
      </div>
    </div>
  );
};

export default AlbumTile;
