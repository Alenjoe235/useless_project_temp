const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Constants
const UPLOAD_DIR = '/tmp';

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
const storage = multer.memoryStorage();
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
        fileSize: 5 * 1024 * 1024
    }
});

let translations = [];

// Simplified translation logic
function getRandomTranslation() {
    const moodKeys = Object.keys(MOODS);
    const randomMood = MOODS[moodKeys[Math.floor(Math.random() * moodKeys.length)]];
    const translation = randomMood.translations[
        Math.floor(Math.random() * randomMood.translations.length)
    ];
    
    return {
        text: translation,
        confidence: 0.7 + Math.random() * 0.3,
        sentiment: {
            mood: moodKeys[Math.floor(Math.random() * moodKeys.length)],
            intensity: 0.5 + Math.random() * 0.5
        }
    };
}

// Routes
app.post('/api/translate', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        const translation = getRandomTranslation();
        
        translations.push({
            id: Date.now().toString(),
            audioFile: req.file.originalname,
            translation: translation.text,
            confidence: translation.confidence,
            sentiment: translation.sentiment,
            timestamp: new Date()
        });

        if (translations.length > 100) {
            translations = translations.slice(-100);
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
    const history = translations.slice(-limit).reverse();
    res.json(history);
});

// Simple server startup
app.listen(port, () => {
    console.log(`🐕 Bark Translator Server running on port ${port}`);
});

module.exports = app;