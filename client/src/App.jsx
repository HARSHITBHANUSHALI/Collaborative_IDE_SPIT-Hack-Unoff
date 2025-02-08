import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LandingPage from './pages/LandingPage';
import RedactPdf from './pages/RedactPdf';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { CollaborativeEditor } from './components/CollaborativeEditor';
import HomePage from './pages/HomePage';
import ProjectView from './pages/ProjectView';
import EditorPage from './pages/EditorPage';  // Add this import
import CommitsPage from './pages/Commit';

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/redact-pdf' element={<RedactPdf />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      {/* <Route path='/new' element={<CollaborativeEditor />} /> */}
      <Route path='/home' element={<HomePage />} />
      <Route path='/commit' element={<CommitsPage />} />
      <Route path="/project/:projectId" element={<ProjectView />} />
      <Route path="/editor/:projectId/:fileId" element={<EditorPage />} />  {/* Add this route */}
    </Routes>
  );
}