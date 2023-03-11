import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/App.css";
import "./styles/common.css";

import { Route, Routes } from "react-router-dom";
import NavbarFun from "./components/Navbar";
import SignIn from "./components/authentication/SignIn";
import JoinNow from "./components/authentication/JoinNow";
import Linkedin from "./components/Linkedin";
import ProfileForm from "./components/ProfileInfo/ProfileForm";
import Profile from "./components/ProfileInfo/Profile";
import JobPostings from "./components/Jobs/JobPostings";
import Protection from "./context/Protection";
import OtherUsersProfile from "./components/ProfileInfo/OtherUsersProfile";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import EditProfile from "./components/ProfileInfo/EditProfile";
import CreateNewPosting from "./components/Jobs/CreateNewPosting";
import Feed from "./components/UserFeedPage/Feed";
import CreatPost from "./components/UserFeedPage/CreatPost";
import GroupNetwork from "./components/Network/GroupNetwork";
import Event from "./components/Network/Event";
import PendingRequests from "./components/Network/PendingRequests";
import RequestsPage from "./components/connection/RequestsPage";
import ConnectionPage from "./components/connection/ConnectionPage";

import CreateEvent from "./components/Network/CreateEvent";

import RequestSent from "./components/connection/RequestSent";




function App() {
  return (
    <UserAuthContextProvider>
      <NavbarFun />
      <Routes>
        <Route
          path="/ProfileForm"
          element={<Protection>{<ProfileForm />}</Protection>}
        ></Route>
        <Route
          path="/Profile"
          element={<Protection>{<Profile />}</Protection>}
        ></Route>
        <Route
          path="/CreateNewPosting"
          element={<Protection>{<CreateNewPosting />}</Protection>}
        ></Route>
        <Route path="/JobPostings" element={<JobPostings />} />
        <Route path="/" element={<Linkedin />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/JoinNow" element={<JoinNow />} />
        <Route path="/requests" element={<Protection><RequestsPage/></Protection>}></Route>
				<Route path="/connections" element={<Protection><ConnectionPage/></Protection>}></Route>
        <Route
          path="/userfeed"
          element={
            <Protection>
              <Feed />
            </Protection>
          }
        ></Route>
        <Route
          path="profile/:id"
          element={
            <Protection>
              <OtherUsersProfile />
            </Protection>
          }
        ></Route>
           
           <Route path="/Feed" element={<Feed/>} />
           <Route path="/CreatPost" element={<CreatPost/>} /> 
       
        
        
        <Route path="/EditProfile" element={<EditProfile />} />{" "}
        <Route
          path="/user_posts"
          element={
            <Protection>
              
            </Protection>
          }
        ></Route>
    <Route path="/RequestSent" element={<RequestSent/>}/>
		<Route path="/GroupNetwork" element={<GroupNetwork />} />
		<Route path="/Event" element={<Event />} />
		<Route path="/PendingRequests" element={<PendingRequests />} />
    <Route path="/CreateEvent" element={<CreateEvent />} />
      </Routes>
    </UserAuthContextProvider>
  );

}

export default App;
