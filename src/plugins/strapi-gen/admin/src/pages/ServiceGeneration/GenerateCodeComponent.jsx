import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { Octokit } from '@octokit/rest';
import { Link, useHistory, useLocation } from 'react-router-dom';
import './GenerateCodeComponent.css';
import './DockerFileGenerator.css';


const CodeGenerator = () => {
  const [method, setMethod] = useState({
    POST: false,
    GET: false,
    PATCH: false,
    DELETE: false,
    LOGIN: false,
    REGISTER: false,
    FORGETPASSWORD: false,
    OTP: false,
    RESETPASSWORD: false,
  });


  const [modelName, setModelName] = useState('');
  const [responseJson, setResponseJson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null); 
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [workflowRuns, setWorkflowRuns] = useState([]); 
  const history = useHistory();
  const location = useLocation();
  const selectedRepo = location.state ? location.state.selectedRepo : null;
  const tokenGitOauth = location.state ? location.state.tokenGitOauth : null; 

  const handleModelNameChange = (event) => {
    setModelName(event.target.value);
    setSelectedModel(event.target.value);
    
  };

  const toggleMethod = (methodName) => {
    setMethod((prevState) => ({
      ...prevState,
      [methodName]: !prevState[methodName],
    }));
  };

  const generateCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:1337/strapi-gen/generate-backend',
        {
          method: Object.keys(method).filter((key) => method[key]).join(','),
          model: modelName,
          selectedRepo: selectedRepo,
          tokenGitOauth: tokenGitOauth
        }
      );
      setResponseJson(response.data.message);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkflowStatus = async () => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${selectedRepo}/actions/runs`, {
        headers: {
          'Authorization': `Bearer ${tokenGitOauth}`,
        },
      });
      console.log('Workflow status:', response.data);
      
      const latestRun = response.data.workflow_runs[0];
      setWorkflowStatus(latestRun.status);
      fetchWorkflowRuns();
    } catch (error) {
      console.error('Error fetching workflow status:', error);
    }
  };

  const fetchWorkflowRuns = async () => {
    try {
      const response = await axios.get(`https://api.github.com/repos/${selectedRepo}/actions/runs`, {
        headers: {
          'Authorization': `Bearer ${tokenGitOauth}`,
        },
      });
      console.log('Workflow runs:', response.data);
      setWorkflowRuns(response.data.workflow_runs);
    } catch (error) {
      console.error('Error fetching workflow runs:', error);
    }
  };

  useEffect(() => {
    if (selectedRepo) {
      fetchWorkflowRuns();
    }
  }, [selectedRepo]);


  const handleBackToOverview = () => {
    history.push('/plugins/strapi-gen/Overview', { tokenGitOauth: tokenGitOauth , selectedRepo: selectedRepo }); // Navigate to '/plugins/strapi-gen/Overview' route
};

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
      <li className={`menu-item ${location.pathname === '/plugins/strapi-gen/ServiceGenerate' ? 'selected' : ''}`}>
        <Link to={{
          pathname: '/plugins/strapi-gen/ServiceGenerate',
          state: { selectedRepo: selectedRepo, tokenGitOauth: tokenGitOauth }
        }}>Service</Link>
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
      <div className="docker-file-generator-container">
              <div className="docker-file-generator-content">
        <a onClick={handleBackToOverview} className='btn btn-outline-info' style={{ marginBottom: '40px'}}>
                        <i className="fas fa-arrow-left" style={{ marginRight: '5px' }}></i> Back To Overview</a> 
        <div className='row align-items-center'>
          <div className='col-3'>
            <div className='container'>
              <div className='row'>
                <h2 className="docker-file-generator-title" >
                  <strong style={{ fontSize: '1rem', marginBottom: '20px' }}>Select the desired Model</strong></h2>
              </div>
              <div className='row'>
                <div className="container">
                  <ul className="ks-cboxtags">
                    <li>
                      <input type="checkbox" id="checkboxOne" value="BLOGS" style={{ marginBottom: '200px' }}
                        checked={modelName === 'BLOGS'}
                        onChange={handleModelNameChange}
                      />
                      <label htmlFor="checkboxOne">BLOGS</label>

                      {/* <input type="checkbox" id="checkboxTwo" value="USERS"
                      checked={modelName === 'USERS'}
                      onChange={handleModelNameChange}
                    />
                    <label htmlFor="checkboxTwo">USERS</label> */}
                    </li>
                  </ul>
                </div>
                <div className="container">
                  <ul className="ks-cboxtags">
                    <li>
                      <input type="checkbox" id="checkboxTwo" value="USERS"
                        checked={modelName === 'USERS'}
                        onChange={handleModelNameChange}
                      />
                      <label htmlFor="checkboxTwo">USERS</label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='col-9'>
            <div className="docker-file-generator-container">
              <div className="docker-file-generator-content">
                <h2 className="docker-file-generator-title">
                  <strong style={{ fontSize: '3rem', marginBottom: '20px' }}>Generate Code</strong></h2>
                <p className="docker-file-generator-description">Your project will be automatically generated with all the selected rest API Toggle , and thanks </p>
                <div style={{ borderRadius: '20px', padding: '20px' }}>

                  <p style={{ fontWeight: 'bold', color: '#029d89' }}>Generate Blogs Module !</p>
                  <p> ────────────────── </p>
                  {/* BLOGS toggle containers */}
                  <div className={`toggle-container ${selectedModel === 'BLOGS' ? 'selected' : ''}`}>
                    <p style={{ color: 'white', marginRight: '15px' }}>tap to ensure the method Post, Endpoint: "/"</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={method.POST} onChange={() => toggleMethod('POST')} />
                      <span className="toggle-slider"></span>
                    </label>
                    <label style={{ color: 'blue', marginLeft: '10px' }}>/POST</label>
                  </div>


                  <div className={`toggle-container ${selectedModel === 'BLOGS' ? 'selected' : ''}`}>
                    <p style={{ color: 'white', marginRight: '15px' }}>tap to ensure the method GET, Endpoint: "/All"</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={method.GET} onChange={() => toggleMethod('GET')} />
                      <span className="toggle-slider"></span>
                    </label>
                    <label style={{ color: 'blue', marginLeft: '10px' }}>/GET</label>
                  </div>


                  <div className={`toggle-container ${selectedModel === 'BLOGS' ? 'selected' : ''}`}>
                    <p style={{ color: 'white', marginRight: '15px' }}>tap to enssure the methode Patch, Endpoint: "/updateBlog/:id"</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={method.PATCH} onChange={() => toggleMethod('PATCH')} />
                      <span className="toggle-slider"></span>
                    </label>
                    <label style={{ color: 'blue', marginLeft: '10px' }}>/PATCH</label>
                  </div>


                  <div className={`toggle-container ${selectedModel === 'BLOGS' ? 'selected' : ''}`}>
                    <p style={{ color: 'white', marginRight: '15px' }}>tap to enssure the methode Delete, Endpoint: "/delete/:id"</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={method.DELETE} onChange={() => toggleMethod('DELETE')} />
                      <span className="toggle-slider"></span>
                    </label>
                    <label style={{ color: 'blue', marginLeft: '10px' }}>/DELETE</label>
                  </div>

                  <p style={{ fontWeight: 'bold', color: 'green' }}>Generate User Auth Module !</p>
                  <p> ────────────────── </p>
                  {/* USERS toggle containers */}
                  <div className={`toggle-container ${selectedModel === 'USERS' ? 'selected' : ''}`}>
                    <p style={{ color: 'white', marginRight: '15px' }}>tap to ensure the method Login using jwt, Endpoint: "/login"</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={method.LOGIN} onChange={() => toggleMethod('LOGIN')} />
                      <span className="toggle-slider"></span>
                    </label>
                    <label style={{ color: 'white', marginLeft: '10px' }}>/LOGIN</label>
                  </div>
                  <div className={`toggle-container ${selectedModel === 'USERS' ? 'selected' : ''}`}>
                    <p style={{ color: 'white', marginRight: '15px' }}>tap to enssure the methode Register User, Endpoint: "/register"</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={method.REGISTER} onChange={() => toggleMethod('REGISTER')} />
                      <span className="toggle-slider"></span>
                    </label>
                    <label style={{ color: 'white', marginLeft: '10px' }}>/REGISTER</label>
                  </div>
                  <div className={`toggle-container ${selectedModel === 'USERS' ? 'selected' : ''}`}>
                    <p style={{ color: 'white', marginRight: '15px' }}>tap to enssure the methode Forget Password, Endpoint: "/forgetPass"</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={method.FORGETPASSWORD} onChange={() => toggleMethod('FORGETPASSWORD')} />
                      <span className="toggle-slider"></span>
                    </label>
                    <label style={{ color: 'white', marginLeft: '10px' }}>/FORGETPASSWORD</label>
                  </div>

                  <div className={`toggle-container ${selectedModel === 'USERS' ? 'selected' : ''}`}>
                    <p style={{ color: 'white', marginRight: '15px' }}>tap to enssure the methode verify OTP, Endpoint: "/otp"</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={method.OTP} onChange={() => toggleMethod('OTP')} />
                      <span className="toggle-slider"></span>
                    </label>
                    <label style={{ color: 'white', marginLeft: '10px' }}>/OTP</label>
                  </div>

                  <div className={`toggle-container ${selectedModel === 'USERS' ? 'selected' : ''}`}>
                    <p style={{ color: 'white', marginRight: '15px' }}>tap to enssure the methode Reset Password, Endpoint: "/resetPass"</p>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={method.RESETPASSWORD} onChange={() => toggleMethod('RESETPASSWORD')} />
                      <span className="toggle-slider"></span>
                    </label>
                    <label style={{ color: 'white', marginLeft: '10px' }}>/RESETPASSWORD</label>
                  </div>

                  {/* Add other toggle containers similarly */}
                </div>
                <button className="docker-file-generator-button" onClick={generateCode} style={{ marginTop: '30px' }}>
                  {isLoading ? <FaSpinner className="spinner-icon" /> : 'Generate Code'}
                </button>
                
                {/* Popup modal */}
                {responseJson && (
                  <div className="modal">
                    <div className="modal-content">
                      <span className="close" onClick={() => setResponseJson(null)} style={{ color: 'red' }}>&times;</span>
                      <h2 className='success_message' style={{ color: 'blue' }}>{responseJson}</h2>
                      <p style={{ color: 'purple', marginRight: '2rem' }}>Click <a href={`https://github.com/${selectedRepo}`} target='_blank'>GitHub Repository</a> to view the repository.</p>
                      <pre>{JSON.stringify(responseJson, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>

      <div className="row">
      <div className="col">
        <h3>Workflow Runs</h3>
        <ul>
          {workflowRuns.map((run) => (
            <li key={run.id}>
              <p>Run ID: {run.id}</p>
              <p>Status: {run.status}</p>
              <p>Conclusion: {run.conclusion}</p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default CodeGenerator;
