import { useEffect, useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import defaultpic from ".././../images/test.gif";
import "../../styles/CompanySearch.css";
import {Card , Button } from "react-bootstrap";
function CompanySearch() {
  const { result } = useParams();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    
    if (location.search !== "") {
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search");
      console.log("search is: " + search);
      setSearch(search);
      const resultParam = searchParams.get("result");
      setUsers(JSON.parse(decodeURIComponent(resultParam)));
    }
  }, [location]);

  return (
    <>
      <Card className="card">
      <h4 className="requests" >Results for "{search}"</h4>
      </Card>
      <ul className="search-results">
        {users.map((user) => (
          <li key={user.id}>
            <div className="search-result">
              <div className="search-pic-container">
                <img
                  className="search-pic"
                  src={user.profilePicUrl || defaultpic}
                  alt={user.firstName}
                />
              </div>
              <div className="user-info">
                <Link to={`/profile/${user.id}`}>
                  <h3>{user.firstName} {user.lastName}</h3>
                </Link>
                <li> {user.bio}</li>
                <li>Work experience at {user.workExperience}</li>
                
              </div>
              <Button className="connect_button">        
                     Connect
                </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default CompanySearch;