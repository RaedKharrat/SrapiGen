const fs = require('fs');
const path = require('path');
const generateCode = require('../services/CodeGenerationService');
const generateUser = require('../services/AuthGenerationCode');
const { execSync } = require('child_process');
const { Octokit } = require('@octokit/rest');
const http = require('http');
const wss = require('./WebSockets');
const WebSocket = require('ws');

module.exports = {
  async generateBackend(ctx, tokenGitOauth) {
    console.log('eazeaeaze');
    try {
      const { method, model, route, index, selectedRepo, tokenGitOauth } = ctx.request.body;
      let backendLogs = ''; // Initialize backend logs variable

      let backendCode, backendModels, backendRoutes, backendIndex;
      let backendUserController, backendUserModel , backendUserRoutes, backendOTPmodel;
      if (model === 'BLOGS') {
        backendCode = await generateCode.generateCode(method);
        backendModels = await generateCode.generateModels(model);
        backendRoutes = await generateCode.generateRoutes(method.split(','));
        backendIndex = await generateCode.generateServerdotjs(index);
      } else if (model === 'USERS') {
        backendUserController = await generateUser.GenerateUserController(method);
        backendUserModel = await generateUser.GenerateUserModel(model);
        backendUserRoutes = await generateUser.GenerateUserRoutes(method.split(','));
        backendOTPmodel = await generateUser.generateOtpmodel(model);
        backendIndex = await generateCode.generateServerdotjs(index);
      } else if (model === 'USERS , BLOGS' || model === 'BLOGS , USERS') {
        // Split the model string to get individual models
        const models = model.split(' , ');
        
        // Generate code for each model
        for (const model of models) {
          if (model === 'BLOGS') {
            backendCode = await generateCode.generateCode(method);
            backendModels = await generateCode.generateModels(model);
            backendRoutes = await generateCode.generateRoutes(method.split(','));
            backendIndex = await generateCode.generateServerdotjs(index);
            // Push files for BLOGS service
          //  const [owner, repo] = selectedRepo.split('/');
          //  await pushFilesToGitHub(owner, repo, 'BLOGS', backendCode, backendModels, backendRoutes, backendIndex, tokenGitOauth);
          } else if (model === 'USERS') {
            backendUserController = await generateUser.GenerateUserController(method);
            backendUserModel = await generateUser.GenerateUserModel(model);
            backendUserRoutes = await generateUser.GenerateUserRoutes(method.split(','));
            backendOTPmodel = await generateUser.generateOtpmodel(model);
            backendIndex = await generateCode.generateServerdotjs(index);
            // Push files for USERS service
          //  const [owner, repo] = selectedRepo.split('/');
          //  await pushFilesToGitHub(owner, repo, 'USERS', backendUserController, backendUserModel , backendUserRoutes, backendOTPmodel, backendIndex, tokenGitOauth);
          }
        }

      
        // Return early since files are pushed inside the loop
        ctx.send({ message: 'Code generated and pushed to GitHub successfully!' });
        return;
      } else {
        ctx.send({ message: 'Select a model plz!' });
        console.log('select a model');
        return;
      }

      // Define directory for generated files
      const codeDir = path.join(__dirname, '../../../../../../../ReadyProductBackend');
      const codeDirC = path.join(codeDir, 'controllers');
      const codeDirM = path.join(codeDir, 'models');
      const codeDirR = path.join(codeDir, 'routes');

      // Create directory if it doesn't exist
      if (!fs.existsSync(codeDir)) {
        fs.mkdirSync(codeDir);
      }
      if (!fs.existsSync(codeDirC)) {
        fs.mkdirSync(codeDirC);
      }
      if (!fs.existsSync(codeDirM)) {
        fs.mkdirSync(codeDirM);
      }
      if (!fs.existsSync(codeDirR)) {
        fs.mkdirSync(codeDirR);
      }

      if (model === 'BLOGS') {
        // Write generated code to files
        fs.writeFileSync(path.join(codeDirC, 'backendBLOGSCode.js'), backendCode);
        fs.writeFileSync(path.join(codeDirM, 'backendBLOGSModels.js'), backendModels);
        fs.writeFileSync(path.join(codeDirR, 'backendBLOGSRoutes.js'), backendRoutes);
      } else if (model === 'USERS') {
        fs.writeFileSync(path.join(codeDirC, 'backendUSERSCode.js'), backendUserController);
        fs.writeFileSync(path.join(codeDirM, 'backendUSERSModels.js'), backendUserModel);
        fs.writeFileSync(path.join(codeDirR, 'backendUSERSRoutes.js'), backendUserRoutes);
        fs.writeFileSync(path.join(codeDirM, 'Otp.js'), backendOTPmodel);

      }

      // Run npm commands to generate package.json and install dependencies
      execSync('npm init -y', { cwd: codeDir });
      execSync('npm install', { cwd: codeDir });
      execSync('npm install express mongoose morgan cors cookie-parser jade http-errors', { cwd: codeDir });

      // Push code to GitHub repository
      const [owner, repo] = selectedRepo.split('/');
      const octokit = new Octokit({
        auth: `token ${tokenGitOauth}`, // Use the token from the request payload
      });
      if (model === 'BLOGS') {
        // Define file paths based on model
        const codeFilePath = `controllers/backendBLOGSCode.js`;
        const modelsFilePath = `models/backendBLOGSModels.js`;
        const routesFilePath = `routes/backendBLOGSRoutes.js`;
        const indexFilePath = `Server.js`;
    
        // Push files to GitHub
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: codeFilePath,
          message: `Add backend code for ${model}`,
          content: Buffer.from(backendCode).toString('base64'),
        });
    
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: modelsFilePath,
          message: `Add backend models for ${model}`,
          content: Buffer.from(backendModels).toString('base64'),
        });
    
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: routesFilePath,
          message: `Add backend routes for ${model}`,
          content: Buffer.from(backendRoutes).toString('base64'),
        });
    
        // Check if backendIndex file exists
        const indexFileExists = await checkFileExists(owner, repo, indexFilePath, tokenGitOauth);
        if (!indexFileExists) {
          await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: indexFilePath,
            message: `Add backend index for ${model}`,
            content: Buffer.from(backendIndex).toString('base64'),
          });
          console.log(`Backend index file created and pushed to GitHub for ${model}`);
        } else {
          console.log(`Backend index file already exists for ${model}`);
        }
    
        console.log(`Files pushed to GitHub for ${model}`);
      } else if (model === 'USERS') {
        const octokit = new Octokit({
          auth: `token ${tokenGitOauth}`, // Use the token from the request payload
        });
        console.log("ezaeazeaz", tokenGitOauth);
        // Define file paths based on model
        const codeFilePath = `controllers/backendUSERSCode.js`;
        const modelsFilePath = `models/backendUSERSModels.js`;
        const modelFilePath = `models/Otp.js`;
        const routesFilePath = `routes/backendUSERSRoutes.js`;
        const indexFilePath = `Server.js`;
    
        // Push files to GitHub
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: codeFilePath,
          message: `Add backend code for ${model}`,
          content: Buffer.from(backendUserController).toString('base64'),
        });
    
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: modelsFilePath,
          message: `Add backend models for ${model}`,
          content: Buffer.from(backendUserModel).toString('base64'),
        });
    
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: modelFilePath,
          message: `Add backend models for ${model}`,
          content: Buffer.from(backendOTPmodel).toString('base64'),
        });
    
        await octokit.repos.createOrUpdateFileContents({
          owner,
          repo,
          path: routesFilePath,
          message: `Add backend routes for ${model}`,
          content: Buffer.from(backendUserRoutes).toString('base64'),
        });
    
        // Check if backendIndex file exists
        const indexFileExists = await checkFileExists(owner, repo, indexFilePath, tokenGitOauth);
        if (!indexFileExists) {
          await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: indexFilePath,
            message: `Add backend index for ${model}`,
            content: Buffer.from(backendIndex).toString('base64'),
          });
          console.log(`Backend index file created and pushed to GitHub for ${model}`);
        } else {
          console.log(`Backend index file already exists for ${model}`);
        }
    
        console.log(`Files pushed to GitHub for ${model}`);
      }

      // Log the payload before sending
      console.log('Payload:', JSON.stringify({ ref: 'refs/heads/main', selectedRepo, tokenGitOauth }));

      // Send the webhook payload
      const options = {
        hostname: 'localhost', // Change to your GitRunner.js server hostname or IP
        port: 3000, // Change to your GitRunner.js server port
        path: '/webhook',
        method: 'POST',
      };

      const req = http.request(options, (res) => {
        console.log(`GitRunner.js statusCode: ${res.statusCode}`);
      });

      req.on('error', (error) => {
        console.error('GitRunner.js request error:', error);
      });

      req.write(JSON.stringify({ ref: 'refs/heads/main', selectedRepo, tokenGitOauth  }));
      req.end();

      //  const logMessage = 'Backend logic executed successfully!';
      // wss.clients.forEach((client) => {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(logMessage);
      //   }
      // });

      // console.log(logMessage);

      // ctx.status = 200;
      // Return response to the client
      ctx.send({ message: 'Code generated and pushed to GitHub successfully!', logs: 'Logs from code generation' });
    } catch (error) {
      console.error('Error generating backend code:', error);
      console.log('GitHub OAuth token:', tokenGitOauth);

      ctx.throw(500, 'Internal server error');
    }
  },
};



async function checkFileExists(owner, repo, filePath, tokenGitOauth) {
  const octokit = new Octokit({
    auth: `token ${tokenGitOauth}`, // Use the token from the request payload
  });

  try {
    await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
    });
    return true; // File exists
  } catch (error) {
    if (error.status === 404) {
      return false; // File does not exist
    } else {
      throw error;
    }
  }
}
