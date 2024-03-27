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
    Respuesta: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    Tags: {
        type: [String], 
        required: true
    },
    Date: {
        type: Date,
        default: () => new Date(new Date().getTime() - (4 * 60 * 60 * 1000))
    }
});


module.exports = model('EjerciciosPropuesto', EjerciciosPropuestoSchema );
