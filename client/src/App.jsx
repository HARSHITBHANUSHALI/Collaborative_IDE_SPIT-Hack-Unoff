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
import { RoomProvider } from '../liveblocks.config';
import { FileContext } from "./FileContext";
import { useContext } from 'react';

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

export default function App() {
  
  const {file} = useContext(FileContext);
  const fileName = file || 'fileName';  // Add this line
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/redact-pdf' element={<RedactPdf />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      {/* <Route path='/new' element={<CollaborativeEditor />} /> */}
      <Route path='/home' element={<HomePage />} />
      <Route path='/commit/:projectId' element={<CommitsPage />} />
      <Route path="/project/:projectId" element={<ProjectView />} />
      <Route path="/editor/:projectId/:fileId" element={<EditorPage />} />  {/* Add this route */}
    </Routes>
    <RoomProvider id={`${fileName}`}>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/redact-pdf' element={<RedactPdf />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/editor/:projectId/:fileId' element={<CollaborativeEditor />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/commit' element={<CommitsPage />} />
        <Route path="/project/:projectId" element={<ProjectView />} />
        {/* <Route path="/editor/:projectId/:fileId" element={<EditorPage />} />  Add this route */}
      </Routes>
    </RoomProvider>
  );
}