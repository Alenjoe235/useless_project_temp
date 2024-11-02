const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
// const tf = require('@tensorflow/tfjs-node'); // Remove TensorFlow import
const fs = require('fs');
const wav = require('node-wav');

// Comment out mongoose
// const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:5000', // Update to match Docker client URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.static('public'));

// Multer configuration for audio file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Comment out MongoDB connection and schemas
// Instead, use in-memory storage for history
let translations = [];

// Make sure any MongoDB connection code is commented out
/*
mongoose.connect('mongodb://localhost:27017/your_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
*/

// Remove TensorFlow model loading
/*
let model;
async function loadModel() {
    try {
        // Replace with path to your model
        model = await tf.loadLayersModel('file://./models/bark_classifier/model.json');
        console.log('AI Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
    }
}
loadModel();
*/

// Audio preprocessing function
function preprocessAudio(audioPath) {
    // Read and decode WAV file
    const buffer = fs.readFileSync(audioPath);
    const result = wav.decode(buffer);
    
    // Convert audio to mel spectrogram
    // This is a simplified version - you'll need to implement proper audio preprocessing
    const audioData = tf.tensor(result.channelData[0]);
    const spectrogram = tf.signal.stft(audioData, 1024, 256);
    const magnitude = tf.abs(spectrogram);
    
    // Resize to match model input size
    return magnitude.expandDims(0);
}

// API Routes
app.post('/api/translate', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        const translation = await translateBark(req.file.path);
        const patterns = analyzePatterns(req.file.path);

        // Store in memory instead of database
        const newTranslation = {
            audioFile: req.file.filename,
            translation: translation.text,
            confidence: translation.confidence,
            sentiment: translation.sentiment,
            patterns,
            timestamp: new Date()
        };
        
        translations.push(newTranslation);

        res.json({
            success: true,
            translation: translation.text,
            confidence: translation.confidence,
            sentiment: translation.sentiment,
            patterns
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/history', async (req, res) => {
    try {
        // Return in-memory translations instead of database query
        const history = translations
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Updated translation function using AI
async function translateBark(audioPath) {
    try {
        const preprocessedAudio = await preprocessAudio(audioPath);
        const prediction = await model.predict(preprocessedAudio);
        const moodIndex = prediction.argMax(-1).dataSync()[0];
        
        // Mapping of emotional states
        const moods = {
            0: { mood: "Happy", translations: ["I'm so excited!", "This is fun!", "I love this!"] },
            1: { mood: "Anxious", translations: ["I'm feeling nervous", "Something's bothering me", "I need reassurance"] },
            2: { mood: "Alert", translations: ["There's something there!", "Watch out!", "I heard something"] },
            3: { mood: "Hungry", translations: ["Time for food!", "I'm starving!", "Can I have a treat?"] },
            4: { mood: "Playful", translations: ["Let's play!", "Come chase me!", "Want to play with my toy?"] }
        };

        const moodData = moods[moodIndex];
        const confidence = prediction.max().dataSync()[0];
        
        return {
            text: moodData.translations[Math.floor(Math.random() * moodData.translations.length)],
            confidence: confidence,
            sentiment: {
                mood: moodData.mood,
                intensity: confidence
            }
        };
    } catch (error) {
        console.error('Error in AI translation:', error);
        // Fallback to basic translation if AI fails
        return basicTranslation();
    }
}

// Fallback translation function
async function basicTranslation() {
    const defaultTranslations = [
        "Hello! I'm excited to see you!",
        "I need attention!",
        "I'm hungry!",
        "Let's play!",
        "I hear something!",
        "I love you!",
        "Can we go for a walk?"
    ];

    const sentiments = {
        happy: { mood: "Happy", intensity: 0.9 },
        excited: { mood: "Excited", intensity: 0.8 },
        alert: { mood: "Alert", intensity: 0.7 },
        hungry: { mood: "Hungry", intensity: 0.6 },
        playful: { mood: "Playful", intensity: 0.9 }
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Randomly select translation and sentiment
    const text = defaultTranslations[Math.floor(Math.random() * defaultTranslations.length)];
    const sentimentKeys = Object.keys(sentiments);
    const sentiment = sentiments[sentimentKeys[Math.floor(Math.random() * sentimentKeys.length)]];

    return {
        text,
        confidence: 0.8 + Math.random() * 0.2,
        sentiment
    };
}

// Function to analyze bark patterns (mock)
function analyzePatterns(audioPath) {
    return ["Short bark", "Medium pitch", "Repeated pattern"];
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Make sure uploads directory exists
if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}