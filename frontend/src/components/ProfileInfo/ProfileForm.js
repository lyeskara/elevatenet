import React, { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { auth, db } from "../../firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
function ProfileForm() {
	const { user } = useUserAuth();
	const navigate = useNavigate();
	const [profileData, setProfileData] = useState({
		profileImage: "",
		firstName: "",
		lastName: "",
		city: "",
		bio: "",
		workExperience: "",
		education: "",
		skills: "",
		languages: "",
	});

	function update(e) {
		setProfileData({ ...profileData, [e.target.name]: e.target.value });
	}

	function create_user(e) {
		e.preventDefault();
		if (user) {
			setDoc(doc(collection(db, "users_information"), auth.currentUser.uid), {
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				education: profileData.education,
				city: profileData.city,
				bio: profileData.bio,
				workExperience: profileData.workExperience,
				skills: profileData.skills,
				languages: profileData.languages,
				email: auth.currentUser.email,
				profileImage: profileData.profileImage,
				contact: profileData.contact,
			});
			// Clear the form fields
			setProfileData({
				profileImage: "",
				firstName: "",
				lastName: "",
				city: "",
				bio: "",
				workExperience: "",
				education: "",
				skills: "",
				languages: "",
				contact: "",
			});
			navigate("/Profile");
		} else {
			console.log("error happened. Try again!");
		}
	}
	return (
		<>
			<form onSubmit={create_user}>
				<div className="user-profile__image">
					<img src={profileData.profileImage} alt="User Profile" />
				</div>
				<div>
					<label> first name : </label>
					<input
						type="text"
						name="firstName"
						onChange={update}
						value={profileData.firstName}
					/>
				</div>
				<div>
					<label> last name : </label>
					<input
						type="text"
						name="lastName"
						onChange={update}
						value={profileData.lastName}
					/>
				</div>
				<div>
					<label> bio : </label>
					<input
						type="text"
						name="bio"
						onChange={update}
						value={profileData.bio}
					/>
				</div>
				<div>
					<label> city : </label>
					<input
						type="text"
						name="city"
						onChange={update}
						value={profileData.city}
					/>
				</div>
				<div>
					<label> education : </label>
					<input
						type="text"
						name="education"
						onChange={update}
						value={profileData.education}
					/>
				</div>
				<div>
					<label> work experience : </label>
					<input
						type="text"
						name="workExperience"
						onChange={update}
						value={profileData.workExperience}
					/>
				</div>
				<div>
					<label> skills : </label>
					<input
						type="text"
						name="skills"
						onChange={update}
						value={profileData.skills}
					/>
				</div>
				<div>
					<label> languages: </label>
					<input
						type="text"
						name="languages"
						onChange={update}
						value={profileData.languages}
					/>
				</div>
				<div>
					<label> contact: </label>
					<input
						type="text"
						name="contact"
						onChange={update}
						value={profileData.contact}
					/>
				</div>
				<button type="submit">Save</button>
			</form>
		</>
	);
}

export default ProfileForm;
