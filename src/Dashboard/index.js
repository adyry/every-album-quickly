import "./Dashboard.scss";
import axios from "axios";
import { useState } from "react";
import dayjs from "dayjs";
import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import { allGenres, myGenres } from "../constants.js";
import AlbumList from "./AlbumList";
import TrackList from "./TrackList";
import { extractTracksFromAlbums, getPlaylist } from "./requests";
import Selected from "./Selected";

const date = "20230106";
const dayJSdate = dayjs(date);

const Dashboard = () => {
  const [albums, setAlbums] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState(myGenres);
  const [week, setWeek] = useState(0);

  const weekFormatted = dayJSdate.add(week, "weeks").format("YYYYMMDD");
  const scrapeUrl = encodeURI(
    `https://everynoise.com/new_releases_by_genre.cgi?genre=${selectedGenres.join(
      ","
    )}&region=US&date=${weekFormatted}&hidedupes=on&style=list`
  ).replace(",", "%2C");

  const getAlbums = async (albumPackets) =>
    await extractTracksFromAlbums(albumPackets);

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
    doc.querySelectorAll(".similargenres ~ tr").forEach((v) => v.remove());
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

  const [playlistUri, setPlaylistUri] = useState("5h0RKfezC0vmHziRkXdWzI");
  const [tracks, setTracks] = useState();

  const onPlaylistUriChange = (e) => {
    setPlaylistUri(e.target.value);
  };

  const readPlaylist = async () => {
    const result = await getPlaylist(playlistUri);
    setTracks(result);
  };

  return (
    <div className="dashboard">
      <section>
        Everynoise Albums
        {isLoading && (
          <div className="loader">
            <CircularProgress />
            Scraping everynoise... might take a while
          </div>
        )}
        <Autocomplete
          onChange={onGenreChange}
          selectOnFocus
          blurOnSelect
          filterSelectedOptions
          autoSelect
          handleHomeEndKeys
          multiple
          options={allGenres}
          value={selectedGenres}
          renderInput={(params) => (
            <TextField {...params} placeholder={"Choose genres"} />
          )}
        />
        <FormControl>
          <TextField
            onChange={onWeekChange}
            value={week}
            label={"week"}
            type={"number"}
          />
          {weekFormatted}
        </FormControl>
        <Button variant="contained" onClick={scrapeEveryNoise}>
          scrape albums
        </Button>
        <AlbumList albums={albums} />
      </section>
      <section>
        Playlists <br />
        <FormControl>
          <TextField
            onChange={onPlaylistUriChange}
            value={playlistUri}
            label="Playlist URI"
          />
        </FormControl>
        <Button variant="contained" onClick={readPlaylist}>
          read playlist
        </Button>
        <TrackList tracks={tracks} />
      </section>
      <section>
        <Selected />
      </section>
    </div>
  );
};

export default Dashboard;
