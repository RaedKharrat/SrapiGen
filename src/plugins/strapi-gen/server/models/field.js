
  module.exports = {
    name: "Champ",
    description: "Ceci est un champ pour une entité.",
    attributes: {
      name: {
        type: "string",
        required: true,
      },
      description: {
        type: "text",
      },
      uniqueField: {
        type: "boolean",
        default: false,
      },
      requiredField: {
        type: "boolean",
        default: false,
      },
      dataType: {
        type: "enum",
        values: ["string", "text", "number", "boolean", "date", "datetime"],
      },
    },
  };
  