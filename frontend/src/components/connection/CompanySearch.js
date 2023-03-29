import { useEffect, useState } from "react";
import { useLocation, Link,useParams } from "react-router-dom";
import defaultpic from ".././../images/test.gif";

function CompanySearch() {
  const { search, result } = useParams();
  const [users, setUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (location.search !== "") {
      const searchParams = new URLSearchParams(location.search);
      const resultParam = searchParams.get("result");
      setUsers(JSON.parse(decodeURIComponent(resultParam)));
    }
  }, [location]);

  return (
    <>
      <h1>Results for "{search}"</h1>
      <ul>
        {users.map((user) => (
          <li className="off_point mt-2" key={user.id}>
            <div className="containRequest">
              <img
                className="search_pic"
                src={user.profilePicUrl || defaultpic}
                alt={user.firstName}
              />
              <p>
                <Link to={`/profile/${user.id}`}>{user.firstName} {user.lastName}</Link>
              </p>
            </div>
            </li>
        ))}
      </ul>
    </>
  );
}

export default CompanySearch;