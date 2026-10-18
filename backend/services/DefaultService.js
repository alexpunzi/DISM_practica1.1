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
 * Actualizar Usuario
 */
const updateUsuario = (...args) => {
  return new Promise((resolve, reject) => {
    // 1. Extraer ID
    let idReal = args[0];
    if (typeof idReal === 'object' && idReal !== null) {
      idReal = idReal.idUsuario || idReal.idusuario || idReal.id || idReal.value || Object.values(idReal)[0];
    }

    // 2. Desempaquetar el objeto con los datos (busca en arg.value, arg.body o arg directo)
    let datos = {};
    args.forEach(arg => {
      if (typeof arg === 'object' && arg !== null) {
        if (arg.value && typeof arg.value === 'object') datos = { ...datos, ...arg.value };
        else if (arg.body && typeof arg.body === 'object') datos = { ...datos, ...arg.body };
        else datos = { ...datos, ...arg };
      }
    });

    const Nombre = datos.Nombre || datos.nombre;
    const Usuario = datos.Usuario || datos.usuario;
    const Clave = datos.Clave || datos.clave;

    console.log('✏️ Petición UPDATE Usuario procesada:', { idReal, Nombre, Usuario, Clave });

    if (!idReal || isNaN(Number(idReal))) {
      return reject({ code: 400, message: 'ID de usuario no válido' });
    }

    // Protección: impedir que se envíen datos vacíos a MySQL
    if (!Nombre || !Usuario) {
      console.error('❌ Error: Nombre o Usuario no recibidos. Se cancela el UPDATE para proteger la BD.');
      return reject({ code: 400, message: 'Nombre y Usuario son obligatorios' });
    }

    const sql = 'UPDATE usuarios SET Nombre = ?, Usuario = ?, Clave = ? WHERE IdUsuario = ?';
    db.query(sql, [Nombre, Usuario, Clave || '', Number(idReal)], (err, results) => {
      if (err) {
        console.error('❌ Error SQL en updateUsuario:', err.message);
        return reject({ code: 500, message: 'Error al actualizar usuario' });
      }
      console.log(`✅ Usuario ID ${idReal} actualizado con éxito`);
      resolve({ message: 'Usuario actualizado con éxito' });
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
 * Actualizar Trabajo
 */
const updateTrabajo = (...args) => {
  return new Promise((resolve, reject) => {
    // 1. Extraer ID
    let idReal = args[0];
    if (typeof idReal === 'object' && idReal !== null) {
      idReal = idReal.idTrabajo || idReal.idtrabajo || idReal.id || idReal.value || Object.values(idReal)[0];
    }

    // 2. Desempaquetar el objeto con los datos
    let datos = {};
    args.forEach(arg => {
      if (typeof arg === 'object' && arg !== null) {
        if (arg.value && typeof arg.value === 'object') datos = { ...datos, ...arg.value };
        else if (arg.body && typeof arg.body === 'object') datos = { ...datos, ...arg.body };
        else datos = { ...datos, ...arg };
      }
    });

    const Nombre = datos.Nombre || datos.nombre;

    console.log('✏️ Petición UPDATE Trabajo procesada:', { idReal, Nombre });

    if (!idReal || isNaN(Number(idReal))) {
      return reject({ code: 400, message: 'ID de trabajo no válido' });
    }

    // Protección: impedir actualizar sin nombre
    if (!Nombre) {
      console.error('❌ Error: El nombre del trabajo viene vacío. Se cancela el UPDATE.');
      return reject({ code: 400, message: 'El Nombre del trabajo es obligatorio' });
    }

    const sql = 'UPDATE trabajos SET Nombre = ? WHERE IdTrabajo = ?';
    db.query(sql, [Nombre, Number(idReal)], (err, results) => {
      if (err) {
        console.error('❌ Error SQL en updateTrabajo:', err.message);
        return reject({ code: 500, message: 'Error al actualizar trabajo' });
      }
      console.log(`✅ Trabajo ID ${idReal} actualizado con éxito`);
      resolve({ message: 'Trabajo actualizado con éxito' });
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

/**
 * Obtener listado de fichajes con filtros opcionales
 */
const getFichajes = (...args) => {
  return new Promise((resolve, reject) => {
    console.log('📦 Argumentos brutos recibidos en getFichajes:', args);

    // Unificar todos los argumentos u objetos en un solo diccionario para buscar parametros
    let paramsObj = {};
    args.forEach(arg => {
      if (typeof arg === 'object' && arg !== null) {
        paramsObj = { ...paramsObj, ...arg };
      }
    });

    // 1. Extraer ID de usuario (primer argumento o clave)
    let idUsr = args[0];
    if (typeof idUsr === 'object' && idUsr !== null) {
      idUsr = idUsr.idUsuario || idUsr.idusuario || idUsr.value || Object.values(idUsr)[0];
    }

    // 2. Extraer Fecha Inicio buscando cualquier variación de nombre
    let fInicioRaw = args[1] || paramsObj.fechaInicio || paramsObj.fechainicio || paramsObj.fecha_inicio || paramsObj.FechaInicio;
    if (typeof fInicioRaw === 'object' && fInicioRaw !== null && !(fInicioRaw instanceof Date)) {
      fInicioRaw = fInicioRaw.value || fInicioRaw.fechaInicio || Object.values(fInicioRaw)[0];
    }

    // 3. Extraer Fecha Fin buscando cualquier variación de nombre
    let fFinRaw = args[2] || paramsObj.fechaFin || paramsObj.fechafin || paramsObj.fecha_fin || paramsObj.FechaFin;
    if (typeof fFinRaw === 'object' && fFinRaw !== null && !(fFinRaw instanceof Date)) {
      fFinRaw = fFinRaw.value || fFinRaw.fechaFin || Object.values(fFinRaw)[0];
    }

    // Helper para normalizar cualquier fecha a formato YYYY-MM-DD
    const normalizarFecha = (val) => {
      if (!val) return null;
      if (val instanceof Date) {
        const y = val.getFullYear();
        const m = String(val.getMonth() + 1).padStart(2, '0');
        const d = String(val.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
      if (typeof val === 'string' && val.trim() !== '') {
        return val.split('T')[0].trim();
      }
      return null;
    };

    const fInicio = normalizarFecha(fInicioRaw);
    const fFin = normalizarFecha(fFinRaw);

    console.log('🔎 Filtros procesados en Backend:', { idUsr, fInicio, fFin });

    // 4. Construcción dinámica de la consulta SQL
    let sql = `
      SELECT f.IdFichaje, f.IdUsuario, f.IdTrabajo, f.FechaHoraEntrada, f.FechaHoraSalida, 
             f.HorasTrabajadas, f.GeolocalizacionLatitud, f.GeolocalizacionLongitud,
             u.Nombre AS NombreUsuario, t.Nombre AS NombreTrabajo
      FROM fichajes f
      LEFT JOIN usuarios u ON f.IdUsuario = u.IdUsuario
      LEFT JOIN trabajos t ON f.IdTrabajo = t.IdTrabajo
      WHERE 1=1
    `;
    const params = [];

    // Filtro por ID de Usuario
    if (idUsr !== undefined && idUsr !== null && idUsr !== '' && !isNaN(Number(idUsr))) {
      sql += ' AND f.IdUsuario = ?';
      params.push(Number(idUsr));
    }

    // Filtro por Fecha Inicio
    if (fInicio) {
      sql += ' AND DATE(f.FechaHoraEntrada) >= ?';
      params.push(fInicio);
    }

    // Filtro por Fecha Fin
    if (fFin) {
      sql += ' AND DATE(f.FechaHoraEntrada) <= ?';
      params.push(fFin);
    }

    sql += ' ORDER BY f.FechaHoraEntrada DESC';

    console.log('📜 Query ejecutada:', sql, params);

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('❌ Error SQL en getFichajes:', err.message);
        return reject({ code: 500, message: 'Error al consultar fichajes' });
      }
      console.log(`✅ Fichajes devueltos (${results.length} registros)`);
      resolve(results);
    });
  });
};

/**
 * Crear un nuevo fichaje (Fichar Entrada)
 */
const addFichaje = (body) => {
  return new Promise((resolve, reject) => {
    const datos = (body && body.body) ? body.body : body;
    const { IdUsuario, IdTrabajo, GeolocalizacionLatitud, GeolocalizacionLongitud } = datos || {};

    const sql = `
      INSERT INTO fichajes (IdUsuario, IdTrabajo, FechaHoraEntrada, GeolocalizacionLatitud, GeolocalizacionLongitud) 
      VALUES (?, ?, NOW(), ?, ?)
    `;
    db.query(sql, [IdUsuario, IdTrabajo, GeolocalizacionLatitud || null, GeolocalizacionLongitud || null], (err, results) => {
      if (err) {
        console.error('❌ Error SQL en addFichaje:', err.message);
        return reject({ code: 500, message: 'Error al crear fichaje' });
      }
      resolve({ IdFichaje: results.insertId, message: 'Fichaje iniciado con éxito' });
    });
  });
};

/**
 * Obtener fichaje activo de un usuario (FechaHoraSalida IS NULL)
 */
const getFichajeActivo = (idUsuario) => {
  return new Promise((resolve, reject) => {
    const idReal = (typeof idUsuario === 'object' && idUsuario !== null) 
      ? (idUsuario.idUsuario || Object.values(idUsuario)[0]) 
      : idUsuario;

    const sql = 'SELECT * FROM fichajes WHERE IdUsuario = ? AND FechaHoraSalida IS NULL ORDER BY IdFichaje DESC LIMIT 1';
    db.query(sql, [idReal], (err, results) => {
      if (err) {
        console.error('❌ Error SQL en getFichajeActivo:', err.message);
        return reject({ code: 500, message: 'Error al consultar fichaje activo' });
      }
      resolve(results[0] || null);
    });
  });
};

/**
 * Actualizar/Cerrar un fichaje (Fichar Salida)
 */
const updateFichaje = (id, body) => {
  return new Promise((resolve, reject) => {
    const idReal = (typeof id === 'object' && id !== null) 
      ? (id.id || id.IdFichaje || Object.values(id)[0]) 
      : id;

    const sql = `
      UPDATE fichajes 
      SET FechaHoraSalida = NOW(),
          HorasTrabajadas = TIMESTAMPDIFF(HOUR, FechaHoraEntrada, NOW())
      WHERE IdFichaje = ?
    `;
    db.query(sql, [idReal], (err, results) => {
      if (err) {
        console.error('❌ Error SQL en updateFichaje:', err.message);
        return reject({ code: 500, message: 'Error al cerrar fichaje' });
      }
      resolve({ message: 'Fichaje cerrado con éxito' });
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