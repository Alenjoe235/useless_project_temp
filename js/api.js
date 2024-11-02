class BarkAPI {
    constructor() {
        this.recordings = [];
    }

    saveRecording(audioBlob, interpretation) {
        const recording = {
            id: Date.now(),
            timestamp: new Date(),
            audio: audioBlob,
            interpretation: interpretation
        };
        this.recordings.push(recording);
        return recording;
    }

    getRecordings() {
        return this.recordings;
    }
}