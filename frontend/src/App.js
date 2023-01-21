import './styles/App.css';
import {Route , Routes} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar';
import SignIn from './components/Navbar/SignIn';
import JoinNow from './components/Navbar/JoinNow';
import Linkedin from './components/Navbar/Linkedin';
function App() {
  return (
    <>
    <Navbar/>
    <Routes>
    <Route path="/" element={<Linkedin />} />
    <Route path="/SignIn" element={<SignIn/>} />
    <Route path="/JoinNow" element={<JoinNow/>} />
    </Routes> 
    </> 
    );
}

export default App;
