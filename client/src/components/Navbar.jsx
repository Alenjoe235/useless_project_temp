import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/translate">Translate</Link></li>
        <li><Link to="/history">History</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;