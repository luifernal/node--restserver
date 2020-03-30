
const express = require('express');
const fs = require('fs');

const app = express();



const fileUpload = require('express-fileupload');

let  { verificaTokenImg } = require('../middlewares/autenticacion');

const path = require('path');


const Usuario = require('../models/usuario');
const Producto = require('../models/producto');


app.get('/imagen/:tipo/:img', verificaTokenImg,  (req, res) =>{   //

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${img}`);

    
    
    if( fs.existsSync(pathImagen)){
        return res.sendFile(pathImagen);

    }else {
        let noImagePath = path.resolve(__dirname,'../assets/no-image.jpg')
        res.sendFile(noImagePath);
    }


});


module.exports = app;