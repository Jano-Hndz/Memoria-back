const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    profesor_id:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    Estado: {
        type: Boolean,
        default: true
    },
    IDCreacionCuenta:{
        type: Schema.Types.ObjectId,
        ref: 'CreacionCuentas'
    }
});


module.exports = model('Usuario', UsuarioSchema );

