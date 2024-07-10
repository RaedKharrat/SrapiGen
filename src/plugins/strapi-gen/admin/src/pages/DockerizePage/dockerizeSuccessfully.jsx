import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // Importing the check-circle icon from react-icons/fa
import { useHistory } from 'react-router-dom';
import './DockerFileGenerator.css'; // Import CSS for styling

const DockerizationSuccessPage = () => {
  const history = useHistory();

  const handleGoBack = () => {
    history.push('/plugins/strapi-gen/Overview'); // Navigate to the specified route
  };

  return (
    <div className="docker-file-generator-container">
      <div className="docker-file-generator-content">
        <div className="icon-container" style={{ color: 'green', fontSize: '3rem' }}> {/* Added styles to the icon container */}
          <FaCheckCircle className="success-icon" />
        </div>
        <h2 className="docker-file-generator-title" style={{ fontSize: '2rem' , marginBottom: '30px'}}><strong>Dockerization Successful! 🐳</strong></h2> {/* Added custom style to increase font size */}
        <p className="docker-file-generator-description">Your project has been successfully Dockerized and has been pushed to your GitHub Repository</p>
        <button className="docker-file-generator-button" onClick={handleGoBack}>Go Back</button>
      </div>
    </div>
  );
};

export default DockerizationSuccessPage;