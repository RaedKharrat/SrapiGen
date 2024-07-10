// /plugins/strapi-gen/server/controllers/docker.js

module.exports = {
    async login(ctx) {
      try {
        const token = await strapi.plugin('strapi-gen').service('Docker').authenticateDockerHub();
        ctx.send({ token });
      } catch (error) {
        console.log(error)
        ctx.badRequest('Authentication failed');
      }
    },
  
    async fetchRepositories(ctx) {
      try {
        // Vérifie que l'en-tête Authorization existe
        if (!ctx.request.header.authorization) {
          ctx.throw(401, 'L\'en-tête Authorization est manquant');
        }
  
        const parts = ctx.request.header.authorization.split(' ');
        // Vérifie que l'en-tête est dans le bon format
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
          ctx.throw(401, 'L\'en-tête Authorization n\'est pas correctement formaté');
        }
    
        const token = parts[1];
        const data = await strapi.plugin('strapi-gen').service('Docker').getRepositories(token);
        ctx.send(data);
      } catch (error) {
        console.log(error);
        // Améliorer la gestion d'erreur pour refléter le message d'erreur approprié
        ctx.badRequest('Échec de la récupération des données', { error: error.message });
      }
    },
  
    async startContainer(ctx) {
    const { imageName, imageTag, containerPort } = ctx.request.body;

    if (!imageName || !imageTag) {
      return ctx.badRequest('imageName or imageTag not specified');
    }

    try {
      const containerId = await strapi.plugin('strapi-gen').service('Docker').pullAndRunDockerImage(imageName, imageTag, containerPort);
      ctx.send({ message: 'Container started successfully', containerId });
    } catch (error) {
      ctx.badRequest('Failed to start container', { error: error.toString() });
    }
  },
  };
  