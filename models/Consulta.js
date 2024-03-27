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
    Respuesta: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    Date: {
        type: Date,
        default: () => new Date(new Date().getTime() - (4 * 60 * 60 * 1000))
    }
});


module.exports = model('Consulta', ConsultaSchema );
