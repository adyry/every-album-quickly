import "./Dashboard.scss";
import axios from "axios";
import { createRef, useContext, useState } from "react";
import { AuthCred } from "../App";
import dayjs from "dayjs";

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
      />
      <audio ref={audioRef} src={preview_url} preload={"none"} />
    </div>
  );
};

const AlbumTile = ({ images, tracks, name, artists, label, setQueue }) => {
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
          <TrackTile
            {...singleTrack}
            key={singleTrack.uri}
            setQueue={setQueue}
          />
        ))}
      </div>
    </div>
  );
};

const date = "20220107";
const dayJSdate = dayjs(date);
const weeks = 44;
const finalDays = dayJSdate.add(weeks, "weeks").format("YYYYMMDD");

const Dashboard = () => {
  const [albums, setAlbums] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueue] = useState([]);
  const { auth } = useContext(AuthCred);

  const getAlbums = async (albumPackets) => {
    const result = await extractTracksFromAlbums(
      auth.access_token,
      albumPackets
    );

    setAlbums(result);
  };

  const scrapeEveryNoise = async () => {
    setIsLoading(true);
    const payload = {
      date: finalDays,
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
    await getAlbums(albumPackets);
    setIsLoading(false);
  };

  return (
    <div className="dashboard">
      {isLoading && "Loading..."}
      {finalDays}
      <button onClick={scrapeEveryNoise}>scrape</button>
      <button onClick={getAlbums}>get tracks</button>
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
