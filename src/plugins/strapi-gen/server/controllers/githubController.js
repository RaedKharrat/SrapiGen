'use strict';

// import { githubService } from "../services";

 const githubService = require('../services/githubService');

module.exports = {
  async githubC(ctx) {
    try {
      const { code, projectName, visibility } = ctx.request.body;

      // Exchange the authorization code for an access token
      // const accessToken = await strapi.plugins['strapi-gen'].services.githubService.exchangeCodeForAccessToken(code);


      const accessToken = await githubService.exchangeCodeForAccessToken(code);
      const repository = await githubService.createRepository(projectName, accessToken);


    //   // Create the repository on GitHub using the access token
    // //  const repository = await strapi.plugins['strapi-gen'].services.githubService.createRepository(projectName, accessToken);

       ctx.send(repository);
    } catch (error) {
      strapi.log.error('Error creating repository:', error);
      ctx.throw(500, 'Internal server error');
    }
    
  }
};