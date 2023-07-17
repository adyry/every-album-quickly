import { Link } from "react-router-dom";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ExpandIcon from '@mui/icons-material/Expand';
import ChecklistIcon from '@mui/icons-material/Checklist';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Link to={"/playlist"}><ChecklistIcon /> Browse and dig from the playlist</Link>
      <Link to={"/everynoise"}><ManageSearchIcon /> Find new albums by genre</Link>
      <Link to={"/enrich"}><ExpandIcon /> Add whole albums to your single tracks</Link>
    </div>
  );
};

export default Dashboard;
