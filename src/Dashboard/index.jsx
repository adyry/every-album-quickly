import {Link} from "react-router-dom";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ExpandIcon from '@mui/icons-material/Expand';
import ChecklistIcon from '@mui/icons-material/Checklist';
import {Button} from "@mui/material";

const Dashboard = () => {
  return (
    <div className="dashboard">
        <Link to={"/enrich"}><Button variant="outlined"><ExpandIcon/> Add whole albums to your single
            tracks</Button></Link>
        <Link to={"/playlist"}><Button variant="outlined"><ChecklistIcon/>Browse and dig from the
          playlist</Button></Link>
        {/*<Link to={"/everynoise"}><Button variant="outlined"><ManageSearchIcon/> Find new albums by genre</Button></Link>*/}
    </div>
  );
};

export default Dashboard;
