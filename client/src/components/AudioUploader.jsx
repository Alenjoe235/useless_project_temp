// components/AudioUploader.jsx
import React, { useState } from 'react';

const AudioUploader = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null); // Add this line

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      const audioUrl = URL.createObjectURL(file);
      setAudioSrc(audioUrl);
      onUpload(audioUrl, 'upload');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      const audioUrl = URL.createObjectURL(file);
      setAudioSrc(audioUrl);
      onUpload(audioUrl, 'upload');
    }
  };

  return (
    <div className="uploader-container">
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept="audio/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className="upload-label">
          <div className="upload-content">
            <i className="fas fa-cloud-upload-alt"></i>
            <p>Drag and drop your audio file here or click to browse</p>
            {selectedFile && (
              <p className="selected-file">Selected: {selectedFile.name}</p>
            )}
          </div>
        </label>
      </div>

      {audioSrc && (
        <audio src={audioSrc} controls className="audio-preview" />
      )}
    </div>
  );
};

export default AudioUploader;