import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#1a202c', color: 'white' }}>
  <div style={{ textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>404 - Page Not Found</h1>
    <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Sorry, the page you are looking for doesn't exist.</p>
    <Link to="/" style={{ color: '#63b3ed', textDecoration: 'none', transition: 'color 0.3s ease' }} onMouseOver={e => e.target.style.color = '#3182ce'} onMouseOut={e => e.target.style.color = '#63b3ed'}>
      Go back to Home
    </Link>
  </div>
</div>
  );
};

export default NotFound;



