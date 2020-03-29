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

process.env.CADUCIDAD_TOKEN = '48h';

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


// ===============
//  Google client ID
// ===============

process.env.CLIENT_ID = process.env.CLIENT_ID || '799971677683-k8tbq37join86d4o1ea2itpa9l4lh87g.apps.googleusercontent.com';