import React from 'react';
import { useHistory } from 'react-router-dom';
import './HomePage.css';
import strapigenImage from './logoStrapiGen.png'; 

import './DockerFileGenerator.css'; 


const HomePage = () => {
  const history = useHistory();

  const handleStartClick = () => {
    history.push('/plugins/strapi-gen/GitConnect');
  };

  return (
    <div className="docker-file-generator-container" style={{marginTop:'40px'}}>
      <div className="docker-file-generator-content">
          <img 
            src={strapigenImage} 
            alt="StrapiGEN" 
            className="strapigen-image" 
            style={{ width: '350px', height: 'auto', marginBottom: '-80px'}} 
          /> {/* Image */}
        
        <h1>
          Welcome to <span>Strapi-Gen 🚀</span>
        </h1>
        <p style={{ marginBottom: '30px'}}>Let's help you generate new web Services, Dockerize your backend project and keep it updated with your git !   </p>
        <button
          className="docker-file-generator-button" 
          onClick={handleStartClick}
          style={{ marginTop: '30px' , marginBottom: '100px'}}
        >
          Let's Start
        </button>
      </div>
    </div>
  );
};

export default HomePage;
