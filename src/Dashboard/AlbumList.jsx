import AlbumTile from "./AlbumTile";

const AlbumList = ({ albums }) => (
  <div className="albums-list">
    {albums?.map((album) => (
      <AlbumTile key={album.id} {...album} />
    ))}
  </div>
);

export default AlbumList;
