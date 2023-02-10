import { useDispatch } from "react-redux";
import { selectTrack } from "../store/selectedSlice";
import TrackTile from "./TrackTile";
import { Button } from "@mui/material";

const AlbumTile = ({ images, tracks, name, artists, label }) => {
  const dispatch = useDispatch();

  const addAll = () => {
    tracks.items.forEach((track) => {
      dispatch(selectTrack({ uri: track.uri, checked: true }));
    });
  };

  const onAlbumKeyPress = (e) => {
    if (e.key === "a") {
      addAll();
    }
  };

  return (
    <div className="album-tile" onKeyPress={onAlbumKeyPress}>
      <div className="heading">
        <div className="cover">
          <img src={images[2].url} alt="cover" />{" "}
        </div>
        <div className="description">
          <div>
            {artists.map(
              ({ name, id, external_urls: { spotify: artist_link } }) =>
                name + " "
            )}
            - {name}
          </div>
          <div>label: {label}</div>
        </div>
      </div>
      <Button
        onClick={addAll}
        size="small"
        variant="contained"
        color="secondary"
      >
        all
      </Button>
      <div>
        {tracks.items.map((track) => (
          <TrackTile key={track.uri} {...track} />
        ))}
      </div>
    </div>
  );
};

export default AlbumTile;
