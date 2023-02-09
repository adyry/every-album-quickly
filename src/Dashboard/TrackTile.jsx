import { useDispatch, useSelector } from "react-redux";
import { createRef, useState } from "react";
import { selectTrack } from "../store/selectedSlice";

const TrackTile = ({ singleTrack, artists, name, preview_url, uri, album }) => {
  const dispatch = useDispatch();
  const checked = useSelector((state) => state.selected.indexOf(uri) !== -1);

  const audioRef = createRef();
  const [focused, setFocused] = useState(false);

  const playPreview = () => {
    if (audioRef.current) audioRef.current.play();
    setFocused(true);
  };

  const stopPreview = () => {
    if (audioRef.current) audioRef.current.pause();
    setFocused(false);
  };

  const addTrack = (e) => {
    if (e.target.dataset && e.target.dataset.value) {
      dispatch(
        selectTrack({
          uri: `${e.target.dataset.value}`,
          checked: !(e.target.dataset.checked === "true"),
        })
      );
    } else {
      dispatch(selectTrack({ uri: e.target.value, checked: e.target.checked }));
    }
  };

  return (
    <div
      className={`track-tile ${focused ? "focused" : ""}`}
      onMouseOver={playPreview}
      onMouseOut={stopPreview}
      onClick={addTrack}
      data-checked={checked}
      data-value={uri}
    >
      {singleTrack && (
        <div className="cover">
          <img src={album.images[2].url} alt="cover" />{" "}
        </div>
      )}
      <label htmlFor={uri}>
        {singleTrack &&
          artists
            .map(
              ({
                name: artistName,
                id,
                external_urls: { spotify: artist_link },
              }) => artistName
            )
            .join(", ") + " - "}
        {name}
      </label>
      <input
        type="checkbox"
        value={uri}
        id={uri}
        onFocus={playPreview}
        onBlur={stopPreview}
        onChange={addTrack}
        checked={checked}
      />
      {preview_url ? (
        <audio ref={audioRef} src={preview_url} preload="none" key={uri} />
      ) : (
        "preview missing"
      )}
    </div>
  );
};

export default TrackTile;
