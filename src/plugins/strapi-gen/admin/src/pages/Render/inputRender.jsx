import React, { useState } from 'react';
import './inputRenderr.css'; // Import your CSS file for styling
//import strapigenImage from './logoStrapiGen.png'; // Import the image
import { useHistory } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';


const MyForm = () => {
  const [textField2, setTextField2] = useState('');
  const history = useHistory();


  const handleTextField2Change = (event) => {
    setTextField2(event.target.value);
  };

  

  const handleOtherAction = () => {
    history.push('/plugins/strapi-gen/renderOauth');
  };

  return (
    <div className="docker-file-generator-container">
      <div className="docker-file-generator-content">
      <img 
            //src={strapigenImage} 
            alt="StrapiGEN" 
            className="strapigen-image" 
            style={{ width: '350px', height: 'auto', marginBottom: '-80px'}} // Adjusted width and height
          /> {/* Image */}
        
        <h2 className="docker-file-generator-title">Render</h2>
        <p>write your domaine name that you wanna initialise to your web service project</p>
        <div className="docker-file-generator-inputs">
          
          <div className="docker-file-generator-input">
            <label htmlFor="textField2" className="input-container">Domaine Name</label>
            <input
              type="text"
              id="Domaine name"
              value={textField2}
              onChange={handleTextField2Change}
              placeholder="Enter Your domaine Name exp: 'DomaineNameExemple'"
              className="docker-file-generator-input-field"
            />
          </div>
          <div>
           
          <button className="btn btn-outline-info" onClick={handleOtherAction} style={{ marginTop: '40px', marginBottom: '40px', marginLeft: '10px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            Next
          </button>

          </div> 
        </div>
      </div>
    </div>
  );
};

export default MyForm;