'use strict';
const express = require('express');
const { Sequelize } = require('sequelize');
const { User, Bootcamp, Users_Bootcamps } = require('./models');
const userController = require('./controllers/user.controller');
const bootcampController = require('./controllers/bootcamp.controller');
const userBootcampController = require('./controllers/userBootcamp.controller');
const authController = require('./controllers/auth.controller');
const { verifyToken, checkDuplicateEmail } = require('./middleware');

const app = express();
const port = 3000;

app.use(express.json()); // Middleware para parsear JSON en las solicitudes

// Rutas de autenticación
app.post('/api/signup', checkDuplicateEmail, authController.signup);
app.post('/api/signin', authController.signin);

// Rutas para usuarios
app.post('/users', userController.createUser);
app.get('/users', userController.findAll);
app.get('/users/:id', userController.findUserById);
app.put('/users/:id', userController.updateUserById);
app.delete('/users/:id', userController.deleteUserById);
app.get('/users/:id/bootcamps', userController.findUserByIdWithBootcamps);
app.get('/users/bootcamps', userController.findAllUsersWithBootcamps);

// Rutas para bootcamps
app.post('/bootcamps', bootcampController.createBootcamp);
app.get('/bootcamps', bootcampController.findAll);
app.get('/bootcamps/:id', bootcampController.findById);
app.get('/bootcamps/:id/users', bootcampController.findBootcampByIdWithUsers);
app.get('/bootcamps/users', bootcampController.findAllBootcampsWithUsers);

// Rutas para agregar usuarios a bootcamps
app.post('/bootcamps/:bootcampId/users/:userId', userBootcampController.addUserToBootcamp);

// Rutas protegidas
app.get('/api/user/:id', verifyToken, userController.findUserById);
app.get('/api/user', verifyToken, userController.findAllUsersWithBootcamps);
app.put('/api/user/:id', verifyToken, userController.updateUserById);
app.delete('/api/user/:id', verifyToken, userController.deleteUserById);
app.post('/api/bootcamp', verifyToken, bootcampController.createBootcamp);
app.post('/api/bootcamp/adduser', verifyToken, userBootcampController.addUserToBootcamp);
app.get('/api/bootcamp/:id', verifyToken, bootcampController.findBootcampByIdWithUsers);

// Rutas públicas
app.get('/api/bootcamp', bootcampController.findAll);

// Conectar a la base de datos
const sequelize = new Sequelize('postgres://postgres:2024@localhost:5432/db_bootcamp');

sequelize.authenticate().then(() => {
    console.log('Conexión a la base de datos exitosa.');
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}).catch(error => {
    console.error('No se pudo conectar a la base de datos:', error);
});



