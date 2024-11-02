// components/AudioVisualizer.jsx
import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ audioData }) => {
  const canvasRef = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);

  useEffect(() => {
    if (!audioData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    analyser.current = audioContext.current.createAnalyser();
    analyser.current.fftSize = 2048;

    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const source = audioContext.current.createMediaElementSource(audioData);
    source.connect(analyser.current);
    analyser.current.connect(audioContext.current.destination);

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.current.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgb(200, 200, 200)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 0, 0)';
      ctx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [audioData]);

  return (
    <canvas 
      ref={canvasRef} 
      className="audio-visualizer"
      width="800"
      height="200"
    />
  );
};

export default AudioVisualizer;