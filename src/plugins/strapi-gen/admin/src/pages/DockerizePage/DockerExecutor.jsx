import React, { useState } from 'react';
import axios from 'axios';
import './dockerexecutor.css';

function DockerExecutor() {
  const [imageName, setImageName] = useState('');
  const [imageTag, setImageTag] = useState('');
  const [containerPort, setContainerPort] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const handleDockerRun = async () => {
    try {
      const response = await axios.post('http://localhost:1337/strapi-gen/docker/deployImage', {
        imageName,
        imageTag,
        containerPort
      });
      setMessage(`Container started with ID: ${response.data}`);
      setOpen(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred');
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="container">
      <h1 className="heading">Run Docker Image</h1>
      <form className="form">
        <input 
          className="input" 
          type="text" 
          placeholder="Docker Image Name" 
          value={imageName} 
          onChange={e => setImageName(e.target.value)} 
        />
        <input 
          className="input" 
          type="text" 
          placeholder="Docker Image Tag" 
          value={imageTag} 
          onChange={e => setImageTag(e.target.value)} 
        />
        <input 
          className="input" 
          type="number" 
          placeholder="Container Port" 
          value={containerPort} 
          onChange={e => setContainerPort(e.target.value)} 
        />
        <button 
          className="button" 
          onClick={handleDockerRun} 
        >
          RUN DOCKER IMAGE
        </button>
      </form>
      {open && (
        <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
          {message}
          <button className="closeButton" onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default DockerExecutor;