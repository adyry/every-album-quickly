import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { allGenres, dateFormat } from "../constants";
import * as React from "react";
import { useState } from "react";
import dayjs from "dayjs";
import { extractTracksFromAlbums, getPlaylist } from "../Common/requests";
import AlbumList from "./AlbumList";
import { API } from "aws-amplify";
import CustomDay from "../Common/CustomPicker";
import { useDispatch, useSelector } from "react-redux";
import { changeGenres } from "../store/genresSlice";
import { addSearchDate } from "../store/datesSlice";
import { changeName } from "../store/playlistNameSlice";

const EverynoiseDiscovery = () => {
  const [albums, setAlbums] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const selectedGenres = useSelector((state) => state.genres);
  const auth = useSelector((state) => state.auth);

  const [value, setValue] = useState(dayjs());

  const scrapeEveryNoise = async () => {
    setIsLoading(true);
    const weekFormatted = value.format(dateFormat);
    try {
      const scrapeUrl = encodeURI(
        `https://everynoise.com/new_releases_by_genre.cgi?genre=${selectedGenres.join(
          ","
        )}&region=US&date=${weekFormatted}&hidedupes=on&style=list`
      ).replace(",", "%2C");

      const payload = {
        scrapeUrl,
      };

      const data = await API.post("scrape", "/scrape", { body: payload });

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
      const albums = await extractTracksFromAlbums(
        albumPackets,
        auth?.access_token
      );
      setAlbums(albums);
      dispatch(addSearchDate(value));
      dispatch(
        changeName(
          `My "${selectedGenres.join(", ")}" selection from ${value.format(
            "DD.MM.YYYY"
          )}`
        )
      );
    } catch (e) {
      if (e.response.status === 401) {
        localStorage.removeItem("auth");
      } else {
        window.alert("Sorry, unhandler error encountered " + e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onGenreChange = (e, data) => {
    dispatch(changeGenres(data));
  };

  // add album URIs into trakcs
  const getFullAlbumsUtil = async (albumURIArray) => {
    const albumPackets = [];
    for (let i = 0; i * 20 < albumURIArray.length; i++) {
      albumPackets[i] = albumURIArray.slice(20 * i, 20 + 20 * i);
    }
    const albumsResponse = await extractTracksFromAlbums(
      albumPackets,
      auth?.access_token
    );
    console.log(
      `${albumsResponse
        .map((a) => a.tracks.items.map((t) => t.uri))
        .flat()
        .join("\n")}`
    );
  };

  const playlists = [
    "1zl1WGDUoMC16pMvhHygND",
    "7muK2NSHdesUB7mnZRtLqE",
    "359rWCKvP83aCK2dqMcbMM",
    "7ETZer5UAVFYXFEYr44C77",
    "0lxVOxOjBC2CkW1A9VLyh9",
    "01Hfv1huaNSTbpUaQabMMc",
    "1pcJLtlJUG39PtVLg5NXtu",
    "1yNS1A30b6FLshzPWP427P",
    "3kSnAlOpcpwCSG23L575S0",
    "4bz1xDesX2oWsv2buHmVrG",
    "70ZldwWiumBTL3Rv5BpgwM",
    "4QL3vOpcbcDXAib4I0CE9q",
    "1RCfOwe28Z10RgIfX9WgbH",
    "4RgcH7VGpJJLDexGk3HeKT",
  ];

  const getMarta = async () => {
    const playlistyM = await Promise.all(
      playlists.map((list) => getPlaylist(list, auth?.access_token))
    );
    const src = playlistyM[0];
    const rest = playlistyM
      .slice(1)
      .map((e) => e.tracks)
      .flat();
    console.log(
      src.tracks
        .filter((track) => !rest.some((flatt) => flatt.id === track.id))
        .map((e) => e.uri)
        .join(`\n`)
    );
  };

  window.getFullAlbums = getFullAlbumsUtil;
  window.getMarta = getMarta;

  return (
    <>
      <div className="control-panel">
        <h4 className="description">
          Scrape everynoise newreleasesbygenre and generate full albums from its
          data.
          <br />
          <br />
          Select genres, week and click Find.
        </h4>
        <div className="scraper-controls">
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
              <TextField
                {...params}
                placeholder={"Choose genres"}
                label={"Selected genres"}
              />
            )}
          />
          <div className="buttons-row">
            <CustomDay value={value} setValue={setValue} />
            <Button variant="contained" onClick={scrapeEveryNoise}>
              Find new music from {value.format("DD MMM YYYY")}
            </Button>
          </div>
        </div>
      </div>
      <AlbumList albums={albums} />
      {isLoading && (
        <div className="loader">
          <CircularProgress />
          Scraping everynoise... might take a while
        </div>
      )}
    </>
  );
};

export default EverynoiseDiscovery;
