
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Switch } from 'antd';
import strapigenImage from './logoStrapiGen.png';


const ProjectNamePage = () => {
  const location = useLocation();
  const history = useHistory();

  const [projectName, setProjectName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (location.state && location.state.tokenGitOauth) {
      setToken(location.state.tokenGitOauth);
    }
  }, [location.state]);

  console.log('il token Mr:',token)
  const handleInputChange = (event) => {
    setProjectName(event.target.value);
    setErrorMessage('');
  };

  const handleToggleChange = (checked) => {
    setVisibility(checked);
  };

  const handleConfirm = async () => {
    if (projectName.trim() === '') {
      setErrorMessage('Please enter a project name');
      return;
    }

    
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: projectName, private: visibility }), 
      });
      const data = await response.json();
      if (response.status === 201) {
        history.push({
          pathname: '/plugins/strapi-gen/selectedrepository',
          state: { selectedRepo: data.full_name, tokenGitOauth: token },
        });
      } else if (response.status === 422) {
        alert('This repository name is already in use in your GitHub account! Please try another one.');
      } else {
        console.error('Failed to create repository:', data.message);
      }
    } catch (error) {
      console.error('Error creating repository:', error);
    }
  };
  console.log('il token Mr:',token)

  const handleOtherAction = () => {
    history.push('/plugins/strapi-gen/selectedrepository', { tokenGitOauth: token });
  };

  return (
    <div className="docker-file-generator-container" style={{ marginTop: '40px' }}>
      <div className="docker-file-generator-content">
        <img src={strapigenImage}  alt="StrapiGEN" className="strapigen-image" style={{ marginBottom: '-60px' }} />
  
        <h1>First, we need to choose a name for your project</h1>
        <p style={{ marginBottom: '40px' }}>Give your project a meaningful name. The name of the project you type is a generated empty GitHub repository</p>
       
  
        <div className="input-container">
          <div>
            <input
              type="text"

              value={projectName}
              onChange={handleInputChange}
              placeholder="Write your project name here.."
              className="project-name-input"
            />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
          <div className="toggle-container"  style={{ marginLeft: '270px' }}>
            <Switch checked={visibility} onChange={handleToggleChange} />
            <span className="toggle-label"> Set this repository to Private</span>
          </div>
          <div>
            <button className="docker-file-generator-button" onClick={handleConfirm} style={{ marginTop: '40px', marginBottom: '40px' , marginRight:'20px'}}>
              <i className="fas fa-plus"></i> Create Repo
            </button>
            <button className="btn btn-outline-info" onClick={handleOtherAction} style={{ marginTop: '40px', marginBottom: '40px', marginLeft: '10px' }}>
              <i className="fas fa-folder"></i> Select Existing Repo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNamePage;
