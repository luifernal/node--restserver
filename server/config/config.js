// ===============
//  Puerto
// ===============
process.env.PORT = process.env.PORT || 3000;

// ===============
//  Entorno
// ===============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ===============
//  Vencimiento del token
// ===============

process.env.CADUCIDAD_TOKEN = '23h';

// ===============
//  SEED de autenticacion
// ===============

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ===============
//  Base de datos
// ===============

let urlBD;

if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLDB = urlBD;