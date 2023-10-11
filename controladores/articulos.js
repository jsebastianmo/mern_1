const Articulo = require("./../modelos/Articulo");
const validator = require("validator");
const fs = require("fs");
const path = require("path");

const crear = async (req, res) => {
    const parametros = req.body;
    try {
        const validacion_titulo = validator.isEmpty(parametros.titulo) || !validator.isLength(parametros.titulo, {min: 5, max: 25});
        const validacion_contenido = validator.isEmpty(parametros.contenido) || !validator.isLength(parametros.contenido, {min: 5, max: 50});

        if(validacion_titulo || validacion_contenido){
            return res.status(400).json({
                status: "error",
                mensaje: "No se encuentran los datos completos"
            })
        }
        const articulo = new Articulo(req.body);
        const nuevoArticulo = await articulo.save();

        if(!nuevoArticulo){
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha podido guardar el artículo"
            })
        }

        return res.status(200).json({
            status: "success",
            mensaje: "artículo guardado correctamente",
            articulo: nuevoArticulo
        })
    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha podido guardar el artículo"
        })
    }
}

const listar = async (req, res) =>{
    const limite = req.params.limite;
    try {
        let articulos = await Articulo.find().sort({fecha: -1});

        if(limite){
            articulos = await Articulo.find().sort({fecha: -1}).limit(limite);
        }

        if(!articulos){
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha podido obtener los artículos"
            })
        }

        return res.status(200).json({
            status: "success",
            articulos
        })

    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha podido realizar la operación"
        })
    }
}

const uno = async (req, res) =>{
    const id = req.params.id;
    try {
        let articulo = await Articulo.findById({_id: id});
        if(!articulo){
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo"
            })
        }
        return res.status(200).json({
            status: "success",
            articulo
        })
    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha podido realizar la operación"
        })
    }
}

const eliminar = async (req, res) =>{
    const id = req.params.id;
    try {
        const articulo = await Articulo.findOneAndDelete({_id: id});
        if(!articulo){
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo"
            })
        }
        return res.status(200).json({
            status: "success",
            articulo
        })
    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha podido realizar la operación"
        })
    }
}

const editar = async (req, res) =>{
    const id = req.params.id;
    const parametros = req.body;
    try {
        const validacion_titulo = validator.isEmpty(parametros.titulo) || !validator.isLength(parametros.titulo, {min: 5, max: 25});
        const validacion_contenido = validator.isEmpty(parametros.contenido) || !validator.isLength(parametros.contenido, {min: 5, max: 50});

        if(validacion_titulo || validacion_contenido){
            return res.status(400).json({
                status: "error",
                mensaje: "No se encuentran los datos completos"
            })
        }
        const articulo = await Articulo.findOneAndUpdate({_id: id}, req.body, { new: true });
        if(!articulo){
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo"
            })
        }
        return res.status(200).json({
            status: "success",
            articulo
        })
    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha podido realizar la operación"
        })
    }
}

const subir = async (req, res) =>{
    const id = req.params.id;
    const extension = req.file.originalname.split("\.")[1];
    if(extension != 'jpg' && extension != 'jpeg' && extension != 'png' && extension != 'gif'){
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Formato de imagen incorrecto"
            })
        })
    }
    try {
        const articulo = await Articulo.findOneAndUpdate({_id: id}, { imagen: req.file.filename}, { new: true });
        if(!articulo){
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado el artículo"
            })
        }
        return res.status(200).json({
            status: "success",
            articulo
        })
    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha podido realizar la operación"
        })
    }
}

const fichero = async (req, res) =>{
    const fichero = req.params.fichero;
    const ruta = "./imagenes/articulos/" + fichero;
    fs.stat(ruta, (error, existe) => {
        if(existe){
            return res.sendFile(path.resolve(ruta));
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "Imagen no encontrada"
            })
        }
    }) 
}

const buscador = async (req, res) => {
    const { texto } = req.params;

    try {
        const articulo = await Articulo.find({ "$or": [
            { "titulo": { "$regex": texto, "$options": "i" } },
            { "contenido": { "$regex": texto, "$options": "i" } }
        ]}).sort({fecha: -1})
        if(!articulo || articulo.length <= 0){
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado coincidencias"
            })
        }
        return res.status(200).json({
            status: "success",
            articulo
        })
    } catch (error) {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha podido realizar la operación"
        })
    }
}

module.exports = {
    crear,
    listar,
    uno,
    eliminar,
    editar,
    subir,
    fichero,
    buscador
}