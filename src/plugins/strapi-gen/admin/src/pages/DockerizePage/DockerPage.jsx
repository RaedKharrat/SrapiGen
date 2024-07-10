import React, { useState, useEffect } from 'react';
import './DockerFileGenerator.css';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';

const DockerFileGenerator = () => {
  const location = useLocation();
  const history = useHistory();

  const selectedRepo = location.state ? location.state.selectedRepo : null;
  const tokenGitOauth = location.state ? location.state.tokenGitOauth : null; 

  const [port, setPort] = useState('');
  const [imageName, setImageName] = useState('');
  const [nodeVersion, setNodeVersion] = useState('');
  const [databaseClient, setDatabaseClient] = useState('');
  const [databaseHost, setDatabaseHost] = useState('');
  const [databasePort, setDatabasePort] = useState('');
  const [dockerfileContent, setDockerfileContent] = useState('');
  const [packageManager, setPackageManager] = useState('');
  const [appKeys, setAppKeys] = useState('');
  const [nodeEnv, setNodeEnv] = useState('');

  useEffect(() => {
    if (!selectedRepo) {
      console.error('Selected repository not found');
    }
  }, [selectedRepo]);

  const generateDockerFile = async () => {
    try {
      if (port === '' || isNaN(port) || parseInt(port) < 0 || parseInt(port) > 9999) {
        throw new Error('Port number must be a valid number between 0 and 9999.');
      }

      if (packageManager !== 'npm' && packageManager !== 'yarn') {
        throw new Error('Package manager must be either "npm" or "yarn".');
      }

      const response = await axios.post('http://localhost:1337/strapi-gen/generate-docker-files', {
        port,
        imageName,
        databaseClient,
        databaseHost,
        databasePort,
        packageManager,
        appKeys,
        nodeEnv,
        selectedRepo,
        tokenGitOauth
      });

      if (response.data) {
        const data = response.data;
        setDockerfileContent(data.message);
        
        history.push('/plugins/strapi-gen/dockersuccess');
      } else {
        throw new Error('Error while generating Dockerfile');
      }
    } catch (error) {
      console.error(error);
      alert('Your project is already dockerized, ' + error.message);
    }
  };

  

  return (
    <div className="docker-file-generator-container" style={{marginTop: '40px'}}>
      <div className="docker-file-generator-content">
        <h2 className="docker-file-generator-title" style={{ fontSize: '3rem' , marginBottom: '20px'}}><strong>Dockerize Your Project 🐳</strong></h2>
        <p className="docker-file-generator-description">Add modifications to your Dockerfile and Docker Compose.</p>
        <p className="docker-file-generator-description">When you finish Dockerize your project , you'll automaticaly generate Dockerfile / docker-compose.yml in your Selected Repository: </p>
        <p style={{color:'#027368'}}> <strong> {selectedRepo}</strong></p>

        <div className="docker-file-generator-inputs" style={{ marginTop: '30px', marginBottom: '30px' }}>
          
          <div className="docker-file-generator-input">
            <label htmlFor="port" className="docker-file-generator-label" style={{color:'#029d89'}}><strong>Port:</strong></label>
            <input
              type="number"
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Enter port number"
              className="docker-file-generator-input-field"
              min="0"
              max="9999"
            />
          </div>
          {/* Image Name */}
          <div className="docker-file-generator-input">
            <label htmlFor="imageName" className="docker-file-generator-label" style={{color:'#029d89'}}><strong>Image Name:</strong></label>
            <input
              type="text"
              id="imageName"
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="Enter image name"
              className="docker-file-generator-input-field"
            />
          </div>
       
          {/* Database Client */}
          <div className="docker-file-generator-input">
            <label htmlFor="databaseClient" className="docker-file-generator-label" style={{color:'#029d89'}}><strong>Database Client:</strong></label>
            <input
              type="text"
              id="databaseClient"
              value={databaseClient}
              onChange={(e) => setDatabaseClient(e.target.value)}
              placeholder="Enter database client"
              className="docker-file-generator-input-field"
            />
          </div>
          {/* Database Host */}
          <div className="docker-file-generator-input">
            <label htmlFor="databaseHost" className="docker-file-generator-label" style={{color:'#029d89'}}><strong>Database Host:</strong></label>
            <input
              type="text"
              id="databaseHost"
              value={databaseHost}
              onChange={(e) => setDatabaseHost(e.target.value)}
              placeholder="Enter database host"
              className="docker-file-generator-input-field"
            />
          </div>
          {/* Database Port */}
          <div className="docker-file-generator-input">
            <label htmlFor="databasePort" className="docker-file-generator-label" style={{color:'#029d89'}}><strong>Database Port:</strong></label>
            <input
              type="text"
              id="databasePort"
              value={databasePort}
              onChange={(e) => setDatabasePort(e.target.value)}
              placeholder="Enter database port"
              className="docker-file-generator-input-field"
            />
          </div>
          {/* Package Manager */}
          <div className="docker-file-generator-input">
            <label htmlFor="packageManager" className="docker-file-generator-label" style={{color:'#029d89'}}><strong>Package Manager:</strong></label>
            <select
              id="packageManager"
              value={packageManager}
              onChange={(e) => setPackageManager(e.target.value)}
              className="docker-file-generator-input-field"
            >
              <option value="">Select Package Manager</option>
              <option value="npm">npm</option>
              <option value="yarn">yarn</option>
            </select>
          </div>
          {/* App Keys */}
          <div className="docker-file-generator-input">
            <label htmlFor="appKeys" className="docker-file-generator-label" style={{color:'#029d89'}}><strong>App Keys:</strong></label>
            <input
              type="text"
              id="appKeys"
              value={appKeys}
              onChange={(e) => setAppKeys(e.target.value)}
              placeholder="Enter app keys"
              className="docker-file-generator-input-field"
            />
          </div>
          {/* Node Environment */}
          <div className="docker-file-generator-input">
            <label htmlFor="nodeEnv" className="docker-file-generator-label"style={{color:'#029d89'}}><strong>Node Environment:</strong></label>
            <input
              type="text"
              id="nodeEnv"
              value={nodeEnv}
              onChange={(e) => setNodeEnv(e.target.value)}
              placeholder="Enter node environment"
              className="docker-file-generator-input-field"
            />
          </div>
        </div>
        <button onClick={generateDockerFile} className="docker-file-generator-button">Dockerize !</button>
      </div>
      {dockerfileContent && (
        <div className="docker-file-generator-output">
          <h3>Generated Dockerfile:</h3>
          <pre>{dockerfileContent}</pre>
        </div>
      )}
    </div>
  );
};

export default DockerFileGenerator;