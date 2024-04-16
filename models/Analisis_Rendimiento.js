const { Schema, model } = require('mongoose');

const Analisis_RendimientoSchema = Schema({
    Usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    Retroalimentacion: {
        type: String,
        required: true
    },
    Topicos: [{
        type: Schema.Types.Mixed,
        required: true
    }],
    Date: {
        type: Date,
        default: () => new Date(new Date().getTime() - (4 * 60 * 60 * 1000))
    },
    EjercicioPropuestoID: {
        type: Schema.Types.ObjectId,
        ref: 'EjerciciosPropuesto',
        required: false
    },
});


module.exports = model('Analisis_Rendimiento', Analisis_RendimientoSchema );