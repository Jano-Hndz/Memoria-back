const {Router} = require('express')
const {check} = require ('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const {ConsultaChatGPT,RevisionChatGPT, Historial} = require("../controllers/estudiante")
const {PublicarForo,GetForo,GetRetroalimentacion,ComentarForo,GetComentarios} =  require("../controllers/Foro")

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );



router.post('/consulta',ConsultaChatGPT)
router.post('/revision',RevisionChatGPT)
router.get('/historial',Historial)
router.post('/foro/publicar',PublicarForo)
router.get('/foro/get',GetForo)
router.post('/foro/retroalimentacion',GetRetroalimentacion)
router.post('/foro/comentar',ComentarForo)
router.post('/foro/get',GetComentarios)







module.exports = router