import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import IDEBox from "./components/IDEBox";
import OutputPanel from "./components/PANEL";
import FolderUploadPage from './components/FolderUpload';
import Folder from './components/folder';
import SemgrepResults from './components/SemgrepResults';   // <-- Import this

function App() {
  const [code, setCode] = useState('// Write your code here');

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <div className="container">
                <IDEBox code={code} setCode={setCode} />
                <OutputPanel code={code} />
              </div>
            }
          />
          <Route path="/folder-upload" element={<FolderUploadPage />} />
          <Route path="/folder" element={<Folder />} />
          <Route path="/semgrep-results" element={<SemgrepResults />} /> {/* <-- Add this */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
