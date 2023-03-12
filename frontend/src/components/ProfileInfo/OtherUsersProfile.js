/**
 * this file is reponsible of handling displayment of other users profile and follow functionalities. 
 * first, hooks, functions, middlewares are imported
 * second, reactive data is initialised into null with useState
 * third, we store the authenticated user and the visited user ids into variables 
 * for displaying the vistied user data, useEffect and queries handles the task
 *  (useEffect act as change happen, queries get data that is stored in states then displayed in templates)
 * data is rendered conditionaly, users should be allow to search for themselves and not have follow button appear in their profiles
 * as for the ability to follow someone, two functions are attached to event listeners (onClick) 
 * handlefollowing works as follows: reference to the follows collection and and to the current user document inside that collection
 * then a query into getting all documents from the collection, in the result contains the user, the we update, if user doesnt exist 
 * we create a new follow document for that user, handleunfollow, checks wether user has document, and if yes, filter into finding the visited user id and deleting them from the document data
 *
 * 
 */


import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getDoc, query, where, getDocs, setDoc, collection, doc, updateDoc, documentId } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function OtherUsersProfile() {

  const [follow, setfollow] = useState(false)
  const { id } = useParams();
  const [user, setUser] = useState({})
  const currId = auth.currentUser.uid
  const followedId = id

  const handlefollow = async () => {

    const followRef = collection(db, 'connection_requests');
    const authdoc = doc(followRef, currId)
    const array = []
    const addDoc = await getDocs((followRef)).then((word) => {
      word.docs.forEach((doc) => {
        array.push(doc.id)
      })
      const condition = array.includes(authdoc.id)
      if (!condition) {
        setDoc(doc(followRef, currId), {
          requests
            : [followedId]
        });
      }
      else {
        const getFollowers = getDoc(authdoc).then((document) => {
          const followedUsers = document.data().requests;
          if (!followedUsers.includes(followedId)) {
            followedUsers.push(followedId)
            return updateDoc(doc(followRef, currId), { ...document.data(), requests: followedUsers })
          } else {
            console.log("already followed!")
          }
        })
      }
    }).catch((error) => {
      console.log(error);
    })
    setfollow(true);
  }


  const handleunfollow = async () => {
    const followRef = collection(db, 'follows')
    const authdoc = await getDoc(doc(followRef, currId)).then((word) => {
      if (word.exists) {
        const followedUsers = word.data().followd
        console.log(followedUsers)
        if (followedUsers.includes(followedId)) {
          const updatedFollowedUsers = followedUsers.filter(userId => userId !== followedId);
          console.log(updatedFollowedUsers)
          return updateDoc(doc(followRef, currId), { ...word.data(), followd: updatedFollowedUsers })
        }
      }
    }).catch((error) => {
      console.log(error);
    })
    setfollow(false);
  }

  useEffect(
    () => {
      getDoc(doc(collection(db, "users_information"), id)).then(
        (doc) => {
          if (doc.exists) {
            setUser({ ...doc.data(), id: doc.id });
          } else {
            console.log("error")
          }
        }).catch((error) => {
          console.log(error);
        });
    }
    , [id])



  return (
    <>
      {currId !== id ?
        !follow ? (
          <>
            <button onClick={handlefollow}>Follow</button>
            {informations(user)}
          </>
        ) : (
          <>
            <button onClick={handleunfollow}>Unfollow</button>
            {informations(user)}
          </>
        ) : (
          informations(user)
        )
      }

    </>
  )
}

function informations(user) {
  return (
    <div className="user-profile">
      <h1 className="name">{user.firstName} {user.lastName}</h1>
      <p className="bio">{user.bio}</p>
      <div className="education">
        <h2>Education</h2>
        <ul>
          <li>{user.education}</li>
        </ul>
      </div>
      <div className="work-experience">
        <h2>Work Experience</h2>
        <ul>
          <li> {user.workExperience}</li>
        </ul>
      </div>
      <div className="skills">
        <h2>Skills</h2>
        <ul>
          <li>{user.skills}</li>
        </ul>
      </div>
      <div className="languages">
        <h2>Languages</h2>
        <ul>
          <li>{user.languages}</li>
        </ul>
      </div>
    </div>
  )
}




export default OtherUsersProfile
