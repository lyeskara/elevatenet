import './styles/App.css';
import {Route , Routes} from 'react-router-dom'
import Navbar from './components/Navbar';
import SignIn from './components/authentication/SignIn';
import JoinNow from './components/authentication/JoinNow';
import Linkedin from './components/Linkedin';
import ProfileForm from './components/ProfileInfo/ProfileForm';
import Profile from './components/ProfileInfo/Profile';
import Protection from './context/Protection'
import { UserAuthContextProvider } from './context/UserAuthContext';


function App() {
  return (
    <UserAuthContextProvider>
    <Navbar/>
    <Routes>
    <Route path="/ProfileForm" element={<Protection>{<ProfileForm/>}</Protection>}></Route>
    <Route path="/Profile" element={<Protection>{<Profile/>}</Protection>}></Route>
    <Route path="/" element={<Linkedin />} />
    <Route path="/SignIn" element={<SignIn/>} />
    <Route path="/JoinNow" element={<JoinNow/>} />

    </Routes> 
    </UserAuthContextProvider>
    );
}

export default App;
