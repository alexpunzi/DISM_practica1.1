/**
 * The DefaultController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/DefaultService');
const addFichaje = async (request, response) => {
  await Controller.handleRequest(request, response, service.addFichaje);
};

const addTrabajo = async (request, response) => {
  await Controller.handleRequest(request, response, service.addTrabajo);
};

const addUsuario = async (request, response) => {
  await Controller.handleRequest(request, response, service.addUsuario);
};

const deleteTrabajo = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteTrabajo);
};

const deleteUsuario = async (request, response) => {
  await Controller.handleRequest(request, response, service.deleteUsuario);
};

const getApiKeys = async (request, response) => {
  await Controller.handleRequest(request, response, service.getApiKeys);
};

const getFichajeActivo = async (request, response) => {
  await Controller.handleRequest(request, response, service.getFichajeActivo);
};

const getFichajes = async (request, response) => {
  await Controller.handleRequest(request, response, service.getFichajes);
};

const getTrabajoById = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTrabajoById);
};

const getTrabajos = async (request, response) => {
  await Controller.handleRequest(request, response, service.getTrabajos);
};

const getUsuarioById = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsuarioById);
};

const getUsuarios = async (request, response) => {
  await Controller.handleRequest(request, response, service.getUsuarios);
};

const updateFichaje = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateFichaje);
};

const updateTrabajo = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateTrabajo);
};

const updateUsuario = async (request, response) => {
  await Controller.handleRequest(request, response, service.updateUsuario);
};


module.exports = {
  addFichaje,
  addTrabajo,
  addUsuario,
  deleteTrabajo,
  deleteUsuario,
  getApiKeys,
  getFichajeActivo,
  getFichajes,
  getTrabajoById,
  getTrabajos,
  getUsuarioById,
  getUsuarios,
  updateFichaje,
  updateTrabajo,
  updateUsuario,
};
