import TrackTile from "./TrackTile";
import { VirtuosoGrid } from "react-virtuoso";

const TrackList = ({ tracks }) => (
  <div className="track-list-wrapper">
    <VirtuosoGrid
      style={{ flex: 1, minHeight: "80vh" }}
      overscan={200}
      data={tracks}
      itemContent={(index, data) => {
        return <TrackTile key={data.id} singleTrack={true} {...data} />;
      }}
      itemClassName="track-item"
      listClassName="track-list"
    />
  </div>
);

export default TrackList;
