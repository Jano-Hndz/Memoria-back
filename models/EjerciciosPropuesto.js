const { Schema, model } = require('mongoose');

const EjerciciosPropuestoSchema = Schema({
    Usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    Titulo: {
        type: String,
        required: true
    },
    Problema: {
        type: String,
        required: true
    },
    Respuesta: {
        type: String,
        required: true
    },
    Tags: {
        type: [String], // Esto define un arreglo de strings
        required: true
    }
});


module.exports = model('EjerciciosPropuesto', EjerciciosPropuestoSchema );
