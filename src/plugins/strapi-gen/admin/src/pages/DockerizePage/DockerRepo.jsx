import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './RepositoryList.css'; // Make sure to create this CSS file for styling

function Repositories() {
  const [repositories, setRepositories] = useState([]);
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  useEffect(() => {
    const fetchRepositories = async () => {
      if (!token) {
        console.error('Token is undefined, cannot fetch repositories');
        alert('You must be logged in to see repositories');
        return;
      }

      try {
        const response = await axios.get('http://localhost:1337/strapi-gen/docker/repositories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRepositories(response.data.results || []); // Adjust this based on your API response structure
      } catch (error) {
        console.error('Failed to fetch repositories:', error);
        alert(`Failed to fetch repositories: ${error.message || "Unknown error"}`);
      }
    };

    fetchRepositories();
  }, [token]);

  // Here you would replace `DOCKER_HUB_ACCOUNT` with the actual account variable if available
  const accountName = "alajaidi07"; // Replace with your logic to retrieve account name

  return (
    <div className="repository-list">
      <header>
        <img src="/path-to-docker-logo.svg" alt="Docker" />
        <h1>{accountName}</h1>
      </header>
      {repositories.map(repo => (
        <Link to={`/plugins/strapi-gen/WorkflowTrigger/${repo.name}`} key={repo.name}>
          <div className="repository-item">
            <h2>{repo.name}</h2>
            <p>{repo.description || "No description provided."}</p>
            <p>{repo.is_private ? "Private" : "Public"}</p>
            <p>Stars: {repo.star_count}</p>
            <p>Last updated: {new Date(repo.last_updated).toLocaleString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
export default Repositories;