const jwt = require('jsonwebtoken');


// ===================
// Verificar Token
// ===================
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();

    })

};


// ===================
// Verificar admin role
// ===================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (!(req.usuario.role === 'ADMIN_ROLE')) {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'el usuario no es administrador'
            }
        });
    }

    next();


};

// =================================
// Verifica token para imagenes
// =================================


let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido',
                    err
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    })

    // next();


};


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}