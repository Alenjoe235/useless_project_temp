// src/components/TranslationHistory.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

const TranslationHistory = ({ history }) => {
  return (
    <div className="translation-history">
      <h3>Recent Translations</h3>
      <div className="history-list">
        {history.length === 0 ? (
          <p className="no-history">No translations yet...</p>
        ) : (
          history.map((item, index) => (
            <div key={index} className="history-item">
              <FontAwesomeIcon icon={faPaw} className="paw-icon" />
              <p>{item.translation}</p>
              <small>{new Date(item.timestamp).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TranslationHistory;