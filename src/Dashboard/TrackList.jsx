import TrackTile from "./TrackTile";

const TrackList = ({ tracks }) => (
  <div className="track-list">
    {tracks?.map((track) => (
      <TrackTile key={track.id} singleTrack={true} {...track} />
    ))}
  </div>
);

export default TrackList;
