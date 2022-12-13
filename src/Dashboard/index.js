import "./Dashboard.scss";
import axios from "axios";
import { createRef, useContext, useState } from "react";
import { AuthCred } from "../App";
import dayjs from "dayjs";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { allGenres, myGenres } from "../constants.js";
import { useDispatch, useSelector } from "react-redux";
import { selectTrack } from "../store/selectedSlice";

const extractTracksFromAlbums = async (token, albumsList) => {
  return (
    await Promise.all(
      albumsList.map((list) =>
        axios.get(`https://api.spotify.com/v1/albums?ids=${list.join(",")}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      )
    ).then((r) => r.map((v) => v.data.albums))
  ).flat();
};

const TrackTile = ({ artists, name, preview_url, track_number, uri }) => {
  const dispatch = useDispatch();
  const checked = useSelector((state) => state.selected.indexOf(uri) !== -1);
  // const [audio, setAudio] = useState(false);
  const audioRef = createRef();
  // const playPromise = createRef();
  const playPreview = () => {
    // setAudio(true);
    // audioRef.current.src = preview_url;
    // playPromise.current = audioRef.current.play();
    audioRef.current.play();
  };

  // useEffect(() => {
  //   if (audioRef.current) {
  //     audioRef.current.play();
  //   }
  // }, [audioRef]);

  const stopPreview = () => {
    // setAudio(false);
    // console.log(playPromise.current);

    audioRef.current.pause();

    // console.log(audioRef, playPromise.current);
  };

  const addTrack = (e) => {
    dispatch(selectTrack({ uri: e.target.value, checked: e.target.checked }));
  };

  return (
    <div>
      <label htmlFor={uri}>{name}</label>
      <input
        type="checkbox"
        value={uri}
        id={uri}
        onFocus={playPreview}
        onBlur={stopPreview}
        onChange={addTrack}
        checked={checked}
      />
      {/*{audio && (*/}
      <audio ref={audioRef} src={preview_url} preload="auto" key={uri} />
      {/*)}*/}
    </div>
  );
};

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
          ({ name, id, external_urls: { spotify: artist_link } }) => name
        )}{" "}
        - {name}
      </div>
      <div>label: {label}</div>
      <div>
        <img src={images[2].url} alt="cover" />{" "}
      </div>
      <div>
        {tracks.items.map((singleTrack) => (
          <TrackTile {...singleTrack} key={singleTrack.uri} />
        ))}
      </div>
    </div>
  );
};

const date = "20220107";
const dayJSdate = dayjs(date);

const Dashboard = () => {
  const selected = useSelector((state) => state.selected);
  const [albums, setAlbums] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState(myGenres);
  const [week, setWeek] = useState(36);
  const { auth } = useContext(AuthCred);
  const weekFormatted = dayJSdate.add(week, "weeks").format("YYYYMMDD");
  const scrapeUrl = encodeURI(
    `https://everynoise.com/new_releases_by_genre.cgi?genre=${selectedGenres.join(
      ","
    )}&region=US&date=${weekFormatted}&hidedupes=on&style=list`
  ).replace(",", "%2C");

  const getAlbums = async (albumPackets) =>
    await extractTracksFromAlbums(auth.access_token, albumPackets);

  // add album URIs into trakcs
  const getFullAlbumsUtil = async (albumURIArray) => {
    const albumPackets = [];
    for (let i = 0; i * 20 < albumURIArray.length; i++) {
      albumPackets[i] = albumURIArray.slice(20 * i, 20 + 20 * i);
    }
    const albumsResponse = await getAlbums(albumPackets);
    console.log(
      `${albumsResponse
        .map((a) => a.tracks.items.map((t) => t.uri))
        .flat()
        .join("\n")}`
    );
  };

  window.getFullAlbums = getFullAlbumsUtil;

  const scrapeEveryNoise = async () => {
    setIsLoading(true);
    const payload = {
      scrapeUrl,
    };
    const { data } = await axios.post("http://localhost:9000/scrape", payload);
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    const tracks = Array.from(
      doc.querySelectorAll('[href*="spotify:album"]')
    ).map((v) => v.href.replace("spotify:album:", ""));
    const albumPackets = [];
    for (let i = 0; i * 20 < tracks.length; i++) {
      albumPackets[i] = tracks.slice(20 * i, 20 + 20 * i);
    }
    const albums = await getAlbums(albumPackets);
    setAlbums(albums);
    setIsLoading(false);
  };

  const onGenreChange = (e, data) => {
    setSelectedGenres(data);
  };

  const onWeekChange = (e) => {
    setWeek(parseInt(e.target.value));
  };

  return (
    <div className="dashboard">
      {isLoading && "Scraping everynoise... might take a while"}
      <Autocomplete
        onChange={onGenreChange}
        selectOnFocus
        blurOnSelect
        filterSelectedOptions
        autoSelect
        handleHomeEndKeys
        multiple
        options={allGenres}
        defaultValue={selectedGenres}
        renderInput={(params) => (
          <TextField {...params} placeholder={"Choose genres"} />
        )}
      />
      <FormControl>
        <TextField onChange={onWeekChange} value={week} label={"week"} />
        {weekFormatted}
      </FormControl>
      <button onClick={scrapeEveryNoise}>scrape</button>
      <div className="albums-list">
        {albums?.map((album) => (
          <AlbumTile key={album.id} {...album} />
        ))}
      </div>
      <textarea value={selected.join(`\n`)} rows={selected.length} readOnly />
    </div>
  );
};

export default Dashboard;
