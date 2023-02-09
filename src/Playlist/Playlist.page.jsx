import PlaylistDiscovery from "./PlaylistDiscovery";
import Selected from "../Common/Selected";

const EverynoisePage = () => {
  return (
    <div className="dashboard">
      <section>
        <PlaylistDiscovery />
      </section>
      <section>
        <Selected />
      </section>
    </div>
  );
};

export default EverynoisePage;
