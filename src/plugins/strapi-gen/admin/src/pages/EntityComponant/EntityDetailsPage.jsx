import React, { useState, useEffect } from 'react';
import { Link,useParams,useLocation } from 'react-router-dom';
import { faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { FaDatabase } from 'react-icons/fa';
import './EntityDetailsPage.css'; 

const EntityDetailsPage = () => {
  const { uid } = useParams(); // Récupère l'uid depuis l'URL
  const [contentType, setContentType] = useState(null);
  const location = useLocation();
  const selectedRepo = location.state ? location.state.selectedRepo : null;
  const tokenGitOauth = location.state ? location.state.tokenGitOauth : null; // Access tokenGitOauth from location state

  

  const fetchContentTypeDetails = async () => {
    try {
      const response = await axios.get(`/api/content-type-builder/content-types/${uid}`);

      if (response.data && response.data.data) {
        setContentType(response.data.data);
      } else {
        console.error('Erreur: Le format de la réponse est inattendu:', response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du type de contenu:', error);
    }
  };

  useEffect(() => {
    fetchContentTypeDetails();
  }, [uid]);

  if (!contentType) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
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
      <main>
        <div className="content">
          <h2 style={{ color: 'white' }}>Entities</h2>
          <ul className="entities">
             (
              <li key={contentType.uid} className="entity-item">
                <div className="entity-details">
                  <FaDatabase className="entity-icon" style={{ color: 'white' }} />
                  <div className="entity-info" style={{ color: 'white' }}>
                    <div className="entity-name">{contentType.schema.displayName}</div>
                    <div className="entity-property">Kind: {contentType.schema.kind}</div>
                    <div className="entity-property">Plural Name: {contentType.schema.pluralName}</div>
                    <div className="entity-property">Description: {contentType.schema.description}</div>
                    <div className="entity-property">Attributes:</div>
                    <ul className="entity-attributes">
                      {Object.entries(contentType.schema.attributes).map(([name, attribute]) => (
                        <li key={name} style={{ color: 'white' }}>
                          <strong>{name}</strong>: {attribute.type}
                        </li>
                      ))}
                    </ul>
                    {/* Autres propriétés à afficher */}
                  </div>
                </div>
                {/* <button className="delete-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button> */}
              </li>
            )
          </ul>
        </div>
      </main>
    </div>
  );
};

export default EntityDetailsPage;