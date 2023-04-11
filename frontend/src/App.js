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
import ApplyToJobs from "./components/Jobs/ApplyNow";
import JobPageForSeekers from "./components/Jobs/JobPageForSeekers"
import Advertisements from "./components/Jobs/Advertisements";
import CreateAdvertisement from "./components/Jobs/CreateAdvertisement";
import SavedJobs from "./components/Jobs/SavedJobs";

import RequestsPage from "./components/connection/RequestsPage";
import ConnectionPage from "./components/connection/ConnectionPage";
import CreateGroup from "./components/Network/CreateGroup";
import GroupPage from "./components/Network/GroupPage";

import CreateEvent from "./components/Network/CreateEvent";

import RequestSent from "./components/connection/RequestSent";
import RecruiterForm from './components/ProfileInfo/RecruiterFrom'

import Messaging from './components/DirectMessage/Messaging';
import CompanySearch from './components/connection/CompanySearch';

import GeneralSettings from "./components/Settings/GeneralSettings";
import Security from "./components/Settings/Security";
import ChangeLanguage from "./components/Settings/ChangeLanguage";
function App() {
  return (
    <UserAuthContextProvider>
      <NavbarFun />
      <Routes>
      <Route
          path="/CompanySearch"
          element={<Protection>{<CompanySearch />}</Protection>}
        ></Route>

        <Route
          path="/ProfileForm"
          element={<Protection>{<ProfileForm />}</Protection>}
        ></Route>
        <Route
          path="/RecruiterForm"
          element={<Protection>{<RecruiterForm />}</Protection>}
        ></Route>
        <Route
          path="/Profile"
          element={<Protection>{<Profile />}</Protection>}
        ></Route>
        <Route
          path="/CreateNewPosting"
          element={<Protection>{<CreateNewPosting />}</Protection>}
        ></Route>
        <Route
          path="/JobPostings"
          element={<Protection>{<JobPostings />}</Protection>}
        />
        <Route
          path="/ChangeLanguage"
          element={<Protection>{<ChangeLanguage />}</Protection>}
        />
        <Route path="/" element={<Linkedin />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/JoinNow" element={<JoinNow />} />
        <Route
          path="/requests"
          element={
            <Protection>
              <RequestsPage />
            </Protection>
          }
        ></Route>
        <Route
          path="/connections"
          element={
            <Protection>
              <ConnectionPage />
            </Protection>
          }
        ></Route>
        <Route
          path="/feed"
          element={
            <Protection>
              <Feed />
            </Protection>
          }
        ></Route>
        <Route
          path="/Messaging"
          element={
            <Protection>
              <Messaging />
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
        <Route
          path="/CreatPost"
          element={
            <Protection>
              <CreatPost />
            </Protection>
          }
        />
        <Route
          path="/group/CreatPost"
          element={
            <Protection>
              <CreatPost />
            </Protection>
          }
        />
        <Route
          path="/EditProfile"
          element={
            <Protection>
              <EditProfile />
            </Protection>
          }
        />
        <Route path="/user_posts" element={<Protection></Protection>}></Route>
        <Route
          path="/RequestSent"
          element={
            <Protection>
              <RequestSent />
            </Protection>
          }
        />
        <Route
          path="/GroupNetwork"
          element={
            <Protection>
              <GroupNetwork />
            </Protection>
          }
        />
        <Route
          path="/group/:id"
          element={
            <Protection>
              <GroupPage />
            </Protection>
          }
        />
        <Route
          path="/Event"
          element={
            <Protection>
              <Event />
            </Protection>
          }
        />
        <Route
          path="/CreateEvent"
          element={
            <Protection>
              <CreateEvent />
            </Protection>
          }
        />
        <Route
          path="/CreateGroup"
          element={
            <Protection>
              <CreateGroup />
            </Protection>
          }
        />
        <Route
          path="/ApplyToJobs/:id"
          element={
            <Protection>
              <ApplyToJobs />
            </Protection>
          }
        />
        <Route
          path="/JobPageForSeekers"
          element={
            <Protection>
              <JobPageForSeekers />
            </Protection>
          }
        />
        <Route
          path="/SavedJobs"
          element={
            <Protection>
              <SavedJobs />
            </Protection>
          }
        />
         <Route
          path="/GeneralSettings"
          element={
            <Protection>
              <GeneralSettings />
            </Protection>
          }
        />
          <Route
          path="/Security"
          element={
            <Protection>
              <Security />
            </Protection>
          }
        />
        <Route
          path="/Advertisements"
          element={
            <Protection>
              <Advertisements />
            </Protection>
          }
        />
        <Route
          path="/CreateAdvertisement"
          element={
            <Protection>
              <CreateAdvertisement/>
            </Protection>
          }
        />
      </Routes>
    </UserAuthContextProvider>
  );
}

export default App;
