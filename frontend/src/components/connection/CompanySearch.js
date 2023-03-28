import { useState } from "react";
import { db } from "../../firebase";
import Search from "./Search";

function CompanySearch() {
  const [searchResults, setSearchResults] = useState([]);
  const [workExperience, setworkExperience] = useState("");

  const getUsers = async (workExperience) => {
    const querySnapshot = await db
      .collection("users_information")
      .where("workExperience", "==", workExperience)
      .get();

    const results = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    setSearchResults(results);
  };

  const handleSearch = () => {
    getUsers(workExperience);
  };

  return (
    <>
      <Search workExperience={workExperience} setWorkExperience={setworkExperience} onSearch={handleSearch} />

      <div>
        <h2>Users with Work Experience: {workExperience}</h2>
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