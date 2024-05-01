const { Schema, model } = require('mongoose');

const CreacionCuentasSchema = Schema({
    profesor_id:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    Date: {
        type: Date,
        default: () => new Date(new Date().getTime() - (4 * 60 * 60 * 1000))
    },
    Estado: {
        type: Boolean,
        default: true
    }
});


module.exports = model('CreacionCuentas', CreacionCuentasSchema );
