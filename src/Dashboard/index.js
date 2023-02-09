import "./Dashboard.scss";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Link to={"/playlist"}>Playlist</Link>
      <Link to={"/everynoise"}>New releases By genre</Link>
    </div>
  );
};

export default Dashboard;
