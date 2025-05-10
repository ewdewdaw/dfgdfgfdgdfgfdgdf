import React from 'react';
import { Notebook } from 'lucide-react';

const ClassroomView: React.FC = () => {
  return (
    <div className="classroom-container">
      <header className="classroom-header">
        <div className="header-left">
          <div className="menu-button">
            <div className="menu-icon">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </div>
          <div className="classroom-logo">
            <Notebook size={24} color="#1a73e8" />
            <span className="classroom-title">Google Classroom</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-avatar">G</div>
        </div>
      </header>
      
      <div className="classroom-content">
        <iframe 
          src="https://classroom.google.com" 
          title="Google Classroom"
          className="classroom-iframe"
        ></iframe>
      </div>
      
      <div className="keyboard-hint">
        <p>Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>C</kbd> to access special features</p>
      </div>
    </div>
  );
};

export default ClassroomView;