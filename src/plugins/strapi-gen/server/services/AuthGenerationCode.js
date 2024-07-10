'use strict';


const Mustache = require('mustache');


module.exports = {
    async GenerateUserController(method) {
        // Sample model schema (ideally, this should be a parameter)
        const modelSchema = {
            kind: 'collectionType',
            collectionName: 'users',
            attributes: {
                username: { type: 'string', required: true, maxLength: 20 },
                email: { type: 'string', required: true },
                numTel: { type: 'string' },
                password: { type: 'string', required: true },
            },
        };
    
        // Define templates for different request types
        const templates = {
            LOGIN: `
            exports.login = async function (req, res, next) {
                User.findOne({ name: req.body.name })
                .then(user => {
                    if (!user) {
                        return res.status(401).json({ message: 'User is not registered' });
                    }
            
                    bcrypt.compare(req.body.password, user.password)
                        .then(valid => {
                            if (!valid) {
                                return res.status(401).json({ message: 'Password incorrect' });
                            } else {
                                const maxAge = 1 * 60 * 60;
                                const token = jwt.sign(
                                    { userId: user._id, role: user.role, numTel: user.numTel },
                                    "" + process.env.JWT_SECRET,
                                    { expiresIn: maxAge } // 1hr in sec
                                );
                                res.cookie("jwt", token, {
                                    httpOnly: true,
                                    maxAge: maxAge * 1000, // 1hr in ms
                                    Secure: true,
                                });
            
                                res.status(200).json({
                                    userId: user._id,
                                    message: "User successfully Logged in",
                                    jwt: token,
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error in bcrypt.compare:', error);
                            res.status(500).json({ error: 'Internal Server Error' });
                        });
                })
                .catch(error => {
                    console.error('Error in User.findOne:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
            
            }
            `,
            REGISTER: `
            exports.Register = async function (req, res, next) {
                try {
                    const hash = await bcrypt.hash(req.body.password, 10);
                    const existingUser = await User.findOne({
                        numTel: req.body.numTel,
                    });
                    if (existingUser) {
                        return res.status(400).json({ message: "It seems you already have an account, please log in instead." });
                    }
            
            
            
                    const user = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                        numTel: req.body.numTel,
            
                    });
            
                    await user.save();
            
                    return res.status(200).json({ message: 'User created' });
            
                } catch (error) {
                    return res.status(500).json({ error: error.message });
                }
            }
            `,
            FORGETPASSWORD: `
            exports.forgetPassword = async function (req, res, next) {
                try {
                    // Extract numTel from the request body
                    const { numTel } = req.body;
                
                    // Check if the user is registered
                    const user = await User.findOne({ numTel });
                
                    if (!user) {
                      return res.status(401).json({ message: 'User is not registered' });
                    }
                
                    // Generate OTP
                    const otp = otpGenerator.generate(6, {
                      secret: process.env.JWT_SECRET,
                      digits: 6,
                      algorithm: 'sha256',
                      epoch: Date.now(),
                      upperCaseAlphabets: false,
                      specialChars: false,
                      lowerCaseAlphabets: false,
                    });
                
                    // Save OTP in the database
                    const otpDocument = new Otp({
                      userId: numTel,
                      otp,
                    });
                    await otpDocument.save();
                //     const accountSid = ' ';
                //     const authToken = ' ';
                //     const twilioPhoneNumber = '+ numTel';
                
                //     const client = twilio(accountSid, authToken);
                    
                //     const phoneNumberE164  ="+216" + req.body.numTel
                
                //     console.log('Sending SMS to:', phoneNumberE164);
                //     // Send SMS using Twilio
                //     const message = await client.messages.create({
                //       body: 'Strapi Welcome you!
                //                 Your OTP is: {otp}'', // add '$ befor the {otp} '
                //       from: twilioPhoneNumber,
                //       to: phoneNumberE164,
                //     });
                
                //     console.log('SMS sent with SID: {message.sid}'');
                //    // sendSMS(numTel, otp);
                
                    return res.status(200).json({ otp });
                  } catch (error) {
                    console.error('Error in forgetPasssword:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }
            }
            `,
            OTP: `
            exports.sendOtp = async function (req, res, next) {
                try {
                    const existingUser = await User.findOne(
                      { numTel: req.body.numTel },
                    );
                
                    if (existingUser) {
                      return res.status(400).json({ message: "It seems you already have an account, please log in instead." });
                    }
                    const otp = otpGenerator.generate(6,{
                      secret: process.env.JWT_SECRET,
                      digits: 6,
                      algorithm: 'sha256',
                      epoch: Date.now(),
                      upperCaseAlphabets: false, specialChars: false,
                      lowerCaseAlphabets: false,
                  });
                        const otpDocument = new Otp({
                            userId: req.body.numTel, 
                            otp
                        });
                
                         otpDocument.save();
                       /*  const Tnumtel ="+216" + req.body.numTel
                        sendSMS(Tnumtel,otp)*/
                        res.status(200).json({ message: "OTP Sent"});
                
                } catch (error) {
                    console.error('Error generating OTP:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
            exports.verifyOtp = async function (req, res, next) {
                try {
                    const { numTel, otp } = req.body;
                    const otpDocument = await Otp.findOne({ userId: numTel });
                
                    if (!otpDocument) {
                      return res.status(404).json({ error: 'OTP not found' });
                    }
                
                    // Verify the OTP
                    if (otp === otpDocument.otp) {
                      // Delete the OTP document
                      await otpDocument.deleteOne();
                
                      return res.status(200).json({ message: 'OTP verified' });
                    } else {
                      return res.status(401).json({ error: 'Invalid OTP' });
                    }
                  } catch (error) {
                    console.error('Error in verifyOtp:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                  }
            }
            `,
            RESETPASSWORD: `
            exports.resetPassword = async function (req, res, next) {
                try {
                   
                    const hash = await bcrypt.hash(req.body.newPassword, 10);
                  
                    const user = await User.findOneAndUpdate(
                      { numTel: req.body.numTel },
                      { password: hash },
                      { new: true } 
                      );             
                      if (!user) {
                       return res.status(404).json({ error: 'User not found' });
                       }
                                     
                      return res.status(200).json({ message: 'Password changed !', user });
                  } catch (error) {
                    console.error('Error resetting password:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }            }
            
            `,
        };
    
        // Convert method names to uppercase for consistency
        const supportedMethods = Object.keys(templates).map(method => method.toUpperCase());
        const methods = method.toUpperCase().split(',').map(m => m.trim());
    
        // Check if all requested methods are supported
        if (methods.some(m => !supportedMethods.includes(m))) {
            throw new Error(`Unsupported: ${method}`);
        }
    
        // Generate code for all valid methods in the request
        let renderedCode = '';
        let importsAdded = false; 
        const imports = `const User = require("../models/backendUSERSModels.js");\n bcrypt = require('bcrypt');\n jwt = require ('jsonwebtoken');\n 
         const Otp = require('../models/Otp.js');\n
         twilio = require ('twilio');\n
         otpGenerator = require ('otp-generator')
         `;

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
                throw new Error(`Unsupported: ${m}`);
            }
        });
    
        return renderedCode;
    },
        
async GenerateUserModel(model) {
    if (typeof model !== 'string') {
        throw new TypeError(`Model parameter must be a string, but received: ${typeof model}`);
    }
    const modelSchema = {
        kind: 'collectionType',
        collectionName: 'users',
        attributes: {
            username: { type: 'string', required: true, maxLength: 20 },
            email: { type: 'string', required: true },
            numTel: { type: 'string' },
            password: { type: 'string', required: true },
    
        },
        };
   
    const requestType = 'models';

    const templates = {
        USERS: `
        const mongoose = require('mongoose');
        const { Schema } = mongoose;
    
        const usersSchema = new Schema({
            username: { type: 'string', required: true, maxLength: 20 },
            email: { type: 'string', required: true },
            numTel: { type: 'string', required: true },
            password: { type: 'string', required: true },  
        });
    
        const users = mongoose.model('users', usersSchema);
    
        module.exports = users;
        `,
        User: `
            // Define your UserModel template here
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
async GenerateUserRoutes(method) {
    if (!Array.isArray(method) || method.length === 0) {
        throw new Error('No methods selected for route generation.');
    }

    const modelSchema = {
        kind: 'collectionType',
        collectionName: 'users',
        attributes: {
            username: { type: 'string', required: true, maxLength: 20 },
            email: { type: 'string', required: true },
            numTel: { type: 'string' },
            password: { type: 'string', required: true },
    
        },
        };

    const requestType = 'routes';

    const templates = {
        LOGIN: `
        router.route("/login")
        .post(users.login);

      `,
      REGISTER: `
      router.route("/register")
      .post(users.Register);


      `,
      FORGETPASSWORD: `
      router
      .route('/forgetPassword')
      .post(users.forgetPassword)

      `,
      OTP: `
      router
      .route('/verifyOTP')
      .post(users.verifyOtp)
    
      router
      .route('/sendOTP')
      .post(users.sendOtp)

      `,
      RESETPASSWORD: `
      router
      .route('/resetPassword')
      .post(users.resetPassword)

    `,
    };

    let renderedCode = '';
    let importsAdded = false; // Flag to track if imports are already added

    const imports = `const express = require('express');\nconst router = express.Router();\n
    const users = require('../controllers/backendUSERSCode.js');\n\n`;

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

async generateOtpmodel(model) {

    const modelSchema = {
        kind: 'collectionType',
        collectionName: 'users',
        attributes: {
            username: { type: 'string', required: true, maxLength: 20 },
            email: { type: 'string', required: true },
            numTel: { type: 'string' },
            password: { type: 'string', required: true },
    
        },
        };

    const requestType = 'Otp model';

const template = `
const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema =new mongoose.Schema({
    userId: String,  
    otp: String,
    createdAt: { type: Date, default: Date.now },
    expires: { type: Date, default: Date.now, expires: 1500 },
  })
const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;



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

    const GenerateUserController = await this.GenerateUserController(method);
    const GenerateUserModel = await this.GenerateUserModel(model);
    const GenerateUserRoutes = await this.GenerateUserRoutes([method]);
    const generateOtpmodel = await this.generateOtpmodel(model)

    
    return { GenerateUserController,GenerateUserModel, GenerateUserRoutes };
},
};