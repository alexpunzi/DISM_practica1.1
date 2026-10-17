/*
 * ============================================================================
 * UNIVERSIDAD DE ALICANTE - Ingeniería Multimedia
 * DISM (Dispositivos e Infraestructura de Sistemas Multimedia)
 * Práctica 1: API Registro Horario
 * 
 * Archivo: DefaultService.js
 * Descripción: Lógica de negocio y consultas SQL a MySQL (api_dism).
 * ============================================================================
 */

const db = require('../utils/db');

// ==========================================
// --- USUARIOS ---
// ==========================================

/**
 * Obtener todos los usuarios
 */
const getUsuarios = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IdUsuario, Nombre, Usuario FROM Usuarios';
    db.query(sql, (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al consultar usuarios' });
      resolve(results);
    });
  });
};

/**
 * Crear un nuevo usuario
 */
const addUsuario = (body) => {
  return new Promise((resolve, reject) => {
    const { Nombre, Usuario, Clave } = body;
    const sql = 'INSERT INTO Usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)';
    db.query(sql, [Nombre, Usuario, Clave], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al crear usuario' });
      resolve({ IdUsuario: results.insertId, Nombre, Usuario });
    });
  });
};

/**
 * Obtener usuario por ID
 */
const getUsuarioById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IdUsuario, Nombre, Usuario FROM Usuarios WHERE IdUsuario = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al obtener usuario' });
      if (results.length === 0) return reject({ code: 404, message: 'Usuario no encontrado' });
      resolve(results[0]);
    });
  });
};

/**
 * Actualizar un usuario
 */
const updateUsuario = (id, body) => {
  return new Promise((resolve, reject) => {
    const { Nombre, Usuario, Clave } = body;
    const sql = 'UPDATE Usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?';
    db.query(sql, [Nombre, Usuario, Clave, id], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al actualizar usuario' });
      resolve({ message: 'Usuario actualizado correctamente' });
    });
  });
};

/**
 * Eliminar un usuario
 */
const deleteUsuario = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Usuarios WHERE IdUsuario = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al eliminar usuario' });
      resolve({ message: 'Usuario eliminado correctamente' });
    });
  });
};

// ==========================================
// --- TRABAJOS ---
// ==========================================

/**
 * Obtener todos los trabajos
 */
const getTrabajos = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IdTrabajo, Nombre FROM Trabajos';
    db.query(sql, (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al consultar trabajos' });
      resolve(results);
    });
  });
};

/**
 * Crear un nuevo trabajo
 */
const addTrabajo = (body) => {
  return new Promise((resolve, reject) => {
    const { Nombre } = body;
    const sql = 'INSERT INTO Trabajos (Nombre) VALUES (?)';
    db.query(sql, [Nombre], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al crear trabajo' });
      resolve({ IdTrabajo: results.insertId, Nombre });
    });
  });
};

/**
 * Obtener trabajo por ID
 */
const getTrabajoById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IdTrabajo, Nombre FROM Trabajos WHERE IdTrabajo = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al obtener trabajo' });
      if (results.length === 0) return reject({ code: 404, message: 'Trabajo no encontrado' });
      resolve(results[0]);
    });
  });
};

/**
 * Actualizar un trabajo
 */
const updateTrabajo = (id, body) => {
  return new Promise((resolve, reject) => {
    const { Nombre } = body;
    const sql = 'UPDATE Trabajos SET Nombre = ? WHERE IdTrabajo = ?';
    db.query(sql, [Nombre, id], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al actualizar trabajo' });
      resolve({ message: 'Trabajo actualizado correctamente' });
    });
  });
};

/**
 * Eliminar un trabajo
 */
const deleteTrabajo = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Trabajos WHERE IdTrabajo = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al eliminar trabajo' });
      resolve({ message: 'Trabajo eliminado correctamente' });
    });
  });
};

// ==========================================
// --- FICHAJES ---
// ==========================================

/**
 * Listar fichajes con filtros opcionales (idUsuario, fechaInicio, fechaFin)
 */
const getFichajes = (idUsuario, fechaInicio, fechaFin) => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT * FROM Fichajes WHERE 1=1';
    const params = [];

    if (idUsuario) {
      sql += ' AND IdUsuario = ?';
      params.push(idUsuario);
    }
    if (fechaInicio) {
      sql += ' AND FechaHoraEntrada >= ?';
      params.push(fechaInicio);
    }
    if (fechaFin) {
      sql += ' AND FechaHoraEntrada <= ?';
      params.push(fechaFin);
    }

    db.query(sql, params, (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al consultar fichajes' });
      resolve(results);
    });
  });
};

/**
 * Registrar entrada de fichaje
 */
const addFichaje = (body) => {
  return new Promise((resolve, reject) => {
    const { FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud } = body;
    const sql = `
      INSERT INTO Fichajes (FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) 
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [FechaHoraEntrada || new Date(), IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al registrar fichaje' });
      resolve({ IdFichaje: results.insertId, message: 'Fichaje de entrada registrado' });
    });
  });
};

/**
 * Registrar salida de fichaje (cerrar fichaje)
 */
const updateFichaje = (id, body) => {
  return new Promise((resolve, reject) => {
    const { FechaHoraSalida, HorasTrabajadas } = body;
    const sql = 'UPDATE Fichajes SET FechaHoraSalida = ?, HorasTrabajadas = ? WHERE IdFichaje = ?';
    db.query(sql, [FechaHoraSalida || new Date(), HorasTrabajadas || 0, id], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al cerrar fichaje' });
      resolve({ message: 'Fichaje cerrado correctamente' });
    });
  });
};

/**
 * Obtener si existe un fichaje activo en las últimas 12 horas para un usuario
 */
const getFichajeActivo = (idUsuario) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM Fichajes 
      WHERE IdUsuario = ? 
        AND FechaHoraSalida IS NULL 
        AND FechaHoraEntrada >= NOW() - INTERVAL 12 HOUR 
      ORDER BY IdFichaje DESC LIMIT 1
    `;
    db.query(sql, [idUsuario], (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al consultar fichaje activo' });
      resolve(results.length > 0 ? results[0] : {});
    });
  });
};

// ==========================================
// --- APIKEY ---
// ==========================================

/**
 * Consultar ApiKeys
 */
const getApiKeys = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT idKey, `Key` FROM ApiKey';
    db.query(sql, (err, results) => {
      if (err) return reject({ code: 500, message: 'Error al obtener ApiKeys' });
      resolve(results);
    });
  });
};

module.exports = {
  getUsuarios,
  addUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  getTrabajos,
  addTrabajo,
  getTrabajoById,
  updateTrabajo,
  deleteTrabajo,
  getFichajes,
  addFichaje,
  updateFichaje,
  getFichajeActivo,
  getApiKeys,
};