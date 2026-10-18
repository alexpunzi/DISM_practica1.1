/*
 * ============================================================================
 * UNIVERSIDAD DE ALICANTE - Ingeniería Multimedia
 * DISM (Dispositivos e Infraestructura de Sistemas Multimedia)
 * Práctica 1: Backend API
 * 
 * Archivo: utils/db.js
 * Descripción: Configuración de conexión mediante Pool de MySQL (mysql2).
 * ============================================================================
 */

const mysql = require('mysql2');

// Crear pool de conexiones reutilizables
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Si configuraste clave en XAMPP, ponla aquí
  database: 'api_dism',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Comprobar la conexión inicial con la base de datos
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos MySQL:', err.message);
  } else {
    console.log('✅ Conexión con la base de datos MySQL (Pool) establecida con éxito');
    connection.release(); // Liberar conexión de prueba de vuelta al pool
  }
});

module.exports = db;