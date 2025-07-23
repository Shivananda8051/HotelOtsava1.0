import React, { useState } from 'react';
import axios from 'axios';
import './PANEL.css';

function OutputPanel({ code }) {
  const [output, setOutput] = useState('');
  const [view, setView] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async (type) => {
    setIsLoading(true);
    setOutput('');
    try {
      const res = await axios.post('http://localhost:8000/analyze/', { code });
      const result = res.data.result;

      switch (type) {
        case 'ast':
          setOutput(JSON.stringify(result.ast, null, 2));
          break;
        case 'errors':
          setOutput(result.errors.length ? result.errors.join('\n') : 'No syntax/semantic errors');
          break;
        case 'output':
          setOutput({
            language: res.data.language,
            vulnerabilities: result.vulnerabilities,
            recommendations: result.rules
          });
          break;
        default:
          break;
      }
      setView(type);
    } catch (error) {
      setOutput('Error fetching data from server.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderOutput = () => {
    if (isLoading) {
      return (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Analyzing code...</p>
        </div>
      );
    }

    if (view === 'output' && typeof output === 'object') {
      return (
        <div className="analysis-results">
          <div className="result-section language-section">
            <h3>Language Detected</h3>
            <div className="language-tag">{output.language}</div>
          </div>

          <div className="result-section vulnerabilities-section">
            <h3>Vulnerabilities</h3>
            {output.vulnerabilities.length ? (
              <ul className="vulnerability-list">
                {output.vulnerabilities.map((v, i) => (
                  <li key={i} className="vulnerability-item">
                    <span className="line-number">Line {v.line}</span>
                    <span className="vulnerability-detail">{v.detail}</span>
                    <span className="severity-indicator"></span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-issues">No vulnerabilities found 🎉</div>
            )}
          </div>

          <div className="result-section recommendations-section">
            <h3>Recommendations</h3>
            {output.recommendations.length ? (
              <ul className="recommendation-list">
                {output.recommendations.map((r, i) => (
                  <li key={i} className="recommendation-item">
                    <span className="recommendation-bullet">✓</span>
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-issues">No recommendations</div>
            )}
          </div>
        </div>
      );
    }

    return <pre className="raw-output">{output}</pre>;
  };

  return (
    <div className="output-panel">
      <div className="panel-header">
        <h2>Code Analysis</h2>
        <p className="panel-subtitle">Review your code analysis results</p>
      </div>
      
      <div className="button-group">
        <button 
          className={`analysis-btn ${view === 'output' ? 'active' : ''}`}
          onClick={() => fetchData('output')}
        >
          <span className="btn-icon">🔍</span> Security Analysis
        </button>
        <button 
          className={`analysis-btn ${view === 'ast' ? 'active' : ''}`}
          onClick={() => fetchData('ast')}
        >
          <span className="btn-icon">🌳</span> View AST
        </button>
        <button 
          className={`analysis-btn ${view === 'errors' ? 'active' : ''}`}
          onClick={() => fetchData('errors')}
        >
          <span className="btn-icon">⚠️</span> Error Check
        </button>
      </div>
      
      <div className="output-container">
        {renderOutput()}
      </div>
    </div>
  );
}

export default OutputPanel;