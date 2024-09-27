import * as React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete, Button, CircularProgress, TextField } from '@mui/material';
import { API } from 'aws-amplify';
import dayjs from 'dayjs';

import CustomDay from '../Common/CustomPicker';
import { extractTracksFromAlbums } from '../Common/requests';
import { allGenres, dateFormat } from '../constants';
import { addSearchDate } from '../store/datesSlice';
import { changeGenres } from '../store/genresSlice';
import AlbumList from './AlbumList';

const EverynoiseDiscovery = () => {
  const [albums, setAlbums] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const selectedGenres = useSelector((state) => state.genres);

  const [value, setValue] = useState(dayjs());

  const scrapeEveryNoise = async () => {
    setIsLoading(true);
    const weekFormatted = value.format(dateFormat);
    try {
      const scrapeUrl = encodeURI(
        `https://everynoise.com/new_releases_by_genre.cgi?genre=${selectedGenres.join(
          ','
        )}&region=US&date=${weekFormatted}&hidedupes=on&style=list`
      ).replace(',', '%2C');

      const payload = {
        scrapeUrl,
      };

      const data = await API.post('scrape', '/scrape', { body: payload });

      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      doc.querySelectorAll('.similargenres ~ tr').forEach((v) => v.remove());
      const tracks = Array.from(doc.querySelectorAll('[href*="spotify:album"]')).map((v) =>
        v.href.replace('spotify:album:', '')
      );
      const albumPackets = [];
      for (let i = 0; i * 20 < tracks.length; i++) {
        albumPackets[i] = tracks.slice(20 * i, 20 + 20 * i);
      }
      const albums = await extractTracksFromAlbums(albumPackets);
      setAlbums(albums);
    } catch (e) {
      if (e.response.status === 401) {
        localStorage.removeItem('auth');
      } else {
        window.alert('Sorry, unhandler error encountered ' + e.message);
      }
    } finally {
      setIsLoading(false);
      dispatch(addSearchDate(value));
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
    const albumsResponse = await extractTracksFromAlbums(albumPackets);
    console.log(
      `${albumsResponse
        .map((a) => a.tracks.items.map((t) => t.uri))
        .flat()
        .join('\n')}`
    );
  };

  window.getFullAlbums = getFullAlbumsUtil;

  return (
    <>
      <div className="control-panel">
        <h4 className="description">
          Scrape everynoise newreleasesbygenre and generate full albums from its data.
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
              <TextField {...params} placeholder={'Choose genres'} label={'Selected genres'} />
            )}
          />
          <div className="buttons-row">
            <CustomDay value={value} setValue={setValue} />
            <Button variant="contained" onClick={scrapeEveryNoise}>
              Find new music from {value.format('DD MMM YYYY')}
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
