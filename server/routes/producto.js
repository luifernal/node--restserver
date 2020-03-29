const express = require('express');

const  { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


// =============================
//  Obtener todos los productos
// =============================

app.get('/producto', verificaToken, (req, res) =>{

    // trae todos los productos
    // populate: usuario Categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
    .skip(desde)   
    .limit(limite)
    .sort('categoria')
    .populate('usuario', 'nombre email')
    .populate( 'categoria', 'descripcion' )
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });

});

// =============================
//  Obtener un producto por ID
// =============================

app.get('/producto/:id', verificaToken, (req, res) =>{

    // trae un producto
    // populate: usuario Categoria
    let id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate( 'categoria', 'descripcion' )
        .exec((err, productoDB ) => {
            
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    } );
    
});
 
// =============================
//  Buscar productos 
// =============================

app.get('/producto/buscar/:termino', verificaToken, (req, res) =>{

    let termino = req.params.termino;

    // definicion de una expresion regular
    let regex = new RegExp(termino, 'i'); // la 'i' es para que no sea sensible a mayusculas y minis

    Producto.find({nombre: regex})
    .populate('usuario', 'nombre email')
    .populate( 'categoria', 'descripcion' )
        .exec((err, productos ) => {
            
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (productos.length === 0) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Ningun producto fue encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productos
        });
    } );
    
});



// =============================
//  Crear un producto 
// =============================

app.post('/producto', verificaToken, (req, res) =>{

    // Grabar el usuario
    // Grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        nombre: body.nombre,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err,productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
    
});

// =============================
//  Actualizar un producto 
// =============================

app.put('/producto/:id', verificaToken, (req, res) =>{

    // Grabar el usuario
    // Grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    let actProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        nombre: body.nombre,
        categoria: body.categoria,
        usuario: req.usuario._id
    };

    Producto.findByIdAndUpdate( id, actProducto,  { new: true, runValidators: true, useFindAndModify: false }, (err, productoDB ) => {
            
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        });
    } );
       
    
});



// =============================
//  Borrar un producto 
// =============================

app.delete('/producto/:id', verificaToken, (req, res) =>{

    // disponible pasa a falso
    let id = req.params.id;
        
    Producto.findByIdAndUpdate( id, {disponible: false},  { new: true, runValidators: true, useFindAndModify: false }, (err, productoDB ) => {
            
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        });
    } ); 
    
});

module.exports = app;