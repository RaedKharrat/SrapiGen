const fs = require('fs');
const path = require('path');
const CodeGenerationService = require('../services/CodeGenerationService');
const esprima = require('esprima');

describe('CodeGenerationService', () => {
  const codeDir = path.join(__dirname, '../../../../../../../ReadyProductBackend');
  const codeDirC = path.join(codeDir, 'controllers');
  const codeDirM = path.join(codeDir, 'models');
  const codeDirR = path.join(codeDir, 'routes');

  // Cleanup generated files after tests
  afterAll(() => {
    if (fs.existsSync(path.join(codeDir, 'Server.js'))) {
        fs.unlinkSync(path.join(codeDir, 'Server.js'));
    }
    if (fs.existsSync(codeDirR)) {
        fs.rmdirSync(codeDirR, { recursive: true });
    }
    if (fs.existsSync(codeDirM)) {
        fs.rmdirSync(codeDirM, { recursive: true });
    }
    if (fs.existsSync(codeDirC)) {
        fs.rmdirSync(codeDirC, { recursive: true });
    }
});



describe('generateCode', () => {
    it('should generate code for all HTTP methods', async () => {
      const methods = ['POST', 'GET', 'PATCH', 'DELETE'];
      const generatedCode = await CodeGenerationService.generateCode(methods.join(','));
      expect(generatedCode).toBeDefined();
      
    });
     
    
    it('should throw an error when no HTTP methods are provided', async () => {
      await expect(CodeGenerationService.generateCode('')).rejects.toThrow('Unsupported request methods: ');
    });
    it('should validate if  POST template contain a JavaScript Syntax', async () => {
      const generatedCode = await CodeGenerationService.generateCode('POST');
      expect(validateJavaScriptSyntax(generatedCode)).toBe(true);
    });

    it('should validate if  GET template contain a JavaScript Syntax', async () => {
      const generatedCode = await CodeGenerationService.generateCode('GET');
      expect(validateJavaScriptSyntax(generatedCode)).toBe(true);
    });

    it('should validate if  PATCH template contain a JavaScript Syntax', async () => {
      const generatedCode = await CodeGenerationService.generateCode('PATCH');
      expect(validateJavaScriptSyntax(generatedCode)).toBe(true);
    });

    it('should validate if  DELETE template contain a JavaScript Syntax', async () => {
      const generatedCode = await CodeGenerationService.generateCode('DELETE');
      expect(validateJavaScriptSyntax(generatedCode)).toBe(true);
 
  });

  it('should throw an error when no HTTP methods are provided', async () => {
    await expect(CodeGenerationService.generateCode('')).rejects.toThrow('Unsupported request methods: ');
  });
  });



  describe('generateModels', () => {
    it('should generate model code', async () => {
      const models = 'BLOGS'; // Provide valid model data as a string
      const generatedModels = await CodeGenerationService.generateModels(models);
      expect(generatedModels).toBeDefined();
      // Add more assertions as needed
    });

    it('should validate syntax of the generated template', async () => {
      const model = 'BLOGS'; // Provide valid model data as a string
      const generatedTemplate = await CodeGenerationService.generateModels(model);
      expect(validateJavaScriptSyntax(generatedTemplate)).toBe(true);
    });

    it('should throw an error for invalid model data', async () => {
      await expect(CodeGenerationService.generateModels()).rejects.toThrow('Model parameter must be a string');
    });
  });

  describe('generateRoutes', () => {
    it('should generate routes for all HTTP methods', async () => {
      const methods = ['POST', 'GET', 'PATCH', 'DELETE'];
      const generatedRoutes = await CodeGenerationService.generateRoutes(methods);
      expect(generatedRoutes).toBeDefined();
      // Add more assertions as needed
    });
    it('should validate syntax of the generated routes template', async () => {
      // Array of HTTP methods
      const methods = ['POST', 'GET', 'PATCH', 'DELETE'];

      // Generate routes code for the specified methods
      const generatedRoutes = await CodeGenerationService.generateRoutes(methods);

      // Check if the generated routes template passes the JavaScript syntax validation
      expect(validateJavaScriptSyntax(generatedRoutes)).toBe(true);
  });
    it('should throw an error when no methods are provided', async () => {
      await expect(CodeGenerationService.generateRoutes([])).rejects.toThrow('No methods selected for route generation.');
    });

    
  });

  describe('generateServerdotjs', () => {
    it('should generate server.js code', async () => {
      const index = {}; // Provide valid index data
      const generatedServerDotJs = await CodeGenerationService.generateServerdotjs(index);
      expect(generatedServerDotJs).toBeDefined();
      // Add more assertions as needed
    });
    it('should validate syntax of the generated server.js template', async () => {
      // Generate the server.js code
      const generatedServerCode = await CodeGenerationService.generateServerdotjs();

      // Check if the generated server.js template passes the JavaScript syntax validation
      expect(validateJavaScriptSyntax(generatedServerCode)).toBe(true);
  });
  /*  it('should throw an error for invalid index file', async () => {
      const index = null; // Invalid index data
      await expect(CodeGenerationService.generateServerdotjs()).rejects.toThrow();
    });*/
  });

  describe('generateBackend', () => {
    it('should generate backend code', async () => {
      const request = { method: 'POST', model: 'BLOGS', index: {} }; // Provide valid request data
      const generatedBackend = await CodeGenerationService.generateBackend(request);
      expect(generatedBackend).toBeDefined();
      expect(generatedBackend.generatedCode).toBeDefined();
      expect(generatedBackend.generatedRoutes).toBeDefined();
      // Add more assertions as needed
    });

    it('should throw an error for invalid request data', async () => {
      const invalidRequest = null; // Invalid request data
      await expect(CodeGenerationService.generateBackend(invalidRequest)).rejects.toThrow();
    });
  
  });
   
});
function validateJavaScriptSyntax(code) {
  try {
    new Function(code);
    return true;
} catch (error) {
    console.error('Invalid JavaScript syntax:', error);
    return false;
} false;
  
  }