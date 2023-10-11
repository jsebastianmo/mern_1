const mongoose = require("mongoose");

const conexion = async () => {
    try {
        const uri = "mongodb://127.0.0.1:27017/mi_blog";
        await mongoose.connect(uri);
        console.log("Conectado a la base de datos");
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido establecer la conexión con la base de datos");
    }
}

module.exports = {
    conexion
}