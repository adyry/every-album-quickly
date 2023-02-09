import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";
import { allGenres, myGenres } from "../constants";
import axios from "axios";
import { useState } from "react";
import dayjs from "dayjs";
import { extractTracksFromAlbums } from "../Common/requests";
import AlbumList from "../Common/AlbumList";

const date = "20230106";
const dayJSdate = dayjs(date);

const EverynoiseDiscovery = () => {
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

  return (
    <>
      Scrape everynoise newreleasesbygenre and generate full albums from its
      data.
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
    </>
  );
};

export default EverynoiseDiscovery;
