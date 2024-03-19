const {response} = require('express')
const Foro = require("../models/Foro");
const Retroalimentacion = require("../models/Retroalimentacion");
const Consulta = require("../models/Consulta");
const Usuario = require('../models/Usuario')
const ForoComentario = require("../models/ForoComentario")


const PublicarForo=async(req,res=response)=>{

    try {
        const ForoNEW = new Foro({
            ...req.body,
            Usuario: req.uid
        })

        const RespDB = await ForoNEW.save()

        res.json({
            ok: true,
            id:RespDB._id
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
}


const GetForo=async(req,res=response)=>{

    try {
        const respDB = await Foro.find();
        let respuesta=[]

        for (const elemento of respDB) {
            let respuestaUsuario = await Usuario.findById(elemento.Usuario);
            respuesta.push({
                ...elemento._doc,
                Usuario:respuestaUsuario.name
            })
        }

        res.json({
            ok: true,
            data:respuesta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
}

const GetRetroalimentacion=async(req,res=response)=>{

    try {
        let respRetroalimentacion = await Retroalimentacion.findById(req.body.RetroalimentacionID);
        let respConsulta=await Consulta.findById(respRetroalimentacion.Consulta)

        const respuesta = {
            inputs: respRetroalimentacion.RespuestaEstudiante,
            retroalimentacion:respRetroalimentacion.RespuestaLLM,
            lista_funciones: JSON.parse(respConsulta.Respuesta),
            problema: respConsulta.Problema,
        } 

        res.json({
            ok: true,
            data:respuesta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
}


const GetConsulta=async(req,res=response)=>{

    try {

        let respRetroalimentacion = await Retroalimentacion.findById(req.body.id_consulta);
        let respConsulta=await Consulta.findById(respRetroalimentacion.Consulta)


        res.json({
            ok: true,
            data:respConsulta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
}


const ComentarForo=async(req,res=response)=>{

    try {

        const ForoNEW = new ForoComentario({
            ...req.body,
            Usuario: req.uid
        })
        const RespDB = await ForoNEW.save()


        res.json({
            ok: true,
            id_comentario:RespDB._id
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
}

const GetComentarios=async(req,res=response)=>{

    try {

        const RespDB = await ForoComentario.find({ForoID:req.body.id_foro})

        let respuesta=[]

        for (const elemento of RespDB) {
            let respuestaUsuario = await Usuario.findById(elemento.Usuario);
            respuesta.push({
                ...elemento._doc,
                Usuario:respuestaUsuario.name
            })
        }

        res.json({
            ok: true,
            data:respuesta
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
}




module.exports={
    PublicarForo,
    GetForo,
    GetRetroalimentacion,
    ComentarForo,
    GetComentarios,
    GetConsulta
}