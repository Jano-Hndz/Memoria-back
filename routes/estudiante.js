const {Router} = require('express')
const {check} = require ('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const {ConsultaChatGPT,RevisionChatGPT,HistorialPaginado,ObtenerEjercicioPropuesto,Analisis_Rendimiento_Estudiante,GETRendimientoEstudiantes,Rendimiento_Estudiante,ObtenerEjercicioPropuestoTag} = require("../controllers/estudiante")
const {PublicarForo,GetForo,GetRetroalimentacion,ComentarForo,GetComentarios,GetConsulta} =  require("../controllers/Foro")

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


router.post('/consulta',ConsultaChatGPT)
router.post('/revision',RevisionChatGPT)
router.post('/historial',HistorialPaginado)
router.post('/rendimiento',Rendimiento_Estudiante)
router.post('/rendimiento/analisis',Analisis_Rendimiento_Estudiante)
router.post('/rendimiento/get',GETRendimientoEstudiantes)




router.post('/ejerciciospropuestos',ObtenerEjercicioPropuesto)
router.post('/ejerciciospropuestos/tag',ObtenerEjercicioPropuestoTag)


router.post('/foro/publicar',PublicarForo)
router.post('/foro/get',GetForo)
router.post('/foro/retroalimentacion',GetRetroalimentacion)
router.post('/foro/comentar',ComentarForo)
router.post('/foro/get',GetComentarios)
router.post('/foro/ejercicio',GetConsulta)








module.exports = router