// components/History.jsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faTrash, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const History = () => {
  const [translations, setTranslations] = useState([]);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    fetchTranslationHistory();
  }, []);

  const fetchTranslationHistory = () => {
    const savedTranslations = JSON.parse(localStorage.getItem('translations')) || [];
    setTranslations(savedTranslations);
  };

  const deleteTranslation = (id) => {
    const updatedTranslations = translations.filter(item => item.id !== id);
    setTranslations(updatedTranslations);
    localStorage.setItem('translations', JSON.stringify(updatedTranslations));
  };

  const playAudio = (audioUrl, id) => {
    if (playing === id) {
      // Stop playing
      setPlaying(null);
    } else {
      // Start playing new audio
      const audio = new Audio(audioUrl);
      audio.play();
      setPlaying(id);
      audio.onended = () => setPlaying(null);
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Translation History</h2>
        <p>Your recent bark translations</p>
      </div>

      {translations.length === 0 ? (
        <div className="no-history">
          <FontAwesomeIcon icon={faPaw} size="3x" />
          <p>No translations yet! Start by recording or uploading a bark.</p>
        </div>
      ) : (
        <div className="history-list">
          {translations.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-item-content">
                <div className="history-item-icon">
                  <FontAwesomeIcon icon={faPaw} />
                </div>
                
                <div className="history-item-details">
                  <div className="translation-text">
                    {item.text}
                  </div>
                  
                  <div className="translation-meta">
                    <span className="timestamp">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                    <span className="confidence">
                      Confidence: {item.confidence}%
                    </span>
                  </div>

                  <div className="confidence-meter">
                    <div 
                      className="confidence-bar"
                      style={{ width: `${item.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="history-item-actions">
                  <button 
                    className="action-button play"
                    onClick={() => playAudio(item.audioUrl, item.id)}
                  >
                    <FontAwesomeIcon icon={playing === item.id ? faPause : faPlay} />
                  </button>
                  
                  <button 
                    className="action-button delete"
                    onClick={() => deleteTranslation(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;