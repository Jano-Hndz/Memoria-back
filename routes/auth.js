const {Router} = require('express')
const {check} = require ('express-validator');
const {validarCampos} = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt');


const router=Router()

const {LoginUsuario,RevalidarToken,test}=require('../controllers/auth')



router.post('/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ]
    ,LoginUsuario)

router.get('/renew',validarJWT,RevalidarToken)

router.post('/test',test)





module.exports = router