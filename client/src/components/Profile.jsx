import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="card">
      <h2>Profile</h2>
      <div className="profile-info">
        <p>Email: {user?.email}</p>
        {user?.dogProfile && (
          <>
            <p>Dog's Name: {user.dogProfile.name}</p>
            <p>Breed: {user.dogProfile.breed}</p>
            <p>Age: {user.dogProfile.age}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
