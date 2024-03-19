const { Schema, model } = require('mongoose');

const ForoSchema = Schema({
    Usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    RetroalimentacionID: {
        type: Schema.Types.ObjectId,
        ref: 'Retroalimentacion',
        required: true
    },
    Comentario: {
        type: String,
        required: true
    },
    verRetroalimentacion: {
        type: Boolean,
        default: true
    }
});


module.exports = model('Foro', ForoSchema );
