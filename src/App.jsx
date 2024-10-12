import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';
import './App.css';

const socialMediaApps = [
  { name: 'Facebook', icon: FaFacebook, color: '#1877F2' },
  { name: 'Twitter', icon: FaTwitter, color: '#1DA1F2' },
  { name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { name: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
  { name: 'YouTube', icon: FaYoutube, color: '#FF0000' },
  { name: 'TikTok', icon: FaTiktok, color: '#000000' },
];

const Bubble = ({ name, icon: Icon, color, onClick, size = 80 }) => {
  return (
    <div 
      className="bubble" 
      style={{ backgroundColor: color, width: size, height: size }} 
      onClick={() => onClick(name)}
    >
      <Icon size={size * 0.375} />
      <span className="bubble-name">{name}</span>
    </div>
  );
};

const DetailView = ({ app, onClose }) => {
  const [timeLimit, setTimeLimit] = useState(() => {
    const savedLimit = localStorage.getItem(`${app}TimeLimit`);
    return savedLimit ? parseInt(savedLimit) : 30;
  });
  const selectedApp = socialMediaApps.find(a => a.name === app);

  const handleSliderChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setTimeLimit(newLimit);
    localStorage.setItem(`${app}TimeLimit`, newLimit.toString());
  };

  const handleStartUsing = () => {
    const startTime = Date.now();
    localStorage.setItem(`${app}StartTime`, startTime.toString());
    onClose();
  };

  return (
    <div className="detail-view">
      <Bubble {...selectedApp} size={120} onClick={() => {}} />
      <h2>{app} Details</h2>
      <p>Set your daily time limit for {app}:</p>
      <input 
        type="range" 
        min="5" 
        max="180" 
        value={timeLimit} 
        onChange={handleSliderChange}
        className="slider"
      />
      <p>Time limit: {timeLimit} minutes</p>
      <button onClick={handleStartUsing}>Start Using</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const PopUp = ({ message, onClose }) => {
  return (
    <div className="popup">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

function App() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState('');

  useEffect(() => {
    const checkTimeLimits = () => {
      socialMediaApps.forEach(app => {
        const startTime = localStorage.getItem(`${app.name}StartTime`);
        const timeLimit = localStorage.getItem(`${app.name}TimeLimit`);
        
        if (startTime && timeLimit) {
          const elapsedTime = (Date.now() - parseInt(startTime)) / 60000; // in minutes
          if (elapsedTime > parseInt(timeLimit)) {
            setPopUpMessage(`You've exceeded your time limit for ${app.name}!`);
            setShowPopUp(true);
          }
        }
      });
    };

    const intervalId = setInterval(checkTimeLimits, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);

  const handleBubbleClick = (appName) => {
    setSelectedApp(appName);
  };

  const handleClose = () => {
    setSelectedApp(null);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
  };

  return (
    <div className="App">
      <h1>Social Media Bubbles</h1>
      {selectedApp ? (
        <DetailView app={selectedApp} onClose={handleClose} />
      ) : (
        <div className="bubble-container">
          {socialMediaApps.map((app) => (
            <Bubble key={app.name} {...app} onClick={handleBubbleClick} />
          ))}
        </div>
      )}
      {showPopUp && <PopUp message={popUpMessage} onClose={handleClosePopUp} />}
    </div>
  );
}

export default App;