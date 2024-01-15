const {Router} = require('express')
const {check} = require ('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const {ConsultaChatGPT} = require("../controllers/estudiante")

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );



router.post('/consulta',ConsultaChatGPT)





module.exports = router