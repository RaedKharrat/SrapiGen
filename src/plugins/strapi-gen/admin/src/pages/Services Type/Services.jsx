import React, { useState } from 'react';
import { useHistory,useLocation } from "react-router-dom";
import strapigenImage from './logoStrapiGen.png'; 



const ServiceManagementPage = () => {
  const history = useHistory();
  const location = useLocation();
  const selectedRepo = location.state ? location.state.selectedRepo : null;
  const tokenGitOauth = location.state ? location.state.tokenGitOauth : null; 



  const redirectToOverview = () => {
    history.push({
      pathname: '/plugins/strapi-gen/Overview',
      state: { selectedRepo: selectedRepo, 
      tokenGitOauth: tokenGitOauth }, 
    });
  };
  const handleDockerizeProject = () => {
    history.push({
      pathname: '/plugins/strapi-gen/DockerConfigForm',
      state: { selectedRepo: selectedRepo, 
      tokenGitOauth: tokenGitOauth }, 
    });
  };
  const handlecreatingEntity = () => {
    history.push({
      pathname: '/plugins/content-type-builder/content-types',
      state: { selectedRepo: selectedRepo, 
      tokenGitOauth: tokenGitOauth }, 
    });
  };

  console.log('repo is services  :',selectedRepo)
  console.log('token: ',tokenGitOauth)

  return (
    <div className="home-page">
      <img 
      src={strapigenImage}
            alt="StrapiGEN" 
            className="strapigen-image" 
            style={{ width: '400px', height: 'auto', marginBottom: '-70px', marginTop: '-100px'}} // Adjusted width and height
          /> {/* Image */}
      <div className="title-section">
        <h2>Service created successfully<span role="img" aria-label="Congratulations" style={{ fontSize: "1.5rem", marginLeft: "10px" }}>🎉</span></h2>
        <p>What should we do next?</p>
      </div>
      <div className="flex space-x-10">
        <div className="box"  onClick={handlecreatingEntity}>
          <h3>Create entities for my service</h3>
          <span role="img" aria-label="File Manager">📁</span>
        </div>
        <div className="box" onClick={handleDockerizeProject}>
          <h3>Dockerize your project</h3>
          <span role="img" aria-label="Docker">🐳</span>
        </div>
        <div className="box" onClick={redirectToOverview}>
          <h3>I’m done! View my services</h3>
          <span role="img" aria-label="Rocket">🚀</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagementPage;