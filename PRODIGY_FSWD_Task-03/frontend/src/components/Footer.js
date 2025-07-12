import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: '#1976d2', color: '#fff', padding: '2rem 0', marginTop: '2rem', textAlign: 'center' }}>
      <div style={{ marginTop: 16, fontSize: 14 }}>
        &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
