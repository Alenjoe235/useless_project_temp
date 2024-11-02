import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    dogProfile: {
      name: '',
      breed: '',
      age: '',
      photo: null
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('dog.')) {
      const [, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        dogProfile: {
          ...prev.dogProfile,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        dogProfile: {
          ...prev.dogProfile,
          photo: file
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Create FormData object for multipart form data
      const submitData = new FormData();
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('dogName', formData.dogProfile.name);
      submitData.append('dogBreed', formData.dogProfile.breed);
      submitData.append('dogAge', formData.dogProfile.age);
      if (formData.dogProfile.photo) {
        submitData.append('dogPhoto', formData.dogProfile.photo);
      }

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: submitData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto-login after successful registration
      await login(formData.email, formData.password);
      navigate('/translate');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Account Information</h3>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="input"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input"
              required
            />
          </div>

          <div className="form-section">
            <h3>Dog Profile</h3>
            <input
              type="text"
              name="dog.name"
              placeholder="Dog's Name"
              value={formData.dogProfile.name}
              onChange={handleInputChange}
              className="input"
              required
            />
            <input
              type="text"
              name="dog.breed"
              placeholder="Dog's Breed"
              value={formData.dogProfile.breed}
              onChange={handleInputChange}
              className="input"
              required
            />
            <input
              type="number"
              name="dog.age"
              placeholder="Dog's Age"
              value={formData.dogProfile.age}
              onChange={handleInputChange}
              className="input"
              required
            />
            <div className="file-upload-container">
              <input
                type="file"
                name="dog.photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="file-upload-input"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
