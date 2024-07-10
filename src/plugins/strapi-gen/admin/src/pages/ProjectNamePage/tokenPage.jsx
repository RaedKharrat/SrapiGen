import React, { useState } from 'react';
import './ProjectNamePage.css';
import { useHistory } from 'react-router-dom';
import strapigenImage from './logoStrapiGen.png'; 


const TokenPage = () => {
  const [tokenGitOauth, setTokenGitOauth] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleInputChange = (event) => {
    setTokenGitOauth(event.target.value);
    setErrorMessage('');
  };

  const handleOtherAction = () => {
    history.push('/plugins/strapi-gen/ProjectName', { tokenGitOauth: tokenGitOauth });
  };

  return (
    <div  className="docker-file-generator-container" style={{ marginTop: '40px' }}>
      <div className="docker-file-generator-content">
        <img src={strapigenImage} alt="StrapiGEN" className="strapigen-image" style={{ marginBottom: '-60px' }} />
  
        <h1>First, you need to follow these steps down below to continue the process</h1>
        <p style={{ marginBottom: '40px' }}>click <a href='https://github.com/settings/tokens' target='_blank' rel="noopener noreferrer">here</a> and generate a new classic api token and allow all the field of accessibility and paste it in the text field down below</p>
       
  
        <div className="input-container">
          <div>
            <input
              type="text"
              value={tokenGitOauth}
              onChange={handleInputChange}
              placeholder="Paste your token here .."
              className="project-name-input"
            />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
          
          <div>
            <button className="btn btn-outline-info" onClick={handleOtherAction} style={{ marginTop: '40px', marginBottom: '40px', marginLeft: '10px' }}>
              <i className="fas fa-plus"></i> Confirm Token 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;