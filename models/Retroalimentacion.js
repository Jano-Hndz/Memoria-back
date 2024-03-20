const { Schema, model } = require('mongoose');

const RetroalimentacionSchema = Schema({
    Usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    Consulta: {
        type: Schema.Types.ObjectId,
        ref: 'Consulta',
        required: false
    },
    Titulo: {
        type: String,
        required: true
    },
    RespuestaEstudiante: {
        type: Schema.Types.Mixed,
        required: true
    },
    RespuestaLLM: {
        type: String,
        required: true
    },
    EJ: {
        type: Boolean,
        default: false
    }
});


module.exports = model('Retroalimentacion', RetroalimentacionSchema );
