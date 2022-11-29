import "./Dashboard.scss";
import axios from "axios";
import { createRef, useContext, useState } from "react";
import { AuthCred } from "../App";
import dayjs from "dayjs";
import { Autocomplete, TextField } from "@mui/material";
import allGenres from "../all_genres.json";

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

const TrackTile = ({
  artists,
  name,
  preview_url,
  track_number,
  uri,
  setQueue,
  selected,
}) => {
  const audioRef = createRef();

  const playPreview = () => {
    audioRef.current.play();
  };

  const stopPreview = () => {
    audioRef.current.pause();
  };

  const addTrack = (e) => {
    if (e.target.checked) {
      setQueue((prev) => [...prev, e.target.value]);
    } else {
      setQueue((prev) => {
        const newQue = [...prev];
        newQue.splice(prev.findIndex((item) => item === e.target.value));
        return newQue;
      });
    }
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
        checked={selected}
      />
      <audio ref={audioRef} src={preview_url} preload={"none"} />
    </div>
  );
};

const AlbumTile = ({ images, tracks, name, artists, label, setQueue }) => {
  const [allSelected, setAllSelected] = useState(false);

  const onAlbumKeyPress = (e) => {
    console.log(e.key);
    if (e.key === "a") {
      setAllSelected(true);
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
        <img src={images[2].url} />{" "}
      </div>
      <div>
        {tracks.items.map((singleTrack) => (
          <TrackTile
            {...singleTrack}
            key={singleTrack.uri}
            setQueue={setQueue}
            selected={allSelected}
          />
        ))}
      </div>
    </div>
  );
};

const date = "20220107";
const dayJSdate = dayjs(date);
const weeks = 36;
const finalDays = dayJSdate.add(weeks, "weeks").format("YYYYMMDD");

const Dashboard = () => {
  const [albums, setAlbums] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const { auth } = useContext(AuthCred);
  const scrapeUrl = encodeURI(
    `https://everynoise.com/new_releases_by_genre.cgi?genre=${selectedGenres.join(
      ","
    )}&region=US&date=${finalDays}&hidedupes=on&style=list`
  ).replace(",", "%2C");

  const getAlbums = async (albumPackets) =>
    await extractTracksFromAlbums(auth.access_token, albumPackets);

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
        renderInput={(params) => (
          <TextField {...params} placeholder={"Choose genres"} />
        )}
      />
      <button onClick={scrapeEveryNoise}>scrape</button>
      <div className="albums-list">
        {albums?.map((album) => (
          <AlbumTile key={album.id} {...album} setQueue={setQueue} />
        ))}
      </div>
      <textarea value={queue.join(`\n`)} rows={queue.length} />
    </div>
  );
};

export default Dashboard;
