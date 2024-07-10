import React, { useState } from 'react';
import './Git.css';
import { RiGithubFill } from 'react-icons/ri';
import { Switch } from 'antd';
import { useHistory } from 'react-router-dom';
import strapigenImage from './logoStrapiGen.png'; // Import the image

const GitConnect = () => {
  const [toggleChecked, setToggleChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const CLIENT_ID = 'e9d29cdcac4030c9ba3f';

  const handleToggleChange = (checked) => {
    setToggleChecked(checked);
    setErrorMessage('');
  };

  const handleConnectButtonClick = () => {
    if (!toggleChecked) {
      setErrorMessage('Please allow Github Synchronization.');
      return;
    }
    // Navigate to the services page
    history.push('/plugins/strapi-gen/ProjectName');
  };

  const loginWithGithub = () => {
    if (!toggleChecked) {
      setErrorMessage('Please allow Github Synchronization.');
      return;
    }
    window.location.assign(
      'https://github.com/login/oauth/authorize?client_id=' + CLIENT_ID
    );
  };

  const handleAuthorizationRefused = () => {
    setErrorMessage('Authorization to GitHub was refused. Please try again.');
    setToggleChecked(false); // Reset toggle
  };

  return (
    <div className="docker-file-generator-container" style={{ marginTop: '40px' }}>
      <div className="docker-file-generator-content">
        <img
          src={strapigenImage}
          alt="StrapiGEN"
          className="strapigen-image"
          style={{ width: '350px', height: 'auto', marginBottom: '-80px' }}
        />
        <div className="github-text">
          <p> Let's connect to your Github Account 🌌</p>
          <span>🚀 Authorize your GitHub account will allow you to synchronize the project with your GitHub account! 🚀</span>
        </div>
        <div className="github-container">
          <div className="github-content">
            <div className="github-icon">
              <RiGithubFill size={50} color="#f9f9f9" style={{ marginLeft: '200px' }} />
            </div>
            <button className="connect-button" onClick={loginWithGithub} style={{ marginLeft: '350px', marginTop: '20px' }} disabled={!toggleChecked}>
              Connect
            </button>
          </div>
        </div>
        <div className="toggle-container"  style={{ marginLeft: '230px' }}>
          <Switch checked={toggleChecked} onChange={handleToggleChange} />
          <span className="toggle-label">Allow Github Synchronization</span>
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default GitConnect;
