const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3000;

// Configura CORS para permitir solicitudes desde tu frontend
app.use(cors());

// Middleware para leer datos JSON en las solicitudes POST
app.use(express.json());

// Conectar a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',  // Tu host
  user: 'root',       // Tu usuario de base de datos
  password: '1033490372',  // Tu contraseña de base de datos
  database: 'mi_base_de_datos'  // Nombre de tu base de datos
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

// Endpoint para registrar un nuevo usuario
app.post('/register', (req, res) => {
  const { name, email, username, password } = req.body;

  // Verificar si los campos existen
  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Comprobar si ya existe el correo electrónico o el nombre de usuario
  const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
  connection.query(checkQuery, [email, username], (err, result) => {
    if (err) {
      console.error('Error al verificar usuario:', err);
      return res.status(500).json({ message: 'Error en la base de datos' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico o el nombre de usuario ya están en uso' });
    }

    // Insertar los datos del nuevo usuario
    const insertQuery = 'INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)';
    connection.query(insertQuery, [name, email, username, password], (err, result) => {
      if (err) {
        console.error('Error al insertar el usuario:', err);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
      }
      res.status(200).json({ message: 'Usuario registrado exitosamente' });
    });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});