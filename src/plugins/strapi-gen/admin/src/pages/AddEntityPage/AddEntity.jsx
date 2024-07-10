import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import './AddEntity.css';


const AddEntity = () => {
  const history = useHistory();
  const location = useLocation();
  const selectedRepo = location.state ? location.state.selectedRepo : null;
  const tokenGitOauth = location.state ? location.state.tokenGitOauth : null; // Access tokenGitOauth from location state


  // Fonction de redirection vers AddAuthPage
  const redirectToAddAuth = () => {
    history.push({
      pathname: '/plugins/strapi-gen/AddAuth',
      state: { selectedRepo: selectedRepo, 
      tokenGitOauth: tokenGitOauth }, // Include token in state
    });
  };
  console.log(' hedha houwa ',tokenGitOauth)

  return (
    <div className="home-page">
      <img 
            alt="StrapiGEN" 
            className="strapigen-image" 
            style={{ width: '400px', height: 'auto', marginBottom: '-70px', marginTop: '-100px'}} // Adjusted width and height
          /> {/* Image */}
        
      <div className="title-section">
        <h2>⚡️ Add entities to your data model ⚡️</h2>
        <p>
          Start from an empty schema or use one of our templates to jump-start your Database 
        </p>
        <p>with a pre-defined set of entities and fields based on popular use cases</p>
      </div>
      <div className="flex space-x-10">
        {/* Add icons on top of the boxes */}
        <div className="box" onClick={redirectToAddAuth}>
          <h3 style={{color:'#029d89', marginBottom:'30px'}}>Empty</h3>
          <p>(Start from Scratch)</p>
          <p color="grey">Manually define your own entities and fields</p>
        </div>
        <div className="box" onClick={redirectToAddAuth}>
          <h3 style={{color:'#029d89' , marginBottom:'30px'}}>Use a Template</h3>
          <p>(Order Management)</p>
          <p color="grey">Pre-defined set of entities and fields Address, Orders, User</p>
        </div>
      </div>
    </div>
  );
};

export default AddEntity;