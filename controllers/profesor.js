const {response} = require('express')
const openAI = require("openai");
const {
    consulta_plantilla,
} = require("../data/plantillas");
const EjerciciosPropuesto = require("../models/EjerciciosPropuesto");
const Usuario = require('../models/Usuario')
const Retroalimentacion = require("../models/Retroalimentacion");



const openAIInstance = new openAI({
    apiKey: process.env.API_KEY_OPEAI,
});


const GetDataAlumnos=async(req,res=response)=>{

    

    res.json({  
        ok: true
    })
}

const AgregarEjercicio=async(req,res=response)=>{

    let consulta_enviar = consulta_plantilla({
        texto_1: req.body.Problema,
    });

    const respuesta = await openAIInstance.chat.completions.create({
            model: "gpt-4",
            model: "gpt-4-0125-preview",
            // model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.5,
        });


    let str=respuesta.choices[0].message.content
    let lista_problemas
    if (str.startsWith("```json")) {
        lista_problemas= JSON.parse(str.substring(7, str.length - 3))
    } else {
        lista_problemas= JSON.parse(str)
    
    }
    


    const EjerciciosPropuestoNEW = new EjerciciosPropuesto({
            Titulo:req.body.Titulo,
            Problema: req.body.Problema,
            Respuesta: lista_problemas,
            Usuario: req.uid,
            Tags:req.body.Tags
        });

        const RespDB = await EjerciciosPropuestoNEW.save();

        res.json({
            ok: true,
            resp: respuesta.choices[0].message.content,
            id_EjerciciosPropuesto: RespDB._id,
        });
}



const ObtenerEjercicio=async(req,res=response)=>{

        const RespDB = await EjerciciosPropuesto.find({Usuario:req.uid});
        let respuesta=[]

        for (const elemento of RespDB) {
            let respuestaUsuario = await Usuario.findById(elemento.Usuario);
            respuesta.push({
                ...elemento._doc,
                Nombre:respuestaUsuario.name
            })
        }


        res.json({
            ok: true,
            lista:respuesta
        });
}

const ObtenerEjercicioTag=async(req,res=response)=>{
    
    const RespDB = await EjerciciosPropuesto.find({ Tags: { $in: [req.body.Tag] } });
    let respuesta=[]

    for (const elemento of RespDB) {
        let respuestaUsuario = await Usuario.findById(elemento.Usuario);
        respuesta.push({
            ...elemento._doc,
            Nombre:respuestaUsuario.name
        })
    }


    res.json({
        ok: true,
        lista:respuesta
    });
}


const ObtenerRendimientoEjercicio=async(req,res=response)=>{

    
    const RespDB = await Retroalimentacion.find({EjercicioPropuestoID:req.body.EjercicioPropuestoID});

    let respuesta=[]
    for (const elemento of RespDB) {
        let respuestaUsuario = await Usuario.findById(elemento.Usuario);
        respuesta.push({
            ...elemento._doc,
            Nombre:respuestaUsuario.name
        })
    }


    res.json({
        ok: true,
        lista:respuesta
    });
}


module.exports={
    GetDataAlumnos,
    AgregarEjercicio,
    ObtenerEjercicio,
    ObtenerEjercicioTag,
    ObtenerRendimientoEjercicio
}