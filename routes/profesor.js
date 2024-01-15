const {Router} = require('express')
const {check} = require ('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const {GetDataAlumnos} = require("../controllers/profesor")

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


router.get('/dataAlumnos',GetDataAlumnos)





module.exports = router