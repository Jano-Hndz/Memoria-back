
const { Schema, model } = require('mongoose');

const ForoComentarioSchema = Schema({
    Usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false
    },
    ForoID: {
        type: Schema.Types.ObjectId,
        ref: 'Foro',
        required: true
    },
    Comentario: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: () => new Date(new Date().getTime() - (4 * 60 * 60 * 1000))
    }
});


module.exports = model('ForoComentario', ForoComentarioSchema );
