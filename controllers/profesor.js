const {response} = require('express')
const openAI = require("openai");
const {
    consulta_plantilla,
} = require("../data/plantillas");
const EjerciciosPropuesto = require("../models/EjerciciosPropuesto");
const Usuario = require('../models/Usuario')



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
            // model: "gpt-4",
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.5,
        });

    const lista_problemas= JSON.parse(respuesta.choices[0].message.content)
    


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

        const RespDB = await EjerciciosPropuesto.find();
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


module.exports={
    GetDataAlumnos,
    AgregarEjercicio,
    ObtenerEjercicio,
    ObtenerEjercicioTag
}