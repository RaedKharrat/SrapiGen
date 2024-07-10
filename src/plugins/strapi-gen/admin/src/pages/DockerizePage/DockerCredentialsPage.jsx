import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { message } from 'antd';

const WorkflowTrigger = () => {
  const [token, setToken] = useState('');
  const [dockerUsername, setDockerUsername] = useState('');
  const [dockerPassword, setDockerPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const triggerWorkflow = async () => {
    try {
      const response = await fetch('http://localhost:1337/strapi-gen/trigger-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger workflow');
      }

      setDockerUsername(data.dockerUsername);
      setDockerPassword(data.dockerPassword);
      message.success(data.message);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error triggering workflow:', error);
      message.error('Error triggering workflow: ' + error.message);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    history.push('/plugins/strapi-gen/DockerExecutor/');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>Trigger GitHub Workflow</h1>
      <input
        type="text"
        value={token}
        onChange={handleTokenChange}
        placeholder="Enter GitHub Token"
        className="input-style"
      />
      <button className="button-primary" onClick={triggerWorkflow}>Trigger Workflow</button>
      <div className="modal" style={{ display: isModalVisible ? 'block' : 'none' }}>
        <div className="modal-content">
          <span className="close" onClick={handleCancel}>&times;</span>
          <p>Workflow was successfully triggered.</p>
          <p>Docker Username: {dockerUsername}</p>
          <p>Docker Password: {dockerPassword}</p>
          <p>Do you want to proceed to Docker execution?</p>
          <button className="button-ok" onClick={handleOk}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTrigger;