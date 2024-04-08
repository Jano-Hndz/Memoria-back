const {Router} = require('express')
const {check} = require ('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const {ConsultaChatGPT,RevisionChatGPT, Historial,CrearProblema,HistorialPaginado} = require("../controllers/estudiante")
const {PublicarForo,GetForo,GetRetroalimentacion,ComentarForo,GetComentarios,GetConsulta} =  require("../controllers/Foro")

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


router.post('/crear',CrearProblema)
router.post('/consulta',ConsultaChatGPT)
router.post('/revision',RevisionChatGPT)
router.get('/historial',HistorialPaginado)
router.post('/foro/publicar',PublicarForo)
router.get('/foro/get',GetForo)
router.post('/foro/retroalimentacion',GetRetroalimentacion)
router.post('/foro/comentar',ComentarForo)
router.post('/foro/get',GetComentarios)
router.post('/foro/ejercicio',GetConsulta)








module.exports = router