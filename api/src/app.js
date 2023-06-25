const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const cors = require("cors");

//autenticacion
const passport = require("passport")
const session = require('express-session')




require('./db.js');

const server = express();

server.name = 'DevPool Soft';

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(cors());
server.use(morgan('dev'));

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

//inicializamos passport
// app.set('trust proxy', 1) // descomentar esto 
// en https trust first proxy
passport.use(session({
  secret: 'misecreto que debe ir en variable de entorno',
  resave: false,
  saveUninitialized: true,
  //poner cookie en true cunado estemos en https
  cookie: { secure: false },
}))

// server.use(connect.session())
server.use(passport.initialize())
server.use(passport.session())



server.use('/', routes);

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
