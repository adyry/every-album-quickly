import axios from "axios";

export const extractTracksFromAlbums = async (albumsList, token) =>
  (
    await Promise.all(
      albumsList.map((list) =>
        axios.get(
          `https://api.spotify.com/v1/albums?ids=${list.join(
            ","
          )}&market=from_token`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
      )
    ).then((r) => r.map((v) => v.data.albums))
  ).flat();

export const getPlaylist = async (playlistId, token) => {
  const { data } = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}?market=from_token`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const total = data.tracks.total;

  const urls = [];
  for (let i = 0; total > i * 100; i++) {
    urls[
      i
    ] = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=${
      i * 100
    }&market=from_token`;
  }

  const tracks = await Promise.all(
    urls.map((url) =>
      axios.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
    )
  ).then((r) =>
    r
      .map((v) => v.data.items)
      .flat()
      .map((v) => v.track)
  );

  return { tracks, playlist: data };
};
