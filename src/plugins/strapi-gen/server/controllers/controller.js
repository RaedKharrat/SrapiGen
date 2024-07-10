// controller/controller.js

'use strict';

module.exports = {
    generateDockerFiles: async (ctx) => {
      try {
        // Récupérez les données de la requête
        const configData = ctx.request.body;
  
        // Utilisez le service pour générer les fichiers Docker
        const result = await strapi.plugins['strapi-gen'].services.DockerService.generateDockerFiles(configData);
  
        // Envoyez une réponse réussie
        return ctx.send(result);
      } catch (error) {
        console.error('Erreur dans le contrôleur Docker', error);
        return ctx.badRequest('Erreur lors de la génération des fichiers Docker');
      }
    },
  };
  