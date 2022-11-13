// albums - max 20
import "./Dashboard.scss";
import axios from "axios";
import { createRef, useContext, useState } from "react";
import { AuthCred } from "../App";

const mockAlbumsList = [
  "spotify:album:1PyVnsGN6KYgz7exGmppJx",
  "spotify:album:2S9IkYjEwf2vNfu7B9HEJJ",
  "spotify:album:4RQj8RhDHZLIsOGLce5Ms1",
  "spotify:album:7jay2BZxS92kLuIjyTI9dr",
  "spotify:album:0ZIAxgZ9JSCiHeAu7cS5PL",
  "spotify:album:5WMLHPd8RBkZdWFfOoVlwk",
  "spotify:album:7Dz1bxlj6s0GSNxm7sYPnJ",
  "spotify:album:7hZUXZMBt4I2mHzWXubUt9",
  "spotify:album:43M44c0UDuQU1laM52Aqfj",
  "spotify:album:4wy04H0jJwAHHFcjsztdHR",
  "spotify:album:4NR16p55QBcywOiuEpbBDJ",
  "spotify:album:1Iv62JooT1RSRORKd9PUgf",
  "spotify:album:0QNemORnj5V5C17K26tpf1",
  "spotify:album:4Clyd4AOshBy4nyXZEQSsS",
  "spotify:album:7CiuYJVx1NrdZhzcWs9OeO",
  "spotify:album:6d9RyDwoZCI52HG5sQVUbz",
  "spotify:album:5EJGjTIElYoXsaEEJi0XSL",
  "spotify:album:2envUY0hp4YQE2ioWBbJog",
  "spotify:album:22uadwnAhh319Td0lRmQG5",
  "spotify:album:2OlC2scvbBrfNT9Jn6mUMd",
  "spotify:album:3c2wSho9IBrqrtdRfH0IzD",
  "spotify:album:1xabxmcBqj3PTtni5IeP68",
  "spotify:album:7HhVsiE0RjoBhLvE3P1O6u",
  "spotify:album:5P418Y7XOGbkFBIpeXf3ws",
  "spotify:album:7FMOwkcdqSVLbGkz1RrcEQ",
  "spotify:album:7D3yCBSFNDZNmr9WsdszVI",
  "spotify:album:3tGrA4cN00nEM1PwyIp6Mn",
  "spotify:album:2qTXiZXOqTEwwfcAVo76bR",
  "spotify:album:2adpzU7P5qLp3KEmvqpa5A",
  "spotify:album:3CuYLC6JJx95n0zRfBShxZ",
  "spotify:album:3Qk1ydD4XDPOdLOOqCF4Lh",
  "spotify:album:2TEkCtf9CRySr945QROrhc",
  "spotify:album:3cUhfAn80FDkGdrVfzFDgV",
  "spotify:album:4jpDba5X8H8SRCBiFkfDMv",
  "spotify:album:1yy1T74ui3zHYJrAjuFFNJ",
  "spotify:album:4tUCdrXE4DkY5XaEeFDJNq",
  "spotify:album:4Yt2isidThUzgrlKvrhqnl",
  "spotify:album:3FxrSslA4gg6EZTk8ODRmi",
  "spotify:album:3p01qlGJtNhyH7nYmkHBwn",
  "spotify:album:0UuZahvdEKFd44mgcC1oaF",
  "spotify:album:6lgvER1b4uvkNk9aBXpcQ5",
  "spotify:album:0qv2NFr1xWjM9DbIHjfqHx",
  "spotify:album:5bojgZGUVicxAh5YD54PGD",
  "spotify:album:2mUMPmH9LF4oDLhCzSN9nQ",
  "spotify:album:4d4jcU0a69rFbun9oKffCL",
  // "spotify:album:5RusCrgpDqzFCxegaVodJQ",
  // "spotify:album:5w1QMAj5S3n0H60nxaNjYR",
  // "spotify:album:4zSxg2pwZxFheLR5obAQB3",
  // "spotify:album:7tHqARSH3HwOgKp1MhIlgX",
  // "spotify:album:415LLJBIUTeexhVtCYu2iv",
  // "spotify:album:1H8Gn0zGIcfNOE57swNqfo",
  // "spotify:album:3XaYZUHz41sc7ujxZqxilM",
  // "spotify:album:0qXryvi4IcgAdXQMRMkg4f",
  // "spotify:album:5OhOUAoW7nyOD1vhIT3UYj",
  // "spotify:album:69HBqxl00s2sv0Y68pX2qy",
  // "spotify:album:404JnVB6X4qpmN2r1XbKad",
  // "spotify:album:0T4wmfAcQ2Z1KIrnJlyqAO",
  // "spotify:album:7z0Wi8Y2zF0gjVNlJTEIvg",
  // "spotify:album:0EDqwZ2AGMDpyJebEzqBF9",
  // "spotify:album:0HcjY4DsLpHHUu4JgbMoHC",
  // "spotify:album:1wFbK7G7K1vIfJTnzrLggn",
  // "spotify:album:0xVVjEWiQlrvOjYKBnfeVo",
  // "spotify:album:6Vl6fcXiyDvdZPNHnVt9qy",
  // "spotify:album:4CNrroncVucaXFT3hVRfRQ",
  // "spotify:album:5jk5ALXrw8NozZkFnETcw0",
  // "spotify:album:1IfkgBXZpVxe5PakAWf4gb",
  // "spotify:album:3QPLm7Ek6zRx5b29M3R8aJ",
  // "spotify:album:5MJV3RrSGrcpd7HeExeDM7",
  // "spotify:album:7K8RJNBjoUJrM9mnXQrqfn",
  // "spotify:album:71lanEVXy5sbVGauaxRVSa",
  // "spotify:album:1CzYpmYhNOF9xZbcumXUS0",
  // "spotify:album:1IUc97G1E3C5kc0lhEjsQa",
  // "spotify:album:7vQD6ItksetsXPpDkxpaRQ",
  // "spotify:album:4q4f8oUYXOzFu3O5ikKK8k",
  // "spotify:album:0GvFvuTJTQ446QE1s18wJi",
  // "spotify:album:08dxFVS8NDXVKHkgVDLITe",
  // "spotify:album:05VFHWNox6rXeRj5oZffhk",
  // "spotify:album:74krBXw71DB1TjIuPJgD3X",
  // "spotify:album:7roJaJlTYyQMii6DgqVhZF",
  // "spotify:album:77JlG0GyAoE62Ng5v9fSXQ",
  // "spotify:album:56SIFQbNZxtDjQATfa26gI",
  // "spotify:album:6fxuLoc2x5pmPpenLsONtv",
  // "spotify:album:1Vm1f8irxwi2mkr3CZlFm4",
  // "spotify:album:1skDM6bDRwbFPPqgrJcFYa",
  // "spotify:album:6W6PXpiLO5GKjMvrIsnQpE",
  // "spotify:album:3v1KTtcN8hMJ4QO67r0isL",
  // "spotify:album:0AdCRc1oxkcPU7c0RoniSi",
  // "spotify:album:2jclFryjYju65JQAVjvZ7D",
  // "spotify:album:6cpSemkmcm64LnJY8BZ1Ot",
  // "spotify:album:31sEy1PNoKbx0Op7OIlMyN",
  // "spotify:album:6LYGZT3zzHlJZYnIY75A6c",
  // "spotify:album:6SdmBR4O7iC5ZwPrRoj6Pa",
  // "spotify:album:3UogOV8T1LZJqrdNAnQ6ls",
  // "spotify:album:5nqLOxlhk3sbbSadETeAx9",
  // "spotify:album:4EbD4M7LlABfWO7BffiKJH",
  // "spotify:album:1cpcLbOkddHBG5QapDrpYG",
  // "spotify:album:4oiXhIfLLTjiKCDDf7lkHV",
  // "spotify:album:062bpmQAUsMZZ4GydQYfns",
  // "spotify:album:1LJdiwZHu22eqDls849Gmf",
  // "spotify:album:7iKSGuQC37JOf7AELTjwyw",
  // "spotify:album:6i5Io2vkN11BJdVL3vkq0m",
  // "spotify:album:1NXbRThuLLae8FHXkL4tgq",
  // "spotify:album:2wdfP8ZepuYBjNC3mDBb73",
  // "spotify:album:0sbQEkQeJMRseTs2wEX9a9",
  // "spotify:album:2sODqxy1e7F4OkjQb7FZDk",
  // "spotify:album:4eSo2H0pWwYbWQvWk92UZ0",
  // "spotify:album:44CUFeh0zGY0EomFY2Hfo9",
  // "spotify:album:5yT53aGHHsWBpMn2mtLpae",
  // "spotify:album:0PETRWJv49N98MHwqFBGyO",
  // "spotify:album:1DtjbG6Y6mma7ZjIqgNKlm",
  // "spotify:album:0QgzD9uaXYFfohdHQPKYG1",
  // "spotify:album:0DcplCigDrsu8kct7KEHiZ",
  // "spotify:album:2bXGduUnVDBEkKZ8Y6NyH2",
  // "spotify:album:5NWEvvWuzK8C9ncKDitaTl",
  // "spotify:album:6OzBTLMEWk8e2xVHtqdKiL",
  // "spotify:album:6Mp6djtEjAyKHLz6GoJOX5",
  // "spotify:album:5hvJWFe46X0IIIHkip3O9A",
  // "spotify:album:3WCJbQKnny0K1MaDm0voET",
  // "spotify:album:3lybxexrqkCzvmQMZAF4q2",
  // "spotify:album:2qcuFIxtn41Wg6BpkG71qj",
  // "spotify:album:6zKEE7oVuJyBcbSBNv9C44",
  // "spotify:album:3pa8bw0wupP5r1oXoyJKMi",
  // "spotify:album:2E2XGv2yJ932UFTe9W8NTC",
  // "spotify:album:6u2r60Dla1trLrwgcQdKiG",
  // "spotify:album:1i3BeTyMUTLjT1djVOWOZQ",
  // "spotify:album:2P5d5EASS8iyz32WX5CyaA",
  // "spotify:album:6IwfWi3xbNBreTgs5kq3ts",
  // "spotify:album:0TjTQZ3p6WAE0PKabFJ9rb",
  // "spotify:album:4BU076NUFmauZv5MLeO85c",
  // "spotify:album:0Kt3792h0pp08o58RVYPo1",
  // "spotify:album:2YvgUFK2a1JkGJMEmBFe9S",
  // "spotify:album:2QCUYzM0yJHMoGCdSb3TvO",
  // "spotify:album:3fEMrOi2QrXd14IIkgGnU3",
  // "spotify:album:0SDlxuQipxhMzGkMjDB0KI",
  // "spotify:album:17WnnImmGTCe9YtIQXeTCS",
  // "spotify:album:5G9UMRRXSImGS8hnuJ7ub5",
  // "spotify:album:73L4Ojf4YA3rGdNPVqUtPa",
  // "spotify:album:25lITyw4kPaAcB05irimwh",
  // "spotify:album:67XhZnlLgkr1F4QgWOgs4u",
  // "spotify:album:4gKHZI4u5hA1y44nBVy2Yw",
  // "spotify:album:6wGE6yFkKfHXPqsfpJUjTG",
  // "spotify:album:2oLCpbMvY0DPSBz6EDPtoQ",
  // "spotify:album:1Go6FfjxKnKipsnWuPJPZb",
  // "spotify:album:3oPHTePTo4H7eilavdlTXl",
  // "spotify:album:1a7AiwyYzT2vg8u7d5W2M8",
  // "spotify:album:6rs5mcb21HpS81XzpGzHXK",
  // "spotify:album:1chrqYTYTPyvuEGm1AOB9O",
  // "spotify:album:3Zw4NbpsoqHEzebdq6Ym5d",
  // "spotify:album:6XZ36pHCCs3SvAj4kIWTEr",
  // "spotify:album:5psGkgrLfu3b1F5cPankhz",
  // "spotify:album:759m4rDOFdBzVE3XUBWchY",
  // "spotify:album:3FWxAdINGezf6HVoK2847t",
  // "spotify:album:1qcUQrGkKrSaO07NywcSqC",
  // "spotify:album:5ECz0V4xk6veOIcAaa8MWG",
  // "spotify:album:3XuLYLkWUFqqezowe6TIXd",
  // "spotify:album:4tM4lYJTgs08AftYWi4lIF",
  // "spotify:album:0d1kn5JipyhVH7TOSnx4jw",
  // "spotify:album:0e8rMAuvRk0fcMzIxKbTha",
  // "spotify:album:7EDhbOjcDtWoZsWEwZPLZO",
  // "spotify:album:0qq7u8QshVMzzMaxbNVTwx",
  // "spotify:album:5lbiP1DLW9DrB5BB3dH3x9",
  // "spotify:album:10R86B7gmlS7yVf8IBx9uE",
  // "spotify:album:7zKHHjgqhxrzHZ55whKjKz",
  // "spotify:album:10Oj33ape4hm3KbaKIPPSv",
  // "spotify:album:1QRustkabNUNqbDBnD56gC",
  // "spotify:album:5xRDIfdmD5PQW4hvQYJDgb",
  // "spotify:album:4HyqfPpGsYTZ0J9095RnRv",
  // "spotify:album:2ywexsHX1MUToJaByaEYYQ",
  // "spotify:album:0WztUZdJRvM8dnVNIerUTR",
  // "spotify:album:5Sv7uSGM3hJojVhh0XcTQM",
  // "spotify:album:3TK3lFDjCXRwcTi4y1lFBl",
  // "spotify:album:12UUPSWDYfKmOZ0mu3ccHp",
  // "spotify:album:1yC1oAgV79AyQCmIpZd1DG",
  // "spotify:album:3uPnVWcOnU39RXM3xcEr6V",
  // "spotify:album:6GbmAduqZCHYpvwukoOD6D",
  // "spotify:album:5GFGwSmiG1q67PZdB9ZXl0",
  // "spotify:album:3OV1LztaL4mSfDiuTv21e4",
  // "spotify:album:232L7VuK2OAn3Ey8VKJlsO",
  // "spotify:album:4OabJqHFwF95mRUrOr9JWU",
  // "spotify:album:5A0oImLl5YjEZmF4HsIoXB",
  // "spotify:album:1EH5Ae28fHOeHQXuYmDGlC",
  // "spotify:album:6EraStUAgP8JmGn3rjc2B0",
  // "spotify:album:7bs5HnraLbOlSz7aSayzxC",
  // "spotify:album:4Stw6ApLxbdaNcc6h2v6KA",
  // "spotify:album:1GGn9rZec3C1EhY1fhZ7mD",
  // "spotify:album:2OryCFlfAQOk9YcV2KLLRT",
  // "spotify:album:0sYiAsL5hAT0try3jwvcgY",
  // "spotify:album:0ApIly8o0VfwwpmMBRcD6Y",
  // "spotify:album:68JS31yjnRWqVM55KyQMkX",
  // "spotify:album:2iQ6W9OkRhkPtQwhF4QPFd",
  // "spotify:album:3kWV1gSUWDRg5H5ofyfVak",
  // "spotify:album:2d8dJSXN7QHIfUfP0kSxBB",
  // "spotify:album:1qTdDWCdIEv9M0wX59F0NR",
  // "spotify:album:3650voEPsDYYKjv4VCwTPN",
  // "spotify:album:5FvsKFeBTicQfQNEltHaMf",
  // "spotify:album:2CNjzFrcaaJfkMuGBXAdNI",
  // "spotify:album:5X7wyTn9oPBGcGpJXuovjI",
  // "spotify:album:21asuFPhjc3BmZeIEs0GZw",
  // "spotify:album:7H8tosp6WvNlaM0GfBkY6J",
  // "spotify:album:6bQaz0nmIdFc26xVcu6sSS",
  // "spotify:album:5QfBE0UfCsaxyNpkJ57NGZ",
  // "spotify:album:7D5wbln1OJEgV20GkQzyvn",
  // "spotify:album:0mgNhL6qu4YP4cqwudyHJ2",
  // "spotify:album:7difwqSW4SunSEk9n3gVvd",
  // "spotify:album:4sQQZTS2Vv2g9T4eZIJQV1",
  // "spotify:album:0HalemkF322rRG5CwqR6Yn",
  // "spotify:album:5IAiKs09l4DvJdTlG07oba",
  // "spotify:album:4TheMbO9MrRGaDzJwyTyVx",
  // "spotify:album:0hkZKleVUQc8Gu0f8TEbqd",
  // "spotify:album:3CazbQ5aCbtEHfei5OcCds",
  // "spotify:album:6ZaPNal2QY68dAYPZPaESU",
  // "spotify:album:4EPwEa39LxGcRI9LSM2jOL",
  // "spotify:album:1BbQwgyJRnuA9VGx43f5Ku",
  "spotify:album:54VghnSD6AGCXizk5GEroL",
].map((v) => v.replace("spotify:album:", ""));

const albumPackets = [];
for (let i = 0; i * 20 < mockAlbumsList.length; i++) {
  albumPackets[i] = mockAlbumsList.slice(20 * i, 20 + 20 * i);
}

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
  const audioRef = createRef();

  const playPreview = () => {
    audioRef.current.play();
  };

  const stopPreview = () => {
    audioRef.current.pause();
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
      />
      <audio ref={audioRef} src={preview_url} preload={"none"} />
    </div>
  );
};

const AlbumTile = ({ images, tracks, name, artists, label }) => {
  return (
    <div className="album-tile">
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
          <TrackTile {...singleTrack} key={singleTrack.uri} />
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [albums, setAlbums] = useState();
  const { auth } = useContext(AuthCred);

  const getAlbums = async () => {
    const result = await extractTracksFromAlbums(
      auth.access_token,
      albumPackets
    );

    setAlbums(result);
  };

  const scrapeEveryNoise = async () => {
    const { data } = await axios.get("http://localhost:9000/scrape");
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    console.log(doc);
  };

  return (
    <div className="dashboard">
      <button onClick={scrapeEveryNoise}>scrape</button>
      <button onClick={getAlbums}>get tracks</button>
      <div className="albums-list">
        {albums?.map((album) => (
          <AlbumTile key={album.id} {...album} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
