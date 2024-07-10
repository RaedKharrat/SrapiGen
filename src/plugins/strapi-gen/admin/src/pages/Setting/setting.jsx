import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import './setting.css';
import RepositoryContents from './RepositoryContents';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

const ProjectSettings = () => {
    const location = useLocation();
    const selectedRepoFromLocation = location.state ? location.state.selectedRepo : null;
    const [selectedRepo, setSelectedRepo] = useState(selectedRepoFromLocation);
    const [repos, setRepos] = useState([]);
    const [projectName, setProjectName] = useState(selectedRepo);
    const [description, setDescription] = useState(''); 
    const [readme, setReadme] = useState(''); 
    const history = useHistory();
    const token = location.state ? location.state.tokenGitOauth : '';

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const response = await axios.get('https://api.github.com/user/repos', {
                    headers: {
                        Authorization: `token ${token}`, 
                    },
                });
                setRepos(response.data);
            } catch (error) {
                console.error('Error fetching repositories:', error);
            }
        };

        fetchRepos();
    }, [token]); 

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    const handleRepoSelect = (e) => {
        const selectedFullName = e.target.value;
        setSelectedRepo(selectedFullName);
    };

    const handleLogout = () => {
        history.push('/auth/login');
    };

    const handleDeleteProject = async () => {
        try {
            if (selectedRepo) {
                const confirmed = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    
                if (confirmed) {
                    await axios.delete(`https://api.github.com/repos/${selectedRepo}`, {
                        headers: {
                            Authorization: `token ${token}`,
                        },
                    });
    
                    console.log('Repository deleted successfully.');
                    alert('Your Repository was successfully deleted');
    
                
                }
            }
        } catch (error) {
            console.error('Error deleting repository:', error);
        }
    };

    const handleSaveSettings = async () => {
        try {
            if (selectedRepo && projectName !== '') {
                setSelectedRepo(projectName);
                
                await axios.patch(`https://api.github.com/repos/${selectedRepo}`, {
                    name: projectName
                }, {
                    headers: {
                        Authorization: `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                console.log('Repository name updated successfully.');
                alert('Your Repository name was successfully changed!');

            }
        } catch (error) {
            console.error('Error updating repository name:', error);
        }
    };

    const handleRefresh = async () => {
        try {
            const response = await axios.get('https://api.github.com/user/repos', {
                headers: {
                    Authorization: `token ${token}`,
                },
            });
            setRepos(response.data);
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    };

    const handleSaveSettings2 = async () => {
        try {
            if (selectedRepo && description !== '') {
                
                await axios.patch(`https://api.github.com/repos/${selectedRepo}`, {
                    description: description 
                }, {
                    headers: {
                        Authorization: `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
    
                console.log('Repository description updated successfully.');
                alert('Your Repository description was successfully Set !');

            }
        } catch (error) {
            console.error('Error updating repository description:', error);
        }
    };
    const handleReadMeGenerator = async () => {
        try {
            // Check if selectedRepo is not empty and readme is not empty
            if (selectedRepo && readme !== '') {
                // Make a PUT request to GitHub API to create or update a file
                await axios.put(`https://api.github.com/repos/${selectedRepo}/contents/README.md`, {
                    message: 'Add README file By StrapiGen', // Commit message
                    content: btoa(unescape(encodeURIComponent(readme))), // Encode content to base64
                    branch: 'main' // Specify the branch
                }, {
                    headers: {
                        Authorization: `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('README file created successfully.');
                alert('Your README.md file was successfully generated');

            }
        } catch (error) {
            console.error('Error creating README file:', error);
        }
    };

    const handleBackToOverview = () => {
        history.push('/plugins/strapi-gen/Overview', { tokenGitOauth: token , selectedRepo: selectedRepo });
    };

    return (
        <div className="settings-container" style={{ display: 'flex', alignItems: 'center' }}>
            {/* Existing container */}
            <div className="docker-file-generator-container" style={{ marginTop: '40px', width: '80%' }}>
                <div className="docker-file-generator-content">
                    <a onClick={handleBackToOverview} className='btn btn-outline-info' style={{ marginBottom: '40px'}}>
                        <i className="fas fa-arrow-left" style={{ marginRight: '5px' }}></i> Back To Overview</a>  
                    <h1>⚙️ Settings ⚙️</h1>
                    <p>Actual GitHub Repo: <a style={{ color: '#029d89' }}> {selectedRepo} </a></p>
                    <div className="setting-dropdown" style={{ display: 'flex', alignItems: 'center', marginBottom: '50px' }}>
                        <label htmlFor="repositories">Current Repo</label>
                        <select
                            id="repositories"
                            onChange={handleRepoSelect}
                            value={selectedRepo}
                            className="dark-dropdown"
                        >
                            <option value="">Select a Repository from your Git</option>
                            {repos.map((repo) => (
                                <option key={repo.id} value={repo.full_name}>
                                    {repo.full_name} - <span style={{ color: repo.private ? 'red' : 'green' }}>{repo.private ? 'Private' : 'Public'}</span>
                                </option>
                            ))}
                        </select>
                        <button className="btn btn-outline-info" style={{ marginLeft: '10px' }} onClick={handleRefresh}>
                            Refresh
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="projectName">Name:</label>
                        <input
                            type="text"
                            id="projectName"
                            className="dark-textfield"
                            style={{ margin: '10px' }}
                            placeholder="Change your Project name.."
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)} 
                        />
                        <button className="btn btn-info" style={{ margin: '15px' }} onClick={handleSaveSettings}>
                            PATCH
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            className="dark-textfield"
                            placeholder="Enter description for your Project.."
                            style={{ margin: '10px' }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button className="btn btn-info" style={{ margin: '15px' }} onClick={handleSaveSettings2}>
                            PATCH
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="readme">Read Me File:</label>
                        <textarea
                            id="readme"
                            className="dark-textfield code-textarea"
                            placeholder="Enter your ReadMe.md file code ..."
                            style={{ margin: '10px' }}
                            value={readme}
                            onChange={(e) => setReadme(e.target.value)}
                        />
                        <button className="btn btn-info" style={{ margin: '15px' }} onClick={handleReadMeGenerator}>
                            Add ReadME!
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label htmlFor="description">Once you Logout from your Strapi Account your should restart Your workflow</label>
                        <button className="btn btn-danger" style={{ margin: '15px' }} onClick={handleLogout}>
                            Logout <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                    <div style={{ position: 'relative', marginBottom: '10px', borderRadius: '12px', marginTop: '40px' }}>
                        <div style={{ position: 'relative', zIndex: 1, border: '1px solid red', padding: '10px', borderRadius: '10px', height: '85px' }}>
                            <p>
                                Once you delete a project, there is no going back. Please be certain.
                                <button onClick={handleDeleteProject} className="btn btn-outline-danger" style={{ margin: '15px' }}>
                                    Delete <i className="fas fa-trash"></i>
                                </button>
                            </p>
                        </div>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(255,0,0,0.2) 0%, rgba(255,0,0,0) 100%)', borderRadius: '12px', zIndex: 0 }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectSettings;
