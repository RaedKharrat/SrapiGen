module.exports = {
    name: "Entité",
    description: "Ceci est une entité générique pour stocker des données.",
    attributes: {
      name: {
        type: "string",
        required: true,
      },
      description: {
        type: "text",
      },
      fields: {
        type: "array",
        component: "Field",
      },
    },
  };
  