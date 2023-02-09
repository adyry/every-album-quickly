import Selected from "../Common/Selected";
import EverynoiseDiscovery from "./EverynoiseDiscovery";

const EverynoisePage = () => {
  return (
    <div className="dashboard">
      <section>
        <EverynoiseDiscovery />
      </section>
      <section>
        <Selected />
      </section>
    </div>
  );
};

export default EverynoisePage;
