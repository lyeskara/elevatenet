import "bootstrap/dist/css/bootstrap.min.css";
import './styles/App.css';
import './styles/common.css';



import {Route , Routes} from 'react-router-dom'
import NavbarFun from './components/Navbar';
import SignIn from './components/authentication/SignIn';
import JoinNow from './components/authentication/JoinNow';
import Linkedin from './components/Linkedin';
import ProfileForm from './components/ProfileInfo/ProfileForm';
import Profile from './components/ProfileInfo/Profile';
import JobPostings from './components/Jobs/JobPostings';
import Protection from './context/Protection';
import OtherUsersProfile from './components/ProfileInfo/OtherUsersProfile';
import { UserAuthContextProvider } from './context/UserAuthContext';
import CreateNewPosting from "./components/Jobs/CreateNewPosting";
import Feed from "./components/UserFeedPage/Feed";
import CreatPost from "./components/UserFeedPage/CreatPost";


function App() {
  return (
    <UserAuthContextProvider>
    <NavbarFun/>
    <Routes>
    <Route path="/ProfileForm" element={<Protection>{<ProfileForm/>}</Protection>}></Route>
    <Route path="/Profile" element={<Protection>{<Profile/>}</Protection>}></Route>
    <Route path="/CreateNewPosting" element={<Protection>{<CreateNewPosting/>}</Protection>}></Route>
    <Route path="/JobPostings" element={<JobPostings/>} />
    <Route path="/" element={<Linkedin />} />
    <Route path="/SignIn" element={<SignIn/>} />
    <Route path="/JoinNow" element={<JoinNow/>} />
    <Route path="/userfeed" element={<Protection><Feed/></Protection>}></Route>
    <Route path="profile/:id" element={<Protection><OtherUsersProfile/></Protection>}></Route>
    <Route path="/user_posts" element={<Protection><CreatPost/></Protection>}></Route>
    </Routes> 
    </UserAuthContextProvider>
    );
}

export default App;
