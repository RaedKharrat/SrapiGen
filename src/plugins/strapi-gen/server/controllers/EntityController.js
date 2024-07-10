'use strict';

module.exports = ({ strapi }) => ({
  async create(ctx) {
    try {
      const createdEntity = await strapi.plugins['strapi-gen'].services.EntityService.createEntity(ctx);

      ctx.send({
        data: {
          createdEntity, // Include information from both services
        },
      });
    } catch (error) {
      ctx.badRequest(error.message); // Handle errors appropriately
    }
  },

  async getAll(ctx) {
    try {
      const entities = await strapi.plugins['strapi-gen'].services.EntityService.getAllEntities();

      ctx.send({
        data: entities,
      });
    } catch (error) {
      ctx.badRequest(error.message);
    }
  },

  async getById(ctx) {
    const { id } = ctx.params;

    // Validate ID ...

    const entity = await strapi.plugins['strapi-gen'].services.EntityService.getEntityById(id);

    if (!entity) {
      ctx.notFound();
      return;
    }

    ctx.send({
      data: entity,
    });
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { name, description, fields } = ctx.request.body;

    // Validate data and ID ...

    const updatedEntity = await strapi.plugins['strapi-gen'].services.EntityService.updateEntity(id, {
      name,
      description,
      fields,
    });

    if (!updatedEntity) {
      ctx.notFound();
      return;
    }

    ctx.send({
      data: updatedEntity,
    });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    // Validate ID ...

    const deletedEntity = await strapi.plugins['strapi-gen'].services.EntityService.deleteEntity(id);

    if (!deletedEntity) {
      ctx.notFound();
      return;
    }

    ctx.send({
      data: deletedEntity,
    });
  },


  // Implement similar handlers for other CRUD operations
});
