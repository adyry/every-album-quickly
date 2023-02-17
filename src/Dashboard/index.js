import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Link to={"/playlist"}>Browse and dig from the playlist</Link>
      <Link to={"/everynoise"}>Find new albums by genre</Link>
      <Link to={"/enrich"}>Add whole albums to your single tracks</Link>
    </div>
  );
};

export default Dashboard;
