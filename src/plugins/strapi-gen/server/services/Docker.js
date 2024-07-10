const axios = require('axios');
const { exec } = require('child_process');
require('dotenv').config();

// Authenticate with Docker Hub and return the token
async function authenticateDockerHub() {
    console.log("Attempting to authenticate with Docker Hub using the following credentials:");
    console.log("Username:", process.env.DOCKERHUB_USERNAME);
    // Do not log the password. It's a security risk.
    try {
        const response = await axios.post('https://hub.docker.com/v2/users/login/', {
            username: process.env.DOCKERHUB_USERNAME,
            password: process.env.DOCKERHUB_PASSWORD
        });

        console.log("Authenticated successfully.");
        return response.data.token;
    } catch (error) {
        console.error('Authentication failed:', error.response ? error.response.data : error);
        throw new Error('Authentication failed: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
}

// Get Docker Hub repositories using the token
async function getRepositories(token) {
    if (!token) {
        console.error("Token is undefined or not provided.");
        throw new Error("Token is undefined or not provided.");
    }

    console.log(`Fetching repositories with token: ${token}`);
    try {
        const response = await axios.get('https://hub.docker.com/v2/repositories/alajaidi07/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log("Repositories fetched successfully.");
        return response.data;
    } catch (error) {
        console.error('Failed to fetch repositories:', error.response || error.request || error.message);
        throw new Error(`Failed to fetch repositories: ${error.message}`);
    }
}

const pullAndRunDockerImage = async (imageName, imageTag, containerPort) => {
    const hostPort = strapi.config.get('server.port') || 1337; // Utilisez le port Strapi ou un port par défaut
  
    return new Promise((resolve, reject) => {
      const pullCommand = `docker pull ${imageName}:${imageTag}`;
      exec(pullCommand, (pullErr, pullStdout, pullStderr) => {
        if (pullErr) {
          return reject(new Error(`Failed to pull image: ${pullErr.message}`));
        }
        console.log(pullStdout);
  
        const runCommand = `docker run -d -p ${hostPort}:${containerPort} ${imageName}:${imageTag}`;
        exec(runCommand, (runErr, runStdout, runStderr) => {
          if (runErr) {
            return reject(new Error(`Failed to run image: ${runErr.message}`));
          }
          resolve(runStdout.trim()); // stdout is Container ID
        });
      });
    });
};
module.exports = {
    authenticateDockerHub,
    getRepositories,
    pullAndRunDockerImage,
};