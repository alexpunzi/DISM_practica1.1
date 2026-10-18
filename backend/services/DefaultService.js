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
    const sql = 'SELECT IdUsuario, Nombre, Usuario FROM usuarios';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ ERROR REAL EN GETUSUARIOS:', err); // <-- Imprime el error exacto
        return reject({ code: 500, message: 'Error al consultar usuarios' });
      }
      resolve(results);
    });
  });
};

/**
 * Crear un nuevo usuario
 */
const addUsuario = (body) => {
  return new Promise((resolve, reject) => {
    // Si OpenAPI envía los datos en body.body o directos en body:
    const datos = (body && body.body) ? body.body : body;
    const Nombre = datos?.Nombre || null;
    const Usuario = datos?.Usuario || null;
    const Clave = datos?.Clave || null;

    console.log('📩 Insertando usuario con datos:', { Nombre, Usuario, Clave });

    const sql = 'INSERT INTO usuarios (Nombre, Usuario, Clave) VALUES (?, ?, ?)';
    db.query(sql, [Nombre, Usuario, Clave], (err, results) => {
      if (err) {
        console.error('❌ Error SQL exacto en addUsuario:', err.message);
        return reject({ code: 500, message: 'Error al crear usuario' });
      }
      console.log('✅ Usuario creado con exito, ID:', results.insertId);
      resolve({ IdUsuario: results.insertId, Nombre, Usuario });
    });
  });
};

/**
 * Obtener usuario por ID
 */
const getUsuarioById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IdUsuario, Nombre, Usuario FROM usuarios WHERE IdUsuario = ?';
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
    const sql = 'UPDATE usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?';
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
    // Extraer el ID por si OpenAPI lo envía envuelto en un objeto
    const idReal = (typeof id === 'object' && id !== null) 
      ? (id.id || id.IdUsuario || id.idUsuario || Object.values(id)[0]) 
      : id;

    console.log('🗑️ Intentando eliminar usuario con ID:', idReal);

    const sql = 'DELETE FROM usuarios WHERE IdUsuario = ?';
    db.query(sql, [idReal], (err, results) => {
      if (err) {
        console.error('❌ Error SQL en deleteUsuario:', err.message);
        return reject({ code: 500, message: 'Error al eliminar usuario' });
      }
      
      console.log('📊 Filas eliminadas en MySQL:', results.affectedRows);
      
      if (results.affectedRows === 0) {
        console.warn('⚠️ No se encontró ningún usuario con ID:', idReal);
      } else {
        console.log('✅ Usuario eliminado con éxito de MySQL');
      }
      
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
    const sql = 'SELECT IdTrabajo, Nombre FROM trabajos';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ Error SQL en getTrabajos:', err.message);
        return reject({ code: 500, message: 'Error al consultar trabajos' });
      }
      resolve(results);
    });
  });
};

/**
 * Crear un nuevo trabajo
 */
const addTrabajo = (body) => {
  return new Promise((resolve, reject) => {
    // Desempaquetar el cuerpo por si OpenAPI lo engloba en body.body
    const datos = (body && body.body) ? body.body : body;
    const Nombre = datos?.Nombre || datos?.nombre || null;

    console.log('📩 Guardando trabajo:', { Nombre });

    const sql = 'INSERT INTO trabajos (Nombre) VALUES (?)';
    db.query(sql, [Nombre], (err, results) => {
      if (err) {
        console.error('❌ Error SQL en addTrabajo:', err.message);
        return reject({ code: 500, message: 'Error al crear trabajo' });
      }
      console.log('✅ Trabajo guardado con ID:', results.insertId);
      resolve({ IdTrabajo: results.insertId, Nombre });
    });
  });
};

/**
 * Obtener trabajo por ID
 */
const getTrabajoById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IdTrabajo, Nombre FROM trabajos WHERE IdTrabajo = ?';
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
    const datos = (body && body.body) ? body.body : body;
    const Nombre = datos?.Nombre || datos?.nombre || null;

    const sql = 'UPDATE trabajos SET Nombre = ? WHERE IdTrabajo = ?';
    db.query(sql, [Nombre, id], (err, results) => {
      if (err) {
        console.error('❌ Error SQL en updateTrabajo:', err.message);
        return reject({ code: 500, message: 'Error al actualizar trabajo' });
      }
      resolve({ message: 'Trabajo actualizado correctamente' });
    });
  });
};

/**
 * Eliminar un trabajo
 */
const deleteTrabajo = (id) => {
  return new Promise((resolve, reject) => {
    // Extraer el ID por si OpenAPI lo envía envuelto en un objeto
    const idReal = (typeof id === 'object' && id !== null) 
      ? (id.id || id.IdTrabajo || id.idTrabajo || Object.values(id)[0]) 
      : id;

    console.log('🗑️ Intentando eliminar trabajo con ID:', idReal);

    const sql = 'DELETE FROM trabajos WHERE IdTrabajo = ?';
    db.query(sql, [idReal], (err, results) => {
      if (err) {
        console.error('❌ Error SQL en deleteTrabajo:', err.message);
        return reject({ code: 500, message: 'Error al eliminar trabajo' });
      }

      console.log('📊 Filas eliminadas en MySQL:', results.affectedRows);

      if (results.affectedRows === 0) {
        console.warn('⚠️ No se encontró ningún trabajo con ID:', idReal);
      } else {
        console.log('✅ Trabajo eliminado con éxito de MySQL');
      }

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
    let sql = 'SELECT * FROM fichajes WHERE 1=1';
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
      INSERT INTO fichajes (FechaHoraEntrada, IdTrabajo, IdUsuario, GeolocalizacionLatitud, GeolocalizacionLongitud) 
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
    const sql = 'UPDATE fichajes SET FechaHoraSalida = ?, HorasTrabajadas = ? WHERE IdFichaje = ?';
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
      SELECT * FROM fichajes 
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
    const sql = 'SELECT idKey, `Key` FROM apikey';
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