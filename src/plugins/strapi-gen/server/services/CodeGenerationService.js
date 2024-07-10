'use strict';


const Mustache = require('mustache');


module.exports = {
async generateCode(method) {
  
    // Sample model schema (ideally, this should be a parameter)
    const modelSchema = {
    kind: 'collectionType',
    collectionName: 'blogs',
    attributes: {
        Title: { type: 'string', required: true, maxLength: 20 },
        Description: { type: 'string', required: true },
        image: { type: 'string', required: true },
        Sujet: { type: 'string' },
    },
    };

    // Define templates for different request types
    const templates = {
    POST: `


    exports.addBlog = async function(req, res, next) {
        const blogs = new Blog({
         Title: req.body.Title,
            Description: req.body.Description,
            image: req.body.image,
            Sujet: req.body.Sujet,
        });

        await blogs.save()
            .then((blogs) => res.status(200).json({ blogs }))
            .catch((error) => res.status(400).json({ error }));
        }
    `,
    GET: `
    exports.getAllBlogs = async function(req, res, next) {
        try {
            const blogs = await Blog.find().exec();
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            console.error(error);
        }
        }
    `,
    PATCH: `
    exports.PATCHBlog  = async function (req, res) {
        try {
            const blogsId = req.params.id; // Corrected from req.param.id

            const { Title, Description, image, Sujet } = req.body;

            const blog = await Blog.findById(blogsId); // Corrected from blogs.findById

            if (!blog) {
            return res.status(404).json({ error: "Blog not found" }); // Corrected from "blog not found"
            }

            blog.Title = Title;
            blog.Description = Description;
            blog.image = image;
            blog.Sujet = Sujet;

            const updatedBlog = await blog.save(); // Renamed to avoid conflict with function name

            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        }
    `,
    DELETE: `
    exports.deleteBlog = async function (req, res, next) {
        try {
            const blogId = req.params.id; // Corrected from req.param.id

            console.log('Attempting to delete blog with ID:', blogId);

            // Find the blog by its ID
            const blogToDelete = await Blog.findOne({ _id: blogId }); // Corrected to use _id

            if (!blogToDelete) {
            console.log('Blog not found for ID:', blogId);
            return res.status(404).json({ message: 'Blog not found' });
            }

            // Delete the blog
            await blogToDelete.deleteOne();

            console.log('Blog deleted successfully:', blogToDelete);
            res.json({ message: 'Blog deleted successfully', blog: blogToDelete });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
        }
    `,
    };
    const supportedMethods = ['POST', 'GET', 'PATCH', 'DELETE'];
    // const methods = method.toUpperCase().split(',').map(m => m.trim());
    // if (methods.some(m => )) {
    //     throw new Error(`Unsupported request methods: ${method}`); }
    // Validate request method (assuming `method` can only be uppercase)
  // Validate request method (assuming `method` can only be uppercase)
  const methods = method.toUpperCase().split(',').map(m => m.trim());
  if (methods.some(m => !Object.keys(templates).includes(m) && !supportedMethods.includes(m) )) {
      throw new Error(`Unsupported request methods: ${method}`);
  }

  // Generate code for all valid methods in the request
  let renderedCode = '';
  let importsAdded = false; 

      const imports = `const Blog = require("../models/backendBLOGSModels.js");\n\n`;

  methods.forEach(m => {
      const template = templates[m];
      if (template) {
        if (!importsAdded) {
            renderedCode += imports; // Add imports only once
            importsAdded = true;
        }
          renderedCode += template;
      } else {
          // Handle unsupported method within the loop
          throw new Error(`Unsupported request method: ${m}`);
      }
  });

    return renderedCode;
},
async generateModels(model) {
    if (typeof model !== 'string') {
        throw new TypeError(`Model parameter must be a string, but received: ${typeof model}`);
    }

    const modelSchema = {
        kind: 'collectionType',
        collectionName: 'blogs',
        attributes: {
            Title: { type: 'string', required: true, maxLength: 20 },
            Description: { type: 'string', required: true },
            image: { type: 'string', required: true },
            Sujet: { type: 'string' },  
        },
    };
   
    const requestType = 'models';

    const templates = {
        BLOGS: `
            const mongoose = require('mongoose');
            const { Schema } = mongoose;
        
            const blogsSchema = new Schema({
                Title: { type: 'string', required: true, maxLength: 20 },
                Description: { type: 'string', required: true },
                image: { type: 'string', required: true },
                Sujet: { type: 'string' },  
            });
        
            const blogs = mongoose.model('blogs', blogsSchema);
        
            module.exports = blogs;
        `,
        USERS: `
      
    `,
    };

    const models = model.toUpperCase().split(',').map(m => m.trim());
    if (models.some(m => !Object.keys(templates).includes(m))) {
        throw new Error(`invalid model data: ${model}`);
    }
    // Extract attribute names from the model schema
    let renderedCode = '';

    models.forEach(model => {
        const template = templates[model];
        if (template) {
            renderedCode += template;
        }
    });

    // Return the rendered code
    return renderedCode;
},
async generateRoutes(method) {
    if (!Array.isArray(method) || method.length === 0) {
        throw new Error('No methods selected for route generation.');
    }

    const modelSchema = {
        kind: 'collectionType',
        collectionName: 'blogs',
        attributes: {
            Title: { type: 'string', required: true, maxLength: 20 },
            Description: { type: 'string', required: true },
            image: { type: 'string', required: true },
            Sujet: { type: 'string' },
        },
    };

    const requestType = 'routes';

    const templates = {
        POST: `
        router.route("/")
            .post(blogs.addBlog);

      `,
        GET: `
        router.route("/All")
            .get(blogs.getAllBlogs);

      `,
        PATCH: `
        router.route("/updateBlog/:id")
            .patch(blogs.PATCHBlog);

      `,
        DELETE: `
        router.route("/delete/:id")
            .delete(blogs.deleteBlog);

      `,
    };

    let renderedCode = '';
    let importsAdded = false; // Flag to track if imports are already added

    const imports = `const express = require('express');\nconst router = express.Router();\n
    const blogs = require('../controllers/backendBLOGSCode.js');\n\n`;

    method.forEach(method => {
        const template = templates[method];
        if (template) {
            if (!importsAdded) {
                renderedCode += imports; // Add imports only once
                importsAdded = true;
            }
            renderedCode += template;
        }
    });
    renderedCode += `\nmodule.exports = router;`;


    return renderedCode;
},
async generateServerdotjs(index) {

    const modelSchema = {
    kind: 'collectionType',
    collectionName: 'blogs',
    attributes: {
        Title: { type: 'string', required: true, maxLength: 20 },
        Description: { type: 'string', required: true },
        image: { type: 'string', required: true },
        Sujet: { type: 'string' },  
    },
    };




    const requestType = 'index';

const template = `
const express = require('express'); // Import express using require
const mongoose = require('mongoose'); // Import Mongoose using require
const morgan = require('morgan');
const blogRoutes = require('./routes/backendBLOGSRoutes.js'); // Import routes using require
const usersRoutes = require('./routes/backendUSERSRoutes.js'); // Import routes using require
const cookieParser = require('cookie-parser');
const cors = require('cors');

const hostname = '127.0.0.1';
const app = express();
const port = process.env.port || 9090;
const databaseName = 'ReadyBackendDB';

// Cela afichera les requêtes MongoDB dans le terminal
mongoose.set('debug', true);
// Utilisation des promesses ES6 pour Mongoose, donc aucune callback n'est nécessaire
mongoose.Promise = global.Promise;

// Se connecter à MongoDB
mongoose
// remove the / next to $
.connect('mongodb://127.0.0.1:27017/dababaseName')  // change dataBaseName
.then(() => {
    // Une fois connecté, afficher un message de réussite sur la console
    console.log('Connected to DB');
})
.catch(err => {
    // Si quelque chose ne va pas, afficher l'erreur sur la console
    console.log(err);
});

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use('/blog',blogRoutes);
app.use('/',usersRoutes);

/**
 * Démarrer le serveur à l'écoute des connexions
 */
app.listen(port, hostname,() => {
    console.log('Server running at http://localhost:9090/');
})





`;

// Extract attribute names from the model schema
const attributes = Object.keys(modelSchema.attributes);

// Render the template with the extracted attributes and request type
const renderedCode = Mustache.render(template, {
    RequestType: requestType.toUpperCase(),
    Attributes: attributes.join(', '),
});

// Return the rendered code
return renderedCode;
},
async generateBackend(request) {
    const { method, model } = request;

    // Generate code for generateCode method
    const generatedCode = await this.generateCode(method);
    const generatedModels = await this.generateModels(model)
    const generatedRoutes = await this.generateRoutes([method]);

    
    return { generatedCode,generatedModels, generatedRoutes };
},
};