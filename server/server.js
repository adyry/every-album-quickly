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

const genre =
  "genre=new%20isolationism%2Coutsider%20house%2Cfloat%20house%2Cfluxwork%2Cambient%20idm%2Cexperimental%20ambient%2Cambient%20techno%2Ctechno%2Cexperimental%20techno%2Cminimal%20techno%2Cambient%20dub%20techno%2Cdub%20techno%2Cmicrohouse%2Cbass%20music%2Cwonky%2Cclassic%20dubstep%2Cfuture%20garage%2Cdeep%20dubstep%2Cexperimental%20electronic%2Cuk%20experimental%20electronic%2Crussian%20experimental%20electronic%2Cexperimental%20dubstep%2Cexperimental%20folk%2Cexperimental%20house%2Cghettotech%2Cfootwork%2Cchinese%20experimental%2Cexperimental%20synth%2Cmodular%20synth%2Cintelligent%20dance%20music%2Cexperimental%20club%2Cgrimewave%2Cillbient%2Csound%20art";
app.post(/scrape/, cors(), async (req, res, next) => {
  const response = await axios.get(
    `https://everynoise.com/new_releases_by_genre.cgi?${genre}&region=US&date=${req.body.date}&hidedupes=on&style=list`
  );
  return res.send(response.data);
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
