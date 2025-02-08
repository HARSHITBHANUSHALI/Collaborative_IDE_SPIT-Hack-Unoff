import {Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/LandingPage'
import RedactPdf from './pages/RedactPdf';
import Signup from './pages/Signup';
import Login from './pages/Login';
import {CollaborativeEditor} from './components/CollaborativeEditor';

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

export default function App() {
  return (
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/redact-pdf' element={<RedactPdf/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/new' element={<CollaborativeEditor />} />
      </Routes>
  );
}