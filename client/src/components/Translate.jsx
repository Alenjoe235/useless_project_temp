// components/Translate.jsx
import React, { useState, useEffect } from 'react';
import AudioRecorder from './AudioRecorder';
import AudioUploader from './AudioUploader';
import AudioVisualizer from './AudioVisualizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Translate() {
  const [activeTab, setActiveTab] = useState('record');
  const [translation, setTranslation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [recentTranslations, setRecentTranslations] = useState([]);

  // Sample bark patterns and translations
  const barkPatterns = [
    {
      type: 'excited',
      translations: [
        "I'm so happy to see you! Let's play!",
        "Oh boy, oh boy! This is the best day ever!",
        "Something exciting is happening! Can we check it out?"
      ],
      confidence: 85
    },
    {
      type: 'attention',
      translations: [
        "Hey! I need your attention right now!",
        "Something important is happening!",
        "Look at me! I want to show you something!"
      ],
      confidence: 90
    },
    {
      type: 'hungry',
      translations: [
        "My food bowl is empty! Time for dinner?",
        "I smell something delicious! Can I have some?",
        "I haven't eaten in FOREVER! (20 minutes)"
      ],
      confidence: 88
    },
    {
      type: 'alert',
      translations: [
        "Someone's at the door! Should I be concerned?",
        "I heard something unusual! Let's investigate!",
        "Warning! There's a suspicious squirrel outside!"
      ],
      confidence: 92
    },
    {
      type: 'playful',
      translations: [
        "Let's play fetch! I'll get my favorite toy!",
        "Chase me! I bet you can't catch me!",
        "The zoomies are coming! Watch out!"
      ],
      confidence: 87
    }
  ];

  const processAudio = async (audio, type) => {
    try {
      setIsProcessing(true);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly select a bark pattern and translation
      const pattern = barkPatterns[Math.floor(Math.random() * barkPatterns.length)];
      const translation = pattern.translations[Math.floor(Math.random() * pattern.translations.length)];
      
      // Analysis results
      const result = {
        text: translation,
        confidence: pattern.confidence,
        emotion: pattern.type,
        timestamp: new Date().toISOString(),
        duration: '0:03',
        frequency: '450 Hz',
        intensity: '65 dB'
      };

      // Add to recent translations
      setRecentTranslations(prev => [result, ...prev].slice(0, 5));
      
      return result;
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    }
  };

  const handleTranslation = async (audio, type) => {
    setIsProcessing(true);
    try {
      const result = await processAudio(audio, type);
      setTranslation(result);
      setAudioData(audio);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="translate-page">
      <div className="translate-container">
        <div className="translate-header">
          <h2>Bark Translator</h2>
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'record' ? 'active' : ''}`}
              onClick={() => setActiveTab('record')}
            >
              <FontAwesomeIcon icon="microphone" /> Record Bark
            </button>
            <button 
              className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <FontAwesomeIcon icon="upload" /> Upload Audio
            </button>
          </div>
        </div>

        <div className="translate-content">
          {activeTab === 'record' ? (
            <AudioRecorder onTranslate={(audio) => handleTranslation(audio, 'record')} />
          ) : (
            <AudioUploader onUpload={(audio) => handleTranslation(audio, 'upload')} />
          )}

          {isProcessing && (
            <div className="processing-overlay">
              <div className="spinner"></div>
              <p>Analyzing bark pattern...</p>
              <div className="analysis-steps">
                <div className="step">
                  <FontAwesomeIcon icon="wave-square" /> Analyzing frequency patterns
                </div>
                <div className="step">
                  <FontAwesomeIcon icon="brain" /> Processing emotional context
                </div>
                <div className="step">
                  <FontAwesomeIcon icon="language" /> Generating translation
                </div>
              </div>
            </div>
          )}

          {translation && !isProcessing && (
            <div className="translation-result">
              <h3>Translation Result</h3>
              <div className="result-card">
                <div className="emotion-indicator">
                  <FontAwesomeIcon 
                    icon={getEmotionIcon(translation.emotion)} 
                    className={`emotion-icon ${translation.emotion}`}
                  />
                  <span>{translation.emotion}</span>
                </div>
                
                <div className="translation-text">
                  <p>{translation.text}</p>
                </div>

                <div className="analysis-details">
                  <div className="detail-item">
                    <FontAwesomeIcon icon="chart-line" />
                    <span>Confidence: {translation.confidence}%</span>
                  </div>
                  <div className="detail-item">
                    <FontAwesomeIcon icon="clock" />
                    <span>Duration: {translation.duration}</span>
                  </div>
                  <div className="detail-item">
                    <FontAwesomeIcon icon="wave-square" />
                    <span>Frequency: {translation.frequency}</span>
                  </div>
                  <div className="detail-item">
                    <FontAwesomeIcon icon="volume-up" />
                    <span>Intensity: {translation.intensity}</span>
                  </div>
                </div>

                <div className="confidence-meter">
                  <div 
                    className="meter-fill" 
                    style={{width: `${translation.confidence}%`}}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {recentTranslations.length > 0 && (
            <div className="recent-translations">
              <h3>Recent Translations</h3>
              <div className="translations-list">
                {recentTranslations.map((item, index) => (
                  <div key={index} className="translation-item">
                    <div className="translation-brief">
                      <FontAwesomeIcon 
                        icon={getEmotionIcon(item.emotion)} 
                        className={`emotion-icon ${item.emotion}`}
                      />
                      <span>{item.text}</span>
                    </div>
                    <small>{new Date(item.timestamp).toLocaleTimeString()}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// Helper function to get emotion icon
function getEmotionIcon(emotion) {
  const iconMap = {
    excited: "grin-beam",
    attention: "exclamation",
    hungry: "utensils",
    alert: "bell",
    playful: "football-ball"
  };
  return iconMap[emotion] || "question";
}

export default Translate;