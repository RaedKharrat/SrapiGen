import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Login.css'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:1337/strapi-gen/docker/login', { username, password });
      localStorage.setItem('token', response.data.token);  
      history.push('/plugins/strapi-gen/DockerRepo');
    } catch (error) {
      alert('Login failed!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-logo">
          {/* Logo here, can use an img tag or svg */}
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in with your Docker Account</p>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        <button onClick={handleLogin}>Sign In</button>
        <div className="login-links">
        </div>
      </div>
    </div>
  );
}

export default Login;