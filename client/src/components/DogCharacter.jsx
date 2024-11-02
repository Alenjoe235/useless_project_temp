import React from 'react';

const DogCharacter = ({ translation }) => (
  <div className="dog-container">
    <div className="dog">
      <div className="dog-body">
        <div className="dog-head">
          <div className="dog-ears"></div>
          <div className="dog-eyes"></div>
          <div className="dog-nose"></div>
          <div className="dog-mouth"></div>
        </div>
        <div className="dog-tail"></div>
      </div>
    </div>
    {translation && (
      <div className="thought-bubble">
        <p>{translation}</p>
      </div>
    )}
  </div>
);

export default DogCharacter;