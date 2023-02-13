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
import Protection from './context/Protection';
import job_postings from './components/jobs/job_postings';
import OtherUsersProfile from './components/ProfileInfo/OtherUsersProfile';
import { UserAuthContextProvider } from './context/UserAuthContext';


function App() {
  return (
    <UserAuthContextProvider>
    <NavbarFun/>
    <Routes>
    <Route path="/ProfileForm" element={<Protection>{<ProfileForm/>}</Protection>}></Route>
    <Route path="/Profile" element={<Protection>{<Profile/>}</Protection>}></Route>
    <Route path="/job_postings" element={<Protection>{<job_postings/>}</Protection>}></Route>
    <Route path="/" element={<Linkedin />} />
    <Route path="/SignIn" element={<SignIn/>} />
    <Route path="/JoinNow" element={<JoinNow/>} />
    <Route path="profile/:id" element={<Protection><OtherUsersProfile/></Protection>}></Route>

    </Routes> 
    </UserAuthContextProvider>
    );
}

export default App;
