import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './IDEBox.css';
import MonacoEditor from 'react-monaco-editor';

function IDEBox({ code, setCode }) {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => setCode(event.target.result);
    reader.readAsText(e.target.files[0]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!');
    });
  };

  return (
    <div className="ide-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Running Code...</p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      )}

      <div className={`ide-box ${loading ? 'blur-background' : ''}`}>
        <div className="ide-header">
          <input
            type="file"
            accept=".js,.py,.java,.cpp,.c,.ts,.json,.txt"
            onChange={handleUpload}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button className="ide-btn upload-btn" onClick={() => fileInputRef.current.click()}>
            <span className="btn-icon">📁</span> Upload File
          </button>
          <button className="ide-btn copy-btn" onClick={handleCopy}>
            <span className="btn-icon">📋</span> Copy Code
          </button>
          <button 
            className="ide-btn complex-btn" 
            onClick={() => navigate('/folder-upload')}
          >
            <span className="btn-icon">🗂️</span> Complex Folder
          </button>
          <button 
            className="ide-btn simple-btn" 
            onClick={() => navigate('/folder')}
          >
            <span className="btn-icon">📂</span> Simple Folder
          </button>
        </div>

        <MonacoEditor
          width="100%"
          height="60vh"
          language="javascript"
          value={code}
          onChange={setCode}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}

export default IDEBox;