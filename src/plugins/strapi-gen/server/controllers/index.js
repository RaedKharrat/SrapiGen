'use strict';

const myController = require('./my-controller');
//const EntityController = require('./EntityController')
const controller = require('./controller')
const GeneratedBackendController = require ('./GeneratedBackendController')
const dockerhub  = require('./dockerhub');
const workflow = require ('./workflow');
module.exports = {
  myController,
  //EntityController,
  controller,
  GeneratedBackendController,
  workflow,
  dockerhub
};
