const {Router} = require('express')
const {check} = require ('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const {GetDataAlumnos,AgregarEjercicio,ObtenerEjercicio,ObtenerEjercicioTag,ActivarCuentas, ObtenerRendimientoEjercicio,EliminarEjercicioPropuesto,CrearCuentas,CrearCuentasHistorial,DesactivarCuentas} = require("../controllers/profesor")
const multer = require('multer');
const path = require('path');


const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);

},
});

const upload = multer({ storage: storage });

router.post('/dataAlumnos',GetDataAlumnos)
router.post('/ejercicios/agregar',AgregarEjercicio)
router.post('/ejercicios/rendimiento',ObtenerRendimientoEjercicio)
router.post('/ejercicios',ObtenerEjercicio)
router.post('/ejercicios/tag',ObtenerEjercicioTag)
router.post('/ejercicios/eliminar',EliminarEjercicioPropuesto)
router.post('/crearcuentas',upload.single('file'),CrearCuentas)
router.post('/crearcuentas/historial',CrearCuentasHistorial)
router.post('/cuentas/desactivar',DesactivarCuentas)
router.post('/cuentas/activar',ActivarCuentas)











module.exports = router