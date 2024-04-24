const {Router} = require('express')
const {check} = require ('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const {GetDataAlumnos,AgregarEjercicio,ObtenerEjercicio,ObtenerEjercicioTag, ObtenerRendimientoEjercicio,EliminarEjercicioPropuesto,CrearCuentas} = require("../controllers/profesor")

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


router.post('/dataAlumnos',GetDataAlumnos)
router.post('/ejercicios/agregar',AgregarEjercicio)
router.post('/ejercicios/rendimiento',ObtenerRendimientoEjercicio)
router.post('/ejercicios',ObtenerEjercicio)
router.post('/ejercicios/tag',ObtenerEjercicioTag)
router.post('/ejercicios/eliminar',EliminarEjercicioPropuesto)
router.post('/crearcuentas',CrearCuentas)









module.exports = router