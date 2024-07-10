module.exports = {
    async create(ctx) {
      try {
        const field = await strapi.services.field.createField(ctx);
        ctx.send({ data: field });
      } catch (error) {
        ctx.badRequest(error.message); // Handle errors appropriately
      }
    },
  
    // Other methods for retrieving, updating, or deleting fields
  };