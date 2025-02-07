import {Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/LandingPage'
import RedactPdf from './pages/RedactPdf';

axios.defaults.baseURL = "http://localhost:3500";
axios.defaults.withCredentials = true;

export default function App() {
  return (
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/redact-pdf' element={<RedactPdf/>}/>
      </Routes>
  );
}