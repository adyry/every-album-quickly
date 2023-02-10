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

  const focus = (e) => {
    e.target.focus();
  };

  const stopPreview = () => {
    if (audioRef.current) audioRef.current.pause();
    setFocused(false);
  };

  const keyCheck = (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addTrack(e);
    }
  };

  const addTrack = (e) => {
    dispatch(
      selectTrack({
        uri: `${e.target.dataset.value}`,
        checked: !(e.target.dataset.checked === "true"),
      })
    );
  };

  return (
    <div
      className={`track-tile ${focused ? "focused" : ""} ${
        checked ? "checked" : ""
      }`}
      onMouseOver={focus}
      onMouseOut={stopPreview}
      onClick={addTrack}
      data-checked={checked}
      data-value={uri}
      tabIndex={0}
      onFocus={playPreview}
      onBlur={stopPreview}
      onKeyDown={keyCheck}
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
        checked={checked}
        tabIndex="-1"
        readOnly
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
