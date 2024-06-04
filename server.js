require('dotenv').config({ path: 'C:/Users/mason/OneDrive/Documentos/Trabajo pasantias/API-ESP01/.env' }); // Asegúrate de que esto está al principio para cargar las variables de entorno
console.log(process.env.DB_URI); // Esto imprimirá la URI de conexión a tu consola

const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const cors = require('cors');


// Crear la aplicación Express

const PORT = process.env.PORT || 3001;

// Middleware para parsear JSON y servir archivos estáticos
app.use(cors());

app.use(express.static('public'));
const userRoutes = require('../API-ESP01/routes/users'); // Rutas de tu proyecto ESP-
// URI de conexión a MongoDB del archivo .env
const mongoURI = process.env.DB_URI || 'mongodb://localhost:27017/ESP-01';

 // Conectar a MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Conexión a MongoDB exitosa'))
.catch(err => console.error('Error conectando a MongoDB', err));

// Evantos MongoDB connection
const db = mongoose.connection;

db.on('connected', () => {
    console.log('Mongoose la conexion esta abierta ', db.host + ":" + db.port + "/" + db.name);
});

db.on('error', (err) => {
    console.error('Mongoose error de conexion: ' + err);
});

db.on('disconnected', () => {
    console.log('Mongoose error de conexion -> esta desconectado');
});

process.on('SIGINT', function() {
    db.close(() => {
        console.log('Mongoose error de conexion -> esta deconectado para el uso de aplicacion');
        process.exit(0);
    });
});
// Routes
app.use('/api/users', userRoutes);
// Servidor iniciado
db.once('open', () => {
    // Solo se inicia si MongoDB esta conectado
    app.listen(PORT, '192.168.1.29', () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
});
