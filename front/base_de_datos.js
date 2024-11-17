const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Configuración de conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1033490372',
    database: 'eventos_deportivos'
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conexión a MySQL exitosa.');
});

// Configurar sesión
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Middleware para analizar solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'static')));

// Ruta principal (Renderiza página de login/register)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/login-register.html'));
});

// Ruta para registro
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (username && email && password) {
        // Verificar si el correo ya existe
        connection.query('SELECT * FROM usuario WHERE Correo = ?', [email], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                res.send('El correo ya está registrado.');
            } else {
                // Insertar el nuevo usuario
                connection.query(
                    'INSERT INTO usuario (Nombre, Correo, Contrasenia) VALUES (?, ?, ?)',
                    [username, email, password],
                    (err) => {
                        if (err) throw err;
                        res.send('Usuario registrado exitosamente.');
                    }
                );
            }
        });
    } else {
        res.send('Por favor llena todos los campos.');
    }
});

// Ruta para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        // Verificar credenciales
        connection.query('SELECT * FROM usuario WHERE Correo = ? AND Contrasenia = ?', [email, password], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = results[0].Nombre; // Extraer el nombre del usuario
                res.redirect('/home');
            } else {
                res.send('Correo o contraseña incorrectos.');
            }
        });
    } else {
        res.send('Por favor llena todos los campos.');
    }
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
javascript