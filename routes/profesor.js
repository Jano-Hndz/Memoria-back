const {Router} = require('express')
const {check} = require ('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const {GetDataAlumnos,AgregarEjercicio,ObtenerEjercicio} = require("../controllers/profesor")

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


router.get('/dataAlumnos',GetDataAlumnos)
router.post('/ejercicios/agregar',AgregarEjercicio)
router.post('/ejercicios',ObtenerEjercicio)






module.exports = router