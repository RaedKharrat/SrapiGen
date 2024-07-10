const GeneratedBackendController = require('../controllers/GeneratedBackendController');

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/pwd',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },
  // {
  //   method: 'POST',
  //   path: '/custom-entities',
  //   handler: 'EntityController.create',
  //   config: {
  //     auth: false,
  //   },
  // },
  // {
  //   method: 'GET',
  //   path: '/custom-entities',
  //   handler: 'EntityController.getAll',
  //   config: {
  //     auth: false,
  //   },
  // },
  // {
  //   method: 'GET',
  //   path: '/custom-entities/:id',
  //   handler: 'EntityController.getById',
  //   config: {
  //     auth: false,
  //   },
  // },
  // {
  //   method: 'PUT',
  //   path: '/custom-entities/:id',
  //   handler: 'EntityController.update',
  //   config: {
  //     auth: false,
  //   },
  // },
  // {
  //   method: 'DELETE',
  //   path: '/custom-entities/:id',
  //   handler: 'EntityController.delete',
  //   config: {
  //     auth: false,
  //   },
  // },
  {
    method: 'POST',
    path: '/generate-docker-files',
    handler: 'controller.generateDockerFiles',
    config: {
      auth: false,
    },
  },

  {
    method: 'POST',
    path: '/generate-backend',
   
    handler: 'GeneratedBackendController.generateBackend', // Access exported function
    config: {
     
      auth: false,
     
    }
  },
  {
    method: 'POST',
    path: '/docker/login',
    handler: 'dockerhub.login',
    config: {
      auth: false,
    },
  },

  {
    method: 'GET',
    path: '/docker/repositories',
    handler: 'dockerhub.fetchRepositories',
    config: {
      auth: false,
    },
  },

  {
    method: 'POST',
    path: '/docker/deployImage',
    handler: 'dockerhub.startContainer',
    config: {
      policies: [],
      middlewares: [],
      auth: false
    }
  },

  {
    method: 'POST',
    path: '/trigger-workflow',
    handler: 'workflow.triggerWorkflow',
    config: {
      policies: [],
      middlewares: [],
      auth: false
    }
  }

];
