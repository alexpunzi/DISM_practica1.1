/*
 * ============================================================================
 * UNIVERSIDAD DE ALICANTE - Ingeniería Multimedia
 * DISM (Dispositivos e Infraestructura de Sistemas Multimedia)
 * Práctica 1: API Registro Horario
 * 
 * Archivo: db.js
 * Descripción: Módulo de conexión a la base de datos MySQL (api_dism) mediante mysql2.
 * ============================================================================
 */

const mysql = require ('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Por defecto en XAMPP está vacía
    database: 'api_dism'
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
    } else {
        console.log('Conectado con éxito a la base de datos MySQL (api_dism)');
    }
});

module.exports = connection;