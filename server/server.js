const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const app = express();
const axios = require("axios");
require("dotenv").config();
const PORT = process.env.PORT || 9000;
const bodyParser = require("body-parser");

var corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// your application requests authorization
var authOptions = {
  url: "https://accounts.spotify.com/api/token",
  headers: {
    Authorization:
      "Basic " +
      new Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
      ).toString("base64"),
  },
  form: {
    grant_type: "client_credentials",
  },
  json: true,
};

const extractTracksFromAlbums = async (token, albumsList) => {
  const albumsData = (
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

  const trackLists = albumsData.map((v) => v.tracks);
  const tracks = trackLists.map((v) => v.items).flat();
  return tracks.map((v) => v.uri + "\n");
};

app.listen(PORT, (error) => {
  if (error) {
    return console.log("Error during app startup", error);
  }
  console.log("listening on " + PORT + "...");
});

// const indexPath = path.resolve(__dirname, "..", "build", "index.html");

app.use(
  express.static(path.resolve(__dirname, "web", "build"), { maxAge: "30d" })
);

app.post(/scrape/, cors(), async (req, res, next) => {
  const response = await axios.get(req.body.scrapeUrl);
  return res.send(response.data);
  // return res.send(mock);
});

// app.get("*", (req, res, next) => {
//   fs.readFile(indexPath, "utf8", (err, htmlData) => {
//     if (err) {
//       console.error("Error during file reading", err);
//       return res.status(404).end();
//     }
//     return res.send(htmlData);
//   });
// });
