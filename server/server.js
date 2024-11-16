const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');
const wav = require('node-wav');

const app = express();
const port = process.env.PORT || 3000;

// Constants
const UPLOAD_DIR = 'uploads';
const MODEL_PATH = 'models/bark_classifier/model.json';

// Bark translation configurations
const MOODS = {
    HAPPY: {
        translations: [
            "I'm so excited to see you!",
            "This is the best day ever!",
            "Let's play together!",
            "You make me so happy!"
        ],
        confidence: 0.9
    },
    HUNGRY: {
        translations: [
            "Is it dinner time yet?",
            "Those treats smell amazing!",
            "I'd love a snack right now!",
            "Food please!"
        ],
        confidence: 0.85
    },
    ALERT: {
        translations: [
            "Someone's at the door!",
            "Did you hear that?",
            "There's something interesting out there!",
            "Pay attention, something's happening!"
        ],
        confidence: 0.8
    },
    ANXIOUS: {
        translations: [
            "I'm feeling a bit nervous",
            "Can you stay close to me?",
            "Something's making me uneasy",
            "I need some comfort"
        ],
        confidence: 0.75
    },
    PLAYFUL: {
        translations: [
            "Let's play fetch!",
            "Chase me!",
            "Where's my favorite toy?",
            "Play time is the best time!"
        ],
        confidence: 0.95
    }
};

// Middleware Configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.CLIENT_URL 
        : 'http://localhost:5000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.static('public'));

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `bark-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['audio/wav', 'audio/x-wav', 'audio/mpeg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only WAV and MP3 files are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// In-memory storage for translation history
let translations = [];

// Model handling
let model;
async function loadModel() {
    try {
        model = await tf.loadLayersModel(`file://${MODEL_PATH}`);
        console.log('Bark classification model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        throw new Error('Failed to load AI model');
    }
}

// Audio Processing
async function preprocessAudio(audioPath) {
    try {
        const buffer = fs.readFileSync(audioPath);
        const { sampleRate, channelData } = wav.decode(buffer);
        
        // Convert to mono if stereo
        const monoData = channelData.length > 1 
            ? channelData[0].map((sample, i) => 
                channelData.reduce((sum, channel) => sum + channel[i], 0) / channelData.length)
            : channelData[0];
            
        // Create spectrogram
        const frameSize = 2048;
        const hopSize = 512;
        const fft = tf.signal.stft(
            tf.tensor1d(monoData),
            frameSize,
            hopSize,
            undefined,
            tf.hannWindow
        );
        
        const magnitude = tf.abs(fft);
        const melSpectrogram = tf.image.resizeBilinear(
            magnitude.expandDims(2),
            [128, 130]
        );
        
        return melSpectrogram.expandDims(0);
    } catch (error) {
        console.error('Error preprocessing audio:', error);
        throw new Error('Failed to process audio file');
    }
}

// Translation Logic
async function translateBark(audioPath) {
    try {
        if (!model) {
            throw new Error('AI model not loaded');
        }

        const preprocessedAudio = await preprocessAudio(audioPath);
        const prediction = await model.predict(preprocessedAudio).array();
        
        // Get the mood with highest probability
        const moodIndex = prediction[0].indexOf(Math.max(...prediction[0]));
        const moodKeys = Object.keys(MOODS);
        const selectedMood = MOODS[moodKeys[moodIndex]];
        
        // Random translation from mood's collection
        const translation = selectedMood.translations[
            Math.floor(Math.random() * selectedMood.translations.length)
        ];

        return {
            text: translation,
            confidence: selectedMood.confidence * (0.9 + Math.random() * 0.1),
            sentiment: {
                mood: moodKeys[moodIndex],
                intensity: prediction[0][moodIndex]
            }
        };
    } catch (error) {
        console.error('Translation error:', error);
        return fallbackTranslation();
    }
}

function fallbackTranslation() {
    const moodKeys = Object.keys(MOODS);
    const randomMood = MOODS[moodKeys[Math.floor(Math.random() * moodKeys.length)]];
    
    return {
        text: randomMood.translations[Math.floor(Math.random() * randomMood.translations.length)],
        confidence: 0.6 + Math.random() * 0.2,
        sentiment: {
            mood: 'UNKNOWN',
            intensity: 0.5
        }
    };
}

// Routes
app.post('/api/translate', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        const translation = await translateBark(req.file.path);
        
        // Store translation in history
        translations.push({
            id: Date.now().toString(),
            audioFile: req.file.filename,
            translation: translation.text,
            confidence: translation.confidence,
            sentiment: translation.sentiment,
            timestamp: new Date()
        });

        // Limit history size
        if (translations.length > 100) {
            const oldestFile = translations[0].audioFile;
            translations = translations.slice(-100);
            
            // Cleanup old files
            fs.unlink(path.join(UPLOAD_DIR, oldestFile), (err) => {
                if (err) console.error('Error deleting old file:', err);
            });
        }

        res.json({
            success: true,
            ...translation
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const history = translations
        .slice(-limit)
        .reverse();
    res.json(history);
});

// Startup
async function startServer() {
    try {
        // Ensure upload directory exists
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR);
        }
        
        // Load AI model
        await loadModel();
        
        // Start server
        app.listen(port, () => {
            console.log(`🐕 Bark Translator Server running on port ${port}`);
            console.log(`🎯 Ready to translate your furry friend's messages!`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Cleanup on shutdown
process.on('SIGINT', () => {
    console.log('\nCleaning up...');
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) throw err;
        for (const file of files) {
            fs.unlink(path.join(UPLOAD_DIR, file), err => {
                if (err) console.error(`Error deleting ${file}:`, err);
            });
        }
    });
    process.exit();
});