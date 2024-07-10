module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/dockerfile',
        handler: 'docker.create',
        config: {
            auth: false,
          },
      },
      
    ]
  };