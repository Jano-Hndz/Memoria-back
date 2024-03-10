const { Schema, model } = require('mongoose');

const ConsultaSchema = Schema({
    Usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    Problema: {
        type: String,
        required: true
    },
    Respuesta: {
        type: String,
        required: true
    },
});


module.exports = model('Consulta', ConsultaSchema );
