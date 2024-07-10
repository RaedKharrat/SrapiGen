'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-gen')
      .service('myService')
      .getWelcomeMessage();
  },
});
