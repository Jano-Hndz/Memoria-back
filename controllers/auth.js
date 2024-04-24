const {response} = require('express')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario')
const Retroalimentacion = require("../models/Retroalimentacion");



const CrearUsuarioEstudiante = async( { email, password,name,rol,profesor_id,IDCreacionCuenta } )=>{
    
    console.log(email);
    try {
        console.log(1);

        let usuario_re = await Usuario.findOne({ email });

        if ( usuario_re ) {
            console.log("user repetido");
            return ({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        console.log(2);
        const usuario=new Usuario({
            email,
            password,
            name,
            rol,
            profesor_id,
            IDCreacionCuenta
        })
        console.log(usuario);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        console.log(3);
        console.log(usuario);
        const resp = await usuario.save()
        console.log(4);
        console.log(resp);
        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        console.log(4);
        return ({
            ok:true,
            uid: usuario.id
            })

    } catch (error) {
        return ({
            ok:false
        })
    }
    
}

const LoginUsuario = async (req,res=response)=>{
    const { email, password } = req.body;

    try {
        
       
        // Desencriptar para poder comparar las constraseñas
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Desencriptar para poder comparar las constraseñas
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            rol:usuario.rol,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const RevalidarToken=async(req,res=response)=>{
    const { uid, name } = req;

    // Generar JWT
    const token = await generarJWT( uid, name );

    const usuarioObj = await Usuario.findById( uid );


    res.json({
        ok: true,
        uid, 
        name,
        rol: usuarioObj.rol,
        token
    })
}

const test=async(req,res=response)=>{

    const respDB = await Retroalimentacion.find({ Usuario: req.uid });
    
    for (const elemento of respDB) {
            

    }

    res.json({
        ok: true
    })
}



module.exports={
    CrearUsuarioEstudiante,
    LoginUsuario,
    RevalidarToken,
    test
}