// components/AudioRecorder.jsx
import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = ({ onTranslate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [audioSrc, setAudioSrc] = useState(null);
  const mediaRecorder = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const audioChunks = useRef([]);

  // Add the analyzeBark function
  const analyzeBark = (dataArray) => {
    // Calculate average frequency
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    
    // Simple interpretation based on frequency intensity
    if (average < 50) {
      return "Quiet bark - might be a gentle request";
    } else if (average < 100) {
      return "Medium bark - trying to get attention";
    } else {
      return "Loud bark - something exciting or urgent!";
    }
  };

  useEffect(() => {
    // Initialize Audio Context
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    analyser.current = audioContext.current.createAnalyser();
    analyser.current.fftSize = 2048;
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = []; // Reset chunks
      
      // Connect to audio analyzer
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      
      const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioSrc(audioUrl);
        onTranslate(audioUrl, 'record');
        audioChunks.current = []; // Clear chunks after processing
      };

      // Start frequency analysis
      const analyzeFrequency = () => {
        if (isRecording) {
          analyser.current.getByteFrequencyData(dataArray);
          const interpretation = analyzeBark(dataArray);
          setInterpretation(interpretation);
          requestAnimationFrame(analyzeFrequency);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      analyzeFrequency();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="recording-container">
      <button 
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      
      {interpretation && (
        <div className="interpretation-container">
          <h3>Real-time Interpretation:</h3>
          <p>{interpretation}</p>
        </div>
      )}

      {audioSrc && (
        <audio src={audioSrc} controls className="audio-preview" />
      )}
    </div>
  );
};

export default AudioRecorder;