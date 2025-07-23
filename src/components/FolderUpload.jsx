import React, { useState } from "react";

const FolderUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [visibleASTs, setVisibleASTs] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file, file.webkitRelativePath || file.name);
    });

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/folder_upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setUploadResults(data);
      if (data.languages && data.languages.length > 0) {
        setSelectedLanguage(data.languages[0]);
      }
    } catch (err) {
      alert("Upload failed. See console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFolderSelect = async (e) => {
    const files = Array.from(e.target.files);
    await uploadFiles(files);
  };

  const toggleAST = (filename) => {
    setVisibleASTs((prev) => ({
      ...prev,
      [filename]: !prev[filename],
    }));
  };

  const renderJSON = (obj) => (
    <pre
      style={{
        background: "linear-gradient(145deg, #1e1e1e, #2a2a2a)",
        color: "#eee",
        padding: 15,
        borderRadius: 8,
        maxHeight: "300px",
        overflow: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontSize: "0.9rem",
        fontFamily: "'Fira Code', monospace",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        borderLeft: "4px solid #00e676",
        transition: "all 0.3s ease",
      }}
    >
      {JSON.stringify(obj, null, 2)}
    </pre>
  );

  const renderVulnerabilities = (ruleCheck) => {
    if (!ruleCheck || !ruleCheck.vulnerabilities || ruleCheck.vulnerabilities.length === 0) {
      return (
        <div style={{ 
          padding: '12px',
          background: 'rgba(76, 175, 80, 0.1)',
          borderRadius: '4px',
          margin: '10px 0',
          borderLeft: '3px solid #4CAF50'
        }}>
          No security vulnerabilities found
        </div>
      );
    }

    return (
      <div style={{ marginTop: '15px' }}>
        <h4 style={{ 
          marginBottom: '10px',
          color: '#eee',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z" fill="#ff5252"/>
          </svg>
          Security Vulnerabilities
        </h4>
        
        {ruleCheck.vulnerabilities.map((vuln, index) => (
          <div key={index} style={{
            padding: '12px',
            background: 'rgba(244, 67, 54, 0.1)',
            borderRadius: '4px',
            marginBottom: '10px',
            borderLeft: '3px solid #f44336'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{
                background: '#f44336',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '12px',
                marginRight: '10px'
              }}>
                {vuln.severity || 'High'}
              </span>
              <strong style={{ color: '#ff5252' }}>{vuln.type || 'Vulnerability'}</strong>
            </div>
            <div style={{ color: '#eee', marginBottom: '5px' }}>
              {vuln.message || vuln.detail}
            </div>
            {vuln.line && (
              <div style={{ color: '#aaa', fontSize: '12px' }}>
                Line {vuln.line} • {vuln.rule_id || 'No rule ID'}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderRecommendations = (ruleCheck) => {
    if (!ruleCheck || !ruleCheck.recommendations || ruleCheck.recommendations.length === 0) {
      return (
        <div style={{ 
          padding: '12px',
          background: 'rgba(33, 150, 243, 0.1)',
          borderRadius: '4px',
          margin: '10px 0',
          borderLeft: '3px solid #2196F3'
        }}>
          No specific recommendations available
        </div>
      );
    }

    return (
      <div style={{ marginTop: '15px' }}>
        <h4 style={{ 
          marginBottom: '10px',
          color: '#eee',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#2196F3"/>
          </svg>
          Recommendations
        </h4>
        
        <ul style={{ paddingLeft: '20px', margin: 0 }}>
          {ruleCheck.recommendations.map((rec, index) => (
            <li key={index} style={{ marginBottom: '8px', color: '#a5d6a7' }}>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Filter files based on search term
  const filteredFiles = uploadResults?.results[selectedLanguage]?.filter(file => 
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        height: "100vh",
        width: "100vw",
        padding: 20,
        boxSizing: "border-box",
        background: "radial-gradient(circle at top left, #121212, #1a1a1a)",
        color: "#eee",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Upload Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          flexBasis: "30%",
          flexShrink: 0,
          border: isDragging ? "3px dashed #00e676" : "3px dashed #444",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          cursor: "pointer",
          background: isDragging
            ? "linear-gradient(145deg, #222, #1a1a1a)"
            : "linear-gradient(145deg, #181818, #121212)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          height: "100%",
          boxShadow: isDragging
            ? "0 0 30px rgba(0, 230, 118, 0.3)"
            : "0 0 15px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        }}
      >
        {isDragging && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle at center, rgba(0, 230, 118, 0.1) 0%, transparent 70%)",
              animation: "pulse 2s infinite alternate",
            }}
          />
        )}
        
        <label htmlFor="folderUploadInput" style={{
          position: "relative",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, #00e676 60%, #009624 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 0 15px rgba(0, 230, 118, 0.6)",
          cursor: "pointer",
          overflow: "visible",
          zIndex: 0,
          transform: isDragging ? "scale(1.1)" : "scale(1)",
          transition: "all 0.3s ease",
        }}>
          <input
            type="file"
            id="folderUploadInput"
            multiple
            style={{ display: "none" }}
            onChange={handleFolderSelect}
            webkitdirectory="true"
            mozdirectory="true"
            directory="true"
          />

          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                width: 120,
                height: 120,
                borderRadius: "50%",
                border: "2px solid #00e676",
                top: 0,
                left: 0,
                opacity: 0,
                animation: `ripple 3s infinite`,
                animationDelay: `${i * 1}s`,
                zIndex: -1,
              }}
            />
          ))}

          <div style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transition: "transform 0.3s ease",
                transform: isDragging ? "translateY(-5px)" : "none",
              }}
            >
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                fill="white"
              />
              <path
                d="M14 2V8H20M12 18V12M9 15H15"
                stroke="#009624"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 14,
              pointerEvents: "none",
              userSelect: "none",
              textAlign: "center",
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}>
              Complex Folder
            </span>
          </div>
        </label>

        <p style={{ 
          marginTop: 20, 
          color: "#aaa", 
          fontSize: 14, 
          textAlign: "center",
          opacity: isDragging ? 0.8 : 0.6,
          transform: isDragging ? "translateY(5px)" : "none",
          transition: "all 0.3s ease",
        }}>
          or drag & drop here
        </p>
        
        <div style={{
          position: "absolute",
          bottom: 20,
          color: "#666",
          fontSize: 12,
          textAlign: "center",
        }}>
          Supports: JavaScript, Python, Java, ReactJS, Node.js
        </div>
      </div>

      {/* Result Panel */}
      <div style={{
        flexBasis: "70%",
        background: "linear-gradient(145deg, #252525, #1e1e1e)",
        borderRadius: 15,
        padding: 20,
        overflowY: "auto",
        height: "100%",
        boxSizing: "border-box",
        position: "relative",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        border: "1px solid #333",
      }}>
        {loading ? (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            borderRadius: 15,
          }}>
            <div style={{
              position: "relative",
              width: 100,
              height: 100,
              marginBottom: 20,
            }}>
              <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "8px solid transparent",
                borderTopColor: "#00e676",
                animation: "spin 1.5s linear infinite",
              }}></div>
              <div style={{
                position: "absolute",
                width: "80%",
                height: "80%",
                top: "10%",
                left: "10%",
                borderRadius: "50%",
                border: "8px solid transparent",
                borderTopColor: "#00bcd4",
                animation: "spinReverse 1.8s linear infinite",
              }}></div>
              <div style={{
                position: "absolute",
                width: "60%",
                height: "60%",
                top: "20%",
                left: "20%",
                borderRadius: "50%",
                border: "8px solid transparent",
                borderTopColor: "#009688",
                animation: "spin 2.1s linear infinite",
              }}></div>
              <div style={{
                position: "absolute",
                width: "40%",
                height: "40%",
                top: "30%",
                left: "30%",
                borderRadius: "50%",
                border: "8px solid transparent",
                borderTopColor: "#4caf50",
                animation: "spinReverse 2.4s linear infinite",
              }}></div>
            </div>
            <p style={{ 
              marginTop: 20, 
              fontSize: 18, 
              color: "#eee",
              textAlign: "center",
            }}>
              Analyzing your code
              <span style={{
                display: "inline-block",
                animation: "dots 1.5s infinite steps(3)",
                width: "1em",
                overflow: "hidden",
                verticalAlign: "bottom",
              }}></span>
            </p>
            <p style={{
              marginTop: 10,
              color: "#aaa",
              fontSize: 14,
              maxWidth: "60%",
              textAlign: "center",
              lineHeight: 1.5,
            }}>
              Parsing files, building AST, and applying rule checks
            </p>
          </div>
        ) : !uploadResults ? (
          <div style={{ 
            textAlign: "center", 
            color: "#777", 
            marginTop: "40%",
            animation: "fadeIn 0.5s ease",
          }}>
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                opacity: 0.3,
                marginBottom: 20,
              }}
            >
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20M12 13V9M12 17V15M9 11H15M9 15H11M13 15H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 style={{ color: "#666", marginBottom: 10 }}>No Results Yet</h3>
            <p>Upload a folder to see analysis results here</p>
          </div>
        ) : (
          <div style={{ animation: "slideUp 0.5s ease" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 10,
              borderBottom: "1px solid #333",
            }}>
              <h2 style={{ 
                margin: 0,
                background: "linear-gradient(90deg, #00e676, #00bcd4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}>Analysis Results</h2>
              
              <div style={{ display: "flex", gap: 10 }}>
                {/* Search Input */}
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: "8px 30px 8px 12px",
                      borderRadius: 6,
                      border: "none",
                      fontSize: 14,
                      background: "#333",
                      color: "#eee",
                      width: "200px",
                      transition: "all 0.2s ease",
                    }}
                  />
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="#aaa"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>

                {/* Language Selector */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: 14,
                    background: "#333",
                    color: "#eee",
                    cursor: "pointer",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    transition: "all 0.2s ease",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 10px center",
                    backgroundSize: "16px",
                    paddingRight: "35px",
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#444"}
                  onMouseLeave={(e) => e.target.style.background = "#333"}
                >
                  {uploadResults.languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Results Count */}
            {searchTerm && (
              <div style={{ 
                marginBottom: 15,
                color: "#aaa",
                fontSize: 14,
              }}>
                Found {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </div>
            )}

            {filteredFiles.length > 0 ? (
              filteredFiles.map((file, idx) => (
                <div
                  key={`${file.filename}-${idx}`}
                  style={{
                    marginBottom: 25,
                    padding: 20,
                    background: "linear-gradient(145deg, #1e1e1e, #252525)",
                    borderRadius: 10,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                    borderLeft: "4px solid #00e676",
                    transition: "transform 0.3s ease, boxShadow 0.3s ease",
                    animation: `fadeInUp 0.5s ease ${idx * 0.1}s forwards`,
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 15,
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                          fill="#00e676"
                        />
                      </svg>
                      <h3 style={{ 
                        margin: 0,
                        color: "#00e676",
                        fontSize: 16,
                      }}>{file.filename}</h3>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ 
                        color: "#aaa",
                        fontSize: 14,
                        transition: "opacity 0.3s",
                        opacity: visibleASTs[file.filename] ? 1 : 0.7,
                      }}>
                        {visibleASTs[file.filename] ? "Hide AST" : "Show AST"}
                      </span>
                      <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={visibleASTs[file.filename] || false}
                          onChange={() => toggleAST(file.filename)}
                          style={{ display: "none" }}
                        />
                        <span style={{
                          width: 40,
                          height: 22,
                          background: visibleASTs[file.filename] ? "#00e676" : "#555",
                          borderRadius: 20,
                          position: "relative",
                          transition: "background 0.3s",
                        }}>
                          <span style={{
                            position: "absolute",
                            top: 2,
                            left: visibleASTs[file.filename] ? 20 : 2,
                            width: 18,
                            height: 18,
                            background: "#fff",
                            borderRadius: "50%",
                            transition: "left 0.3s",
                          }}></span>
                        </span>
                      </label>
                    </div>
                  </div>

                  {visibleASTs[file.filename] && (
                    <>
                      <h4 style={{ 
                        marginTop: 15,
                        marginBottom: 10,
                        color: "#aaa",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 19V5H13V9H20V19H4Z"
                            stroke="#00e676"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13 5L20 12"
                            stroke="#00e676"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Abstract Syntax Tree
                      </h4>
                      {renderJSON(file.ast)}
                    </>
                  )}

                  {/* Security Vulnerabilities Section */}
                  {renderVulnerabilities(file.rule_check)}

                  {/* Recommendations Section */}
                  {renderRecommendations(file.rule_check)}

                  {/* Raw Data Toggle */}
                  <details style={{ marginTop: '15px', color: '#aaa' }}>
                    <summary>View raw analysis data</summary>
                    {renderJSON(file.rule_check)}
                  </details>
                </div>
              ))
            ) : searchTerm ? (
              <div style={{ 
                textAlign: "center", 
                padding: "40px 20px",
                color: "#777",
              }}>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    opacity: 0.5,
                    marginBottom: 20,
                  }}
                >
                  <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#777"/>
                  <path d="M12 10v4m0-4v4m0-4v4" stroke="#777" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <h3 style={{ color: "#666", marginBottom: 10 }}>No files found</h3>
                <p>No files match your search for "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  style={{
                    marginTop: 15,
                    padding: "8px 16px",
                    background: "transparent",
                    border: "1px solid #444",
                    borderRadius: 6,
                    color: "#00e676",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 230, 118, 0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div style={{ 
                textAlign: "center", 
                padding: "40px 20px",
                color: "#777",
              }}>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    opacity: 0.5,
                    marginBottom: 20,
                  }}
                >
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20M12 13V9M12 17V15M9 11H15M9 15H11M13 15H15" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 style={{ color: "#666", marginBottom: 10 }}>No files to display</h3>
                <p>No files found for the selected language</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0.7); opacity: 0.7; }
          70% { opacity: 0; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes dots {
          0% { width: 0; }
          100% { width: 3em; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FolderUpload;