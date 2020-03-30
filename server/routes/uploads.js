const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


// uso del middleware
app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo=req.params.tipo;
    let id=req.params.id;

    if(!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploades.'
            }
        });
    }

    // validar tipos

    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){

        return res.status(400).json({
            ok: false,
            err: {
                message: 'los Tipos permitidos son  ' + tiposValidos.join(', '),
                tipo
            }
        });
    }



    let archivo= req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];
    
    // Extensiones permitidad
    let extensionesValidad = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidad.indexOf(extension) < 0){

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidad.join(', '),
                ext: extension
            }
        });
    }

    // cambiar nombre al archivo

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`,(err) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aqui, la imagen esta cargada
        if(tipo === "usuarios"){
                       
            imagenUsuario(id, res, nombreArchivo);
        }else if (tipo === "productos"){
            
            imagenProducto(id, res, nombreArchivo);
        }

    });

});








function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioBD) => {
        if(err){

            borraArchivo(nombreArchivo, 'usuarios' );

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !usuarioBD ){

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                }
            });
        }


        // este codigo es para eliminar la imagen existente 
        borraArchivo(usuarioBD.img, 'usuarios' );


        // guarda en base de datos el nombre de la nueva imagen
        usuarioBD.img= nombreArchivo;
        usuarioBD.save( (err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}









function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoBD) => {
        if(err){

            borraArchivo(nombreArchivo, 'productos' );

            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !productoBD ){

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            });
        }


        // este codigo es para eliminar la imagen existente 
        borraArchivo(productoBD.img, 'productos' );


        // guarda en base de datos el nombre de la nueva imagen
        productoBD.img= nombreArchivo;
        productoBD.save( (err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}






function borraArchivo(nombreImagen, tipo){

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`);

        if( fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }

}


module.exports = app;