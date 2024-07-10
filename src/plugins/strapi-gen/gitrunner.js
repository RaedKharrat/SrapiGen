// GitRunner.js

const http = require('http');
const { Octokit } = require('@octokit/rest');
const { execSync } = require('child_process');
const fs = require('fs');


const server = http.createServer((req, res) => {
  const { url, method } = req;
  if (url === '/webhook' && method === 'POST') {
    handleWebhook(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

function handleWebhook(req, res) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        console.log('Received payload:', payload); // Log the payload
        // Check if the payload indicates a code push event
        if (payload && payload.ref) {
          handleCodePush(payload);
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Received');
        } else {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid payload');
        }
      } catch (error) {
        console.error('Error parsing payload:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
      }
    });
  }
  
  

  async function handleCodePush(payload) {
    try {
      if (payload && payload.selectedRepo) {
        // Trigger workflow generation and pushing workflow files
        await generateAndPushWorkflows(payload.selectedRepo, payload.tokenGitOauth);
      } else {
        throw new Error('Invalid payload structure: selectedRepo is missing');
      }
    } catch (error) {
      console.error('Error handling code push:', error);
      throw error; // Re-throw the error for the caller to handle
    }
  }

  
  async function generateAndPushWorkflows(repoFullName, tokenGitOauth) {
    try {
      console.log('npm init -y and npm install executed successfully');
      // Create the package.json content
      const packageJsonContent = `
      {
        "name": "readyproductbackend",
        "version": "1.0.0",
        "main": "Server.js",
        "scripts": {
          "start": "node server.js",
          "dev": "node server.js"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "dependencies": {
          "cookie-parser": "^1.4.6",
          "cors": "^2.8.5",
          "express": "^4.19.2",
          "http-errors": "^2.0.0",
          "jade": "^1.11.0",
          "mongoose": "^8.3.3",
          "morgan": "^1.10.0",
          "bcrypt": "^5.1.1",
          "bcryptjs": "^2.4.3",
          "jsonwebtoken": "^9.0.2",
          "otp-generator": "^4.0.1",
          "twilio": "^4.19.3",
          "nodemailer": "^6.9.7",
           "nodemailer-smtp-transport": "^2.7.4"


        },
        "description": ""
      }
      
      
      `;
      const ReadmeFile = 
      `
      # Guide Line Web Services Test 
  
  ### FIRST 📥 :
 Clone the project then Open it in your IDE 
  ### SECOND 🔗 :  
  open terminal and run ' 
  
  npm install 
### THIRD🔗 :  
pass command line and run  

   node Server.js 
### FOURTH🔗 :  
  open Postman then test your EndPoints for BLOGS and User 

#Postman test Scripts and EndPoints : 

   ### USERS

  📍REGISTER :

  METHOD : POST
      
      http://localhost:9090/register
  Script

      {
          "username": "exemple",
          "email": "exemple@gmail.com",
          "numTel": "12345678",
          "password": "password123"
      }

   

   📍LOGIN :

  METHOD : POST
      
      http://localhost:9090/login

  Script

      {
        "numTel": "12345678",
        "password": "password123"
      }

     

   📍FORGERT PASSWORD :

  METHOD : POST
      
      http://localhost:9090/forgetPassword
  Script

      {
        "numTel": "12345678",
      }

      
  📍Verify OTP :

  METHOD : POST
      
      http://localhost:9090/verifyOTP
  Script

      {
        "numTel": "12345678",
        "otp": ""
      }

 📍RESET PASSWORD :

  METHOD : POST
      
      http://localhost:9090/resetPassword
  Script

      {
        "numTel": "12345678",
        "newPassword": "password123"
      }

  ### USERS
 📍POST :

  METHOD : POST
      
      http://localhost:9090/blog/
  Script


        {
          "Title": "exempleT",
          "Description": "Des",
          "image": "image.png",
          "Sujet": "webservice"
         }

    
      
 📍GET :

  METHOD : GET
      
      http://localhost:9090/blog/All
 
      
 📍PATCH :

  METHOD : PATCH
      
      http://localhost:9090/blog/updateBlog/id
  Script

      
        {
          "Title": "new",
          "Description": "new",
          "image": "new.png",
          "Sujet": "newwebservice"
         }
      
      
 📍DELETE :

  METHOD : DELETE
      
      http://localhost:9090/resetPassword
 
      
    `;

      const workflowContent = `
        name: Node.js CI
  
        on:
          push:
            branches:
              - main
  
        jobs:
          build:
            runs-on: ubuntu-latest
  
            steps:
              - uses: actions/checkout@v2
  
              - name: Use Node.js
                uses: actions/setup-node@v2
                with:
                  node-version: "14"
  
              - name: Install dependencies
                run: |
                  npm init -y
                  npm install
                  npm install express mongoose morgan cors cookie-parser jade http-errors
  
              # Remove the Run tests step entirely
      `;
      
      // Initialize the Octokit instance
      const octokit = new Octokit({
        auth: `token ${tokenGitOauth}`, // Use the token from the request payload
      });
    
      // Push the workflow file to the repository
      await octokit.repos.createOrUpdateFileContents({
        owner: repoFullName.split('/')[0],
        repo: repoFullName.split('/')[1],
        path: '.github/workflows/workflow.yml',
        message: 'Add Node.js CI workflow',
        content: Buffer.from(workflowContent).toString('base64'),
      });
      
        // Push the package.json file to the repository
   
    await octokit.repos.createOrUpdateFileContents({
      owner: repoFullName.split('/')[0],
      repo: repoFullName.split('/')[1],
      path: 'package.json',
      message: 'Add package.json',
      content: Buffer.from(packageJsonContent).toString('base64'),
    });

await octokit.repos.createOrUpdateFileContents({
  owner: repoFullName.split('/')[0],
  repo: repoFullName.split('/')[1],
  path: 'ReadMe.md',
  message: 'Guide Line Step by Step ',
  content: Buffer.from(ReadmeFile).toString('base64'),
});
     
    console.log('Workflow and package.json files created and pushed successfully');
    } catch (error) {
      console.error('Error creating or pushing workflow file:', error);
      throw error; // Re-throw the error for the caller to handle
    }
  }
  

server.listen(3000, () => {
  console.log('GitRunner listening on port 3000');
});
