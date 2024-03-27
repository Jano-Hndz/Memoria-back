const { Schema, model } = require('mongoose');

const RetroalimentacionSchema = Schema({
    Usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    ConsultaID: {
        type: Schema.Types.ObjectId,
        ref: 'Consulta',
        required: false
    },
    EjercicioPropuestoID: {
        type: Schema.Types.ObjectId,
        ref: 'EjerciciosPropuesto',
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
        type: Schema.Types.Mixed,
        required: true
    },
    Propuesto: {
        type: Boolean,
        default: false
    },
    Date: {
        type: Date,
        default: () => new Date(new Date().getTime() - (4 * 60 * 60 * 1000))
    }
});


module.exports = model('Retroalimentacion', RetroalimentacionSchema );
