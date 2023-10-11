const { Router } = require("express");

const articuloControlador = require("./../controladores/articulos");

const router = Router();
const multer = require("multer");

const almacenamiento = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./imagenes/articulos/");
    },
    filename: function(req, file, cb){
        cb(null, "articulos" + Date.now() + file.originalname);
    }
})

const subida = multer({storage: almacenamiento});

//crear articulos
router.post("/crear", articuloControlador.crear);

//obtener articulos
router.get("/articulos/:limite?", articuloControlador.listar);

//obtener un solo articulo
router.get("/articulo/:id", articuloControlador.uno);

//eliminar artículo
router.delete("/articulo/:id", articuloControlador.eliminar);

//editar articulo
router.put("/articulo/:id", articuloControlador.editar);

//subir imagen
router.post("/subir-imagen/:id", subida.single("archivo"),articuloControlador.subir);

//ficher
router.get("/fichero/:fichero", articuloControlador.fichero);

//buscador
router.get("/buscador/:texto", articuloControlador.buscador);

module.exports = router;