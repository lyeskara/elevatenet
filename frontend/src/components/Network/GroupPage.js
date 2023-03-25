//React Imports
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//Firebase Imports
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

function GroupPage() {
  
  const { id } = useParams();
  const [group, setGroup] = useState(null);

/* The information of the selected group is retrieved from the Firestore
*  
* @param {none}
* @returns {group is set with the attributes of the group in question} 
*/
  useEffect(() => {
    const fetchGroup = async () => {
      const groupRef = doc(db, "groups", id);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        setGroup(groupDoc.data());
      } else {
        console.log("No such group exists.");
      }
    };

    fetchGroup();
  }, [id]);

  if (!group) {
    return <div>Loading...</div>;
  }

  //Here we display the information relevant to the group
  return (
    <div>
      <img src={group.group_img_url}></img>
      <h1>{group.group_name}</h1>
      <h5> {group.memberUIDs.length} {group.memberUIDs.length === 1 ? "member" : "members"}</h5>
      <h5>{group.industry}</h5>
      <h5>{group.location}</h5>
      <p>{group.description}</p>
    </div>
  );
}

export default GroupPage;
