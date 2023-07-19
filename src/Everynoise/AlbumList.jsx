import AlbumTile from "./AlbumTile";

const AlbumList = ({ albums }) => (
  <div className="album-list">
    {albums?.map((album) => (
      <AlbumTile key={album.id} {...album} />
    ))}
  </div>
);

export default AlbumList;
