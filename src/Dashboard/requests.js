import axios from "axios";

export const extractTracksFromAlbums = async (albumsList) =>
  (
    await Promise.all(
      albumsList.map((list) =>
        axios.get(
          `https://api.spotify.com/v1/albums?ids=${list.join(
            ","
          )}&market=from_token`
        )
      )
    ).then((r) => r.map((v) => v.data.albums))
  ).flat();

export const getPlaylist = async (playlistId) => {
  const {
    data: {
      tracks: { total },
    },
  } = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}?fields=tracks.total&market=from_token`
  );

  const urls = [];
  for (let i = 0; total > i * 100; i++) {
    urls[
      i
    ] = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=${
      i * 100
    }&market=from_token`;
  }

  return await Promise.all(urls.map((url) => axios.get(url))).then((r) =>
    r
      .map((v) => v.data.items)
      .flat()
      .map((v) => v.track)
  );
};
