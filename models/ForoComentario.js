
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
    }
});


module.exports = model('ForoComentario', ForoComentarioSchema );
