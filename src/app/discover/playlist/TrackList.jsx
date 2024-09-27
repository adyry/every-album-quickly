import TrackTile from './TrackTile';

const TrackList = ({ tracks }) => (
  <div className="">
    <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tracks?.map((track) => (
        <TrackTile key={track.id} singleTrack={true} {...track} />
      ))}
    </div>
  </div>
);

export default TrackList;
