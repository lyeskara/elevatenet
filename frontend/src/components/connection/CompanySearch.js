import { useState } from "react";
import { auth, db } from "../../firebase";
import Search from "./Search";

function CompanySearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [companyName, setCompanyName] = useState("");

  const getUsers = async (companyName) => {
    const querySnapshot = await db
      .collection("user_information")
      .where("workExperience", "==", "genetec")
      .where("companyName", "==", companyName)
      .get();

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    setSearchResults(results);
  };

  const handleSearch = () => {
    getUsers(companyName);
  };

  return (
    <>
    
      <Search companyName={setCompanyName} />

      <div>
      <h2>Users with Work Experience:{companyName} </h2>
      {/* <ul>
        {users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul> */}
    </div>
      <div>
        {searchResults.map((result) => (
          <div key={result.id}>
            <p>{result.firstName} {result.lastName}</p>
            <p>{result.workExperience}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default CompanySearch;