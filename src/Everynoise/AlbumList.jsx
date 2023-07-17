import AlbumTile from "./AlbumTile";

const AlbumList = ({ albums }) => (
  // <div className="album-list-wrapper">
  //   <VirtuosoGrid
  //     style={{ flex: 1, minHeight: "80vh" }}
  //     overscan={200}
  //     data={albums}
  //     itemContent={(index, data) => {
  //       return <AlbumTile key={data.id} {...data} />;
  //     }}
  //     itemClassName="album-item"
  //     listClassName="album-list"
  //   />
  // </div>
  <div className="album-list">
    {albums?.map((album) => (
      <AlbumTile key={album.id} {...album} />
    ))}
  </div>
);

export default AlbumList;
