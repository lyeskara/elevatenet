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
import Protection from './context/Protection'
import OtherUsersProfile from './components/ProfileInfo/OtherUsersProfile';
import { UserAuthContextProvider } from './context/UserAuthContext';

// review from fatema: feed and post are not in components it is in components/userfeedpage so this creates errors
import Feed from './components/Feed';
import Post from './components/Post';
// this does not exist so it creates errors 
import CreatePost from "./components/CreatePost";




function App() {
  return (
    <UserAuthContextProvider>
    <NavbarFun/>
    <Routes>
    <Route path="/ProfileForm" element={<Protection>{<ProfileForm/>}</Protection>}></Route>
    <Route path="/Profile" element={<Protection>{<Profile/>}</Protection>}></Route>
    <Route path="/" element={<Linkedin />} />
    <Route path="/SignIn" element={<SignIn/>} />
    <Route path="/JoinNow" element={<JoinNow/>} />
    <Route path="profile/:id" element={<Protection><OtherUsersProfile/></Protection>}></Route>
    <Route path="/Feed" element={<Feed/>} />
        <Route path="/Post" element={<Post/>} />
        <Route path="/CreatePost" element={<CreatePost/>} />

        
    </Routes> 
    </UserAuthContextProvider>
    );
}

export default App;
