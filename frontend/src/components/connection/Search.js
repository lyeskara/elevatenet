/**
 *this file is responsible of handling search functionality
 *first imported files are imported
 *second, variables that handle our inputs are created such as search, result useStates,
 * the process goes as follows : a user write a firstname, then an event listener (onchange) set the search state into the input
 * then with the name stored a query a preformed to fetch all users with that first name and store results inside result variable.
 * inside the template, we use map to map these results as a user is writing the names, then if a user clicked.
 * we take that user id and pass it into a decorator which handles dynamic routing, later we redirect to that url which will be another component
 * that handles displaying other users info dynamically
 */

import { useEffect, useState } from "react";
import {
	getDocs,
	query,
	where,
	collection,
	getDoc,
	doc,
} from "firebase/firestore"; //importing necessary firestore functions
import { auth, db } from "../../firebase"; //importing firebase authentication and database services
import { useNavigate, Link, useParams } from "react-router-dom"; //importing necessary react-router functions
import { async } from "@firebase/util"; //importing firebase utility function
import defaultpic from ".././../images/test.gif"; //importing default profile picture

function Search() {
	//creating states to hold search input and search result
	const [search, Setsearch] = useState("");
	const [Result, SetResult] = useState([]);
	const navigate = useNavigate(); //getting navigate function from react-router
	const [url, setUrl] = useState(null); //creating state to hold user id from clicked link
	const [searchSubmitted, setSearchSubmitted] = useState(false); //creating state to track if search has been submitted
	useEffect(() => {
		async function getResult() {
			if (search !== "") {
				const usersRef = collection(db, "users_information");
				const recruitersRef = collection(db, "recruiters_informations");
				const workExpQuery = query(
					usersRef,
					where("workExperience.0.company", "==", search)
				);
				const recWorkExpQuery = query(
					recruitersRef,
					where("company", "==", search)
				);
				const firstNameQuery = query(
					usersRef,
					where("firstName", "==", search)
				);
				const recFirstNameQuery = query(
					recruitersRef,
					where("firstName", "==", search)
				);
				const [workExpDocs, firstNameDocs, recFirstNameDocs, recWorkExpDocs] =
					await Promise.all([
						getDocs(workExpQuery),
						getDocs(firstNameQuery),
						getDocs(recFirstNameQuery),
						getDocs(recWorkExpQuery),
					]);
				const workExpResults = workExpDocs.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				const firstNameResults = firstNameDocs.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				const recWorkExpResults = recWorkExpDocs.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				const recFirstNameResults = recFirstNameDocs.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				const mergedResults = [
					...workExpResults,
					...firstNameResults,
					...recWorkExpResults,
					...recFirstNameResults,
				];
				SetResult(mergedResults);
			} else {
				SetResult([]);
			}
		}
		getResult();
	}, [search]);
	//function to redirect to user profile page when link is clicked
	useEffect(() => {
		if (url) {
			console.log(url);
			navigate({ url }); //if clicked link is another user's profile, navigate to /profile/userId route
		}
	}, [url]);

	//function to handle click event on search result links
	async function handleClick(id) {
		Setsearch(""); //reset search input

		// Check if the id belongs to a user
		const userDocRef = doc(db, "users_information", id);
		const userDoc = await getDoc(userDocRef);

		// Check if the id belongs to a recruiter
		const recruiterDocRef = doc(db, "recruiters_informations", id);
		const recruiterDoc = await getDoc(recruiterDocRef);

		if (userDoc.exists()) {
			// The id belongs to a user in the "users_information" collection
			setUrl(`/profile/${id}`);
		} else if (recruiterDoc.exists()) {
			// The id belongs to a recruiter in the "recruiters_informations" collection
			setUrl(`/recruiterprofile/${id}`);
		} else {
			// The id does not exist in either collection
			console.error(`User or recruiter with id ${id} does not exist`);
		}
	}

	//function to handle form submit event
	function handleSubmit(e) {
		e.preventDefault();
		//redirect to CompanySearch page with search query and result as URL parameters
		navigate(
			`/CompanySearch?search=${search}&result=${encodeURIComponent(
				JSON.stringify(Result)
			)}`
		);
		setSearchSubmitted(true); //set searchSubmitted state to true
	}
	return (
		<>
			{/* Search bar form */}
			<form className="search_bar" onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Search..."
					value={search}
					onChange={(e) => {
						// Update search state with the current value of the input
						Setsearch(e.target.value);
						// Reset searchSubmitted state when user types a new search query
						setSearchSubmitted(false);
					}}
				/>
			</form>

			{/* Show list of search results */}
			{!searchSubmitted && (
				<ul>
					{Result.map((user) => (
						<li className="off_point mt-2" key={user.id}>
							<div className="containRequest">
								{/* Display user's profile picture */}
								<img
									className="search_pic"
									src={user.profilePicUrl || defaultpic}
									alt={user.firstName}
								/>

								{/* Display user's full name */}
								<p
									onClick={() => {
										// Set url state to the selected user's id
										handleClick(user.id);
									}}
								>
									{user.firstName} {user.lastName}
								</p>
							</div>
						</li>
					))}
				</ul>
			)}
		</>
	);
}

export default Search;
