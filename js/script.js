// DOM Elements
const recordBtn = document.getElementById('recordBtn');
const audioFile = document.getElementById('audioFile');
const visualizer = document.getElementById('visualizer');
const translatedText = document.getElementById('translatedText');
const thoughtBubble = document.querySelector('.thought-bubble');
const historyList = document.getElementById('historyList');

// Audio Context
let audioContext;
let analyser;
let dataArray;
let recorder;
let isRecording = false;

// Dog phrases for translation
const dogPhrases = [
    {
        trigger: ['food', 'eat', 'hungry'],
        translations: [
            "OH BOY OH BOY! FOOD? Did someone say FOOD? I haven't eaten in FOREVER! (It's been 30 minutes...)",
            "My bowl is empty! This is a TRAGEDY! I might waste away to nothing!",
            "TREATS? I heard treats! I've been the goodest boy/girl, I promise!"
        ]
    },
    {
        trigger: ['walk', 'outside', 'park'],
        translations: [
            "WALKIES?! YES YES YES! Let me get my leash! *tail wagging intensifies*",
            "Outside? Did you say OUTSIDE?! This is the BEST DAY EVER!",
            "Park? PARK! PARK! PARK! I love you so much right now!"
        ]
    },
    {
        trigger: ['play', 'ball', 'toy'],
        translations: [
            "THROW IT! THROW IT! I'll bring it right back... maybe!",
            "BALL BALL BALL! This is my favorite thing ever! Until the next thing!",
            "Yes! Play time! I've been waiting my whole life for this moment!"
        ]
    },
    {
        trigger: ['attention', 'pet', 'love'],
        translations: [
            "Excuse me, but your hands appear to be unoccupied. Perhaps they should be petting me?",
            "HUMAN! You are my favorite human! Let me show you my belly!",
            "Love you love you love you! Did I mention I love you?"
        ]
    }
];

// Initialize audio context
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

// Start recording
function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            recorder = new MediaRecorder(stream);
            recorder.start();
            visualize(stream);
            
            recorder.ondataavailable = (e) => {
                translateBark(e.data);
            };
        })
        .catch(err => console.error('Error accessing microphone:', err));
}

// Stop recording
function stopRecording() {
    recorder.stop();
    recorder = null;
}

// Visualize audio
function visualize(stream) {
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    
    function draw() {
        if (!isRecording) return;
        
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        
        const canvas = visualizer;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#8B5CF6';
        ctx.beginPath();
        
        const sliceWidth = width / dataArray.length;
        let x = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * height / 2;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        ctx.lineTo(width, height / 2);
        ctx.stroke();
    }
    
    draw();
}

// Translate bark
function translateBark(audioData) {
    // Simulate processing time
    thoughtBubble.classList.remove('hidden');
    translatedText.textContent = "Processing bark...";
    
    setTimeout(() => {
        // Randomly select a category and translation
        const category = dogPhrases[Math.floor(Math.random() * dogPhrases.length)];
        const translation = category.translations[Math.floor(Math.random() * category.translations.length)];
        
        // Display translation with animation
        thoughtBubble.classList.add('animate__animated', 'animate__bounceIn');
        translatedText.textContent = translation;
        
        // Add to history
        addToHistory(translation);
    }, 1500);
}

// Add translation to history
function addToHistory(translation) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item animate__animated animate__fadeIn';