  // models/DockerConfig.js
  module.exports = {
    attributes: {
      databaseClient: { type: 'string', required: true },
      databaseHost: { type: 'string', required: true },
      databasePort: { type: 'number', required: true },
      imageName: { type: 'string', required: true },
      nodeVersion: { type: 'string', required: true },
      port: { type: 'number', required: true },
      packageManager: { type: 'string', required: true }, 
      appKeys: { type: 'string', required: true }, 
      nodeEnv: { type: 'string', required: true }, 

    },
  };
 