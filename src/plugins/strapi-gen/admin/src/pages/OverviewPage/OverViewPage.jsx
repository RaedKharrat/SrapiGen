import React, { useState } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import './OverViewPage.css';
import { FaDocker } from "react-icons/fa";
import { FaReply } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { FaDatabase, } from "react-icons/fa";

const OverViewPage = () => {
  const location = useLocation();
  const history = useHistory();

  const selectedRepo = location.state ? location.state.selectedRepo : null;
  const tokenGitOauth = location.state ? location.state.tokenGitOauth : null; 

  
  const handleEntityList = () => {
    history.push('/plugins/strapi-gen/Entities', { tokenGitOauth: tokenGitOauth , selectedRepo: selectedRepo });
  };

 const handleGenerateService = () => {
  history.push('/plugins/strapi-gen/ServiceGenerate', { tokenGitOauth: tokenGitOauth , selectedRepo: selectedRepo });
};

const handleDockerizeProject = () => {
  history.push('/plugins/strapi-gen/DockerConfigForm', { tokenGitOauth: tokenGitOauth , selectedRepo: selectedRepo });
};


  console.log('repo is overview :',selectedRepo)
  console.log('gittoken :',tokenGitOauth)


  return (
    <div> 
       <header className="header" style={{ backgroundColor: '#212134' , borderRadius: '20px', margin:'20px',padding:'10px'}}>
  <div className="logo-container">
    <h3 className="header-title" style={{ color: '#029d89' }}>
      <strong>StrapiGen Plugin </strong>
      <span className="weak">Dashboard</span>
    </h3>
  </div>
  <nav className="nav">
    <ul className="menu">
      <li className={`menu-item ${location.pathname === '/overview' ? 'selected' : ''}`}>
        <Link to={{
          pathname: '/plugins/strapi-gen/Overview',
          state: { selectedRepo: selectedRepo, tokenGitOauth: tokenGitOauth }
        }}>Overview</Link>
      </li>
      
      <li className={`menu-item ${location.pathname === '/entities' ? 'selected' : ''}`}>
        <Link to={{
          pathname: '/plugins/strapi-gen/Entities',
          state: { selectedRepo: selectedRepo, tokenGitOauth: tokenGitOauth }
        }}>Entities</Link>
      </li>
      <li className={`menu-item ${location.pathname === '/plugins/strapi-gen/ServiceGenerate' ? 'selected' : ''}`}>
        <Link to={{
          pathname: '/plugins/strapi-gen/ServiceGenerate',
          state: { selectedRepo: selectedRepo, tokenGitOauth: tokenGitOauth }
        }}>Service</Link>
      </li>
      
      <li className={`menu-item ${location.pathname === '/plugins/strapi-gen/DockerConfigForm' ? 'selected' : ''}`}>
        <Link to={{
          pathname: '/plugins/strapi-gen/DockerConfigForm',
          state: { selectedRepo: selectedRepo, tokenGitOauth: tokenGitOauth } 
        }}>Dockerize</Link>
      </li>

      <li className={`menu-item ${location.pathname === '/plugins/strapi-gen/settings' ? 'selected' : ''}`}>
        <Link to={{
          pathname: '/plugins/strapi-gen/settings',
          state: { selectedRepo: selectedRepo, tokenGitOauth: tokenGitOauth } 
        }}>Settings</Link>
      </li>
     
      <li className={`menu-item ${location.pathname === '/plugins/strapi-gen/faq_section' ? 'selected' : ''}`}>
        <Link to={{
          pathname: '/plugins/strapi-gen/faq_section',
          state: { selectedRepo: selectedRepo, tokenGitOauth: tokenGitOauth }
        }}>FAQ</Link>
      </li>
    </ul>
  </nav>
</header>

      <div className="box-container">
        <div className="github-box" style={{ padding: '30px', borderRadius: '20px', border: '2px solid rgba(255, 255, 255, 0.7)' }}>
          <div className="box-header" style={{ paddingBottom: '30px', paddingTop: '30px' }}>
            <FaDatabase className="github-icon" style={{ color: '#029d89', marginBottom: '30px', marginTop: '30px', marginLeft: '120px' }} />
            <h2 style={{ color: '#fff' }}>Entities | Data Models</h2>
            <p style={{ color: '#fff' }}>Declare the data models for your application</p>
          </div>
          <button className="connect-button" onClick = {handleEntityList} style={{ color: '#fff' }}>Build</button>
        </div>
        <div className="github-box" style={{  padding: '30px', borderRadius: '20px', border: '2px solid rgba(255, 255, 255, 0.7)' }}>
          <div className="box-header" style={{ paddingBottom: '30px', paddingTop: '30px' }}>
            <FiBox className="github-icon" style={{ color: '#029d89', marginBottom: '30px', marginTop: '30px', marginLeft: '120px' }} />
            <h2 style={{ color: '#fff' }}>Services</h2>
            <p style={{ color: '#fff' }}>Build your Web Services for your application</p>
          </div>
          <button className="connect-button" onClick = {handleGenerateService} style={{ color: '#fff' }}>Build</button>
        </div>
       
        <div className="github-box" style={{  padding: '30px', borderRadius: '20px', border: '2px solid rgba(255, 255, 255, 0.7)' }}>
          <div className="box-header" style={{ paddingBottom: '30px', paddingTop: '30px' }}>
            <FaDocker className="github-icon" style={{ color: '#029d89', marginBottom: '30px', marginTop: '30px', marginLeft: '120px' }} />
            <h2 style={{ color: '#fff' }}>Dockerize</h2>
            <p style={{ color: '#fff' }}>Generate your Docker file and Docker-composer.</p>
          </div>
          <Link to="/plugins/strapi-gen/DockerHubLoginForm">
          <button className="connect-button" style={{ color: '#fff' }} onClick = {handleDockerizeProject}>Generate</button>
          </Link>
          </div>
      
      </div>
    </div>
  );
};

export default OverViewPage;