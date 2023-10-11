const express = require("express");
const cors = require("cors");

const { conexion } = require("./database/conexion");
const articuloRutas = require("./rutas/articulos");

//creamos el servidor
const app = express();

//configuramos el puerto
app.set("port", process.env.PORT || 3000);

//Conexión a la base de datos
conexion();

//middleware
app.use(cors());

//convertimos body y urlencodes a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//rutas
app.use("/api", articuloRutas);

//levantamos el servidor
app.listen(app.get('port'), ()=>{
    console.log(`Servidor en el puerto: ${app.get('port')}`)
})