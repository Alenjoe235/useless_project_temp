import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DogDiary = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ note: '', mood: '', activities: [] });
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/diary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newEntry)
      });
      const data = await response.json();
      setEntries([...entries, data]);
      setNewEntry({ note: '', mood: '', activities: [] });
    } catch (error) {
      console.error('Error saving diary entry:', error);
    }
  };

  return (
    <div className="diary-container">
      <h2>Dog Diary</h2>
      <form onSubmit={handleSubmit} className="diary-form">
        <input
          type="text"
          placeholder="How was your dog today?"
          value={newEntry.note}
          onChange={(e) => setNewEntry({...newEntry, note: e.target.value})}
          className="input"
        />
        <select
          value={newEntry.mood}
          onChange={(e) => setNewEntry({...newEntry, mood: e.target.value})}
          className="input"
        >
          <option value="">Select Mood</option>
          <option value="happy">Happy</option>
          <option value="playful">Playful</option>
          <option value="tired">Tired</option>
          <option value="anxious">Anxious</option>
        </select>
        <button type="submit" className="button">Save Entry</button>
      </form>
      
      <div className="diary-entries">
        {entries.map((entry, index) => (
          <div key={index} className="diary-entry card">
            <p>{entry.note}</p>
            <span className="mood-tag">{entry.mood}</span>
            <small>{new Date(entry.date).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogDiary;
