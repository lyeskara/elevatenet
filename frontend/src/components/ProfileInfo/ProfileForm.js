import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { useUserAuth } from '../../context/UserAuthContext';



function ProfileForm() {

  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const [profileData, setProfileData] = useState({
    profileImage: '',
    firstName: '',
    lastName: '',
    city: '',
    bio: '',
    workExperience: '',
    education: '',
    skills: '',
    languages: '',
  });

  return (
    <>
    <button onClick={handleLogout} >logout</button>
    <div className="user-profile">
      <div className="user-profile__image">
        <img src={profileData.profileImage} alt="User Profile" />
      </div>
      <div className="user-profile__name">
        {profileData.firstName} {profileData.lastName}
      </div>
      <div className="user-profile__city">{profileData.city}</div>
      <div className="user-profile__bio">{profileData.bio}</div>
      <div className="user-profile__work-experience">
        {profileData.workExperience}
      </div>
      <div className="user-profile__education">{profileData.education}</div>
      <div className="user-profile__skills">{profileData.skills}</div>
      <div className="user-profile__languages">{profileData.languages}</div>
    </div>
    </>
  );
}

export default ProfileForm;

