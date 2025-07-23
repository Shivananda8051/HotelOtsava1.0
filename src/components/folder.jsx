import React, { useState, useEffect } from "react";

const FolderUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [visibleASTs, setVisibleASTs] = useState({});
  const [loading, setLoading] = useState(false);

  const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file, file.webkitRelativePath || file.name);
    });

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/folder/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();

      // Transform data to ensure consistent structure
      const transformedData = {
        ...data,
        results: Object.fromEntries(
          Object.entries(data.results).map(([lang, files]) => [
            lang,
            files.map((file) => ({
              ...file,
              rule_check: file.rule_check || { rules: [], vulnerabilities: [] },
            })),
          ])
        ),
      };

      setUploadResults(transformedData);
      if (transformedData.languages && transformedData.languages.length > 0) {
        setSelectedLanguage(transformedData.languages[0]);
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

  // Debugging effect to log data structure
  useEffect(() => {
    if (uploadResults) {
      console.log("Upload results structure:", uploadResults);
      if (uploadResults.results && selectedLanguage) {
        console.log(
          "Sample file structure:",
          uploadResults.results[selectedLanguage]?.[0]
        );
      }
    }
  }, [uploadResults, selectedLanguage]);

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
              background:
                "radial-gradient(circle at center, rgba(0, 230, 118, 0.1) 0%, transparent 70%)",
              animation: "pulse 2s infinite alternate",
            }}
          />
        )}

        <label
          htmlFor="folderUploadInput"
          style={{
            position: "relative",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, #00e676 60%, #009624 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 15px rgba(0, 230, 118, 0.6)",
            cursor: "pointer",
            overflow: "visible",
            zIndex: 0,
            transform: isDragging ? "scale(1.1)" : "scale(1)",
            transition: "all 0.3s ease",
          }}
        >
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

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
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
            <span
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 14,
                pointerEvents: "none",
                userSelect: "none",
                textAlign: "center",
                textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            >
              Upload Folder
            </span>
          </div>
        </label>

        <p
          style={{
            marginTop: 20,
            color: "#aaa",
            fontSize: 14,
            textAlign: "center",
            opacity: isDragging ? 0.8 : 0.6,
            transform: isDragging ? "translateY(5px)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          or drag & drop here
        </p>

        <div
          style={{
            position: "absolute",
            bottom: 20,
            color: "#666",
            fontSize: 12,
            textAlign: "center",
          }}
        >
          Supports: JavaScript, Python, Java, C++, PHP, Ruby
        </div>
      </div>

      {/* Result Panel */}
      <div
        style={{
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
        }}
      >
        {loading ? (
          <div
            style={{
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
            }}
          >
            <div
              style={{
                position: "relative",
                width: 100,
                height: 100,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "8px solid transparent",
                  borderTopColor: "#00e676",
                  animation: "spin 1.5s linear infinite",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  width: "80%",
                  height: "80%",
                  top: "10%",
                  left: "10%",
                  borderRadius: "50%",
                  border: "8px solid transparent",
                  borderTopColor: "#00bcd4",
                  animation: "spinReverse 1.8s linear infinite",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  width: "60%",
                  height: "60%",
                  top: "20%",
                  left: "20%",
                  borderRadius: "50%",
                  border: "8px solid transparent",
                  borderTopColor: "#009688",
                  animation: "spin 2.1s linear infinite",
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  width: "40%",
                  height: "40%",
                  top: "30%",
                  left: "30%",
                  borderRadius: "50%",
                  border: "8px solid transparent",
                  borderTopColor: "#4caf50",
                  animation: "spinReverse 2.4s linear infinite",
                }}
              ></div>
            </div>
            <p
              style={{
                marginTop: 20,
                fontSize: 18,
                color: "#eee",
                textAlign: "center",
              }}
            >
              Analyzing your code
              <span
                style={{
                  display: "inline-block",
                  animation: "dots 1.5s infinite steps(3)",
                  width: "1em",
                  overflow: "hidden",
                  verticalAlign: "bottom",
                }}
              ></span>
            </p>
            <p
              style={{
                marginTop: 10,
                color: "#aaa",
                fontSize: 14,
                maxWidth: "60%",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              Parsing files, building AST, and applying security rules
            </p>
          </div>
        ) : !uploadResults ? (
          <div
            style={{
              textAlign: "center",
              color: "#777",
              marginTop: "40%",
              animation: "fadeIn 0.5s ease",
            }}
          >
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: "1px solid #333",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  background: "linear-gradient(90deg, #00e676, #00bcd4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                }}
              >
                Analysis Results
              </h2>

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
                onMouseEnter={(e) => (e.target.style.background = "#444")}
                onMouseLeave={(e) => (e.target.style.background = "#333")}
              >
                {uploadResults.languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "semgrepResults",
                    JSON.stringify(uploadResults.semgrep_results)
                  );
                  window.location.href = "/semgrep-results";
                }}
                style={{
                  padding: "8px 16px",
                  background: "#00e676",
                  border: "none",
                  borderRadius: 6,
                  color: "#000",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background 0.3s ease",
                }}
              >
                Rule
              </button>
            </div>

            {uploadResults.results[selectedLanguage]?.map((file, idx) => (
              <div
                key={`${file.filename}-${idx}`}
                style={{
                  marginBottom: 25,
                  padding: 20,
                  background: "linear-gradient(145deg, #1e1e1e, #252525)",
                  borderRadius: 10,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                  borderLeft: "4px solid #00e676",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  animation: `fadeInUp 0.5s ease ${idx * 0.1}s forwards`,
                  opacity: 0,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-3px)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 15,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
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
                    <h3
                      style={{
                        margin: 0,
                        color: "#00e676",
                        fontSize: 16,
                      }}
                    >
                      {file.filename}
                    </h3>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        color: "#aaa",
                        fontSize: 14,
                        transition: "opacity 0.3s",
                        opacity: visibleASTs[file.filename] ? 1 : 0.7,
                      }}
                    >
                      {visibleASTs[file.filename] ? "Hide AST" : "Show AST"}
                    </span>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={visibleASTs[file.filename] || false}
                        onChange={() => toggleAST(file.filename)}
                        style={{ display: "none" }}
                      />
                      <span
                        style={{
                          width: 40,
                          height: 22,
                          background: visibleASTs[file.filename]
                            ? "#00e676"
                            : "#555",
                          borderRadius: 20,
                          position: "relative",
                          transition: "background 0.3s",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 2,
                            left: visibleASTs[file.filename] ? 20 : 2,
                            width: 18,
                            height: 18,
                            background: "#fff",
                            borderRadius: "50%",
                            transition: "left 0.3s",
                          }}
                        ></span>
                      </span>
                    </label>
                  </div>
                </div>

                {visibleASTs[file.filename] && (
                  <>
                    <h4
                      style={{
                        marginTop: 15,
                        marginBottom: 10,
                        color: "#aaa",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
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

                <h4
                  style={{
                    marginTop: 15,
                    marginBottom: 10,
                    color: "#aaa",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12L11 14L15 10M12 3C13.1819 3 14.3522 3.23279 15.4442 3.68508C16.5361 4.13738 17.5282 4.80031 18.364 5.63604C19.1997 6.47177 19.8626 7.46392 20.3149 8.55585C20.7672 9.64778 21 10.8181 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 4.15893 7.32387 6.22183 5.63604C8.28473 3.94821 11.0224 3 12 3Z"
                      stroke="#00e676"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Security Analysis
                </h4>

                {file.rule_check?.rules && file.rule_check.rules.length > 0 && (
                  <div style={{ marginBottom: 15 }}>
                    <h5
                      style={{ color: "#ccc", fontSize: 13, marginBottom: 5 }}
                    >
                      Rules Violated:
                    </h5>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {file.rule_check.rules.map((rule, i) => (
                        <span
                          key={i}
                          style={{
                            background: "#333",
                            color: "#ff6b6b",
                            padding: "3px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {file.rule_check?.vulnerabilities &&
                  file.rule_check.vulnerabilities.length > 0 && (
                    <div>
                      <h5
                        style={{ color: "#ccc", fontSize: 13, marginBottom: 5 }}
                      >
                        Vulnerabilities:
                      </h5>
                      {renderJSON(file.rule_check.vulnerabilities)}
                    </div>
                  )}

                {(!file.rule_check?.rules ||
                  file.rule_check.rules.length === 0) &&
                  (!file.rule_check?.vulnerabilities ||
                    file.rule_check.vulnerabilities.length === 0) && (
                    <div style={{ color: "#4caf50", fontStyle: "italic" }}>
                      No security issues detected
                    </div>
                  )}
              </div>
            ))}
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
