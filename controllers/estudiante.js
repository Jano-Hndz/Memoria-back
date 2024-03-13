const { response } = require("express");
const openAI = require("openai");
const {
    consulta_plantilla,
    revision_plantilla,
} = require("../data/plantillas");
const Consulta = require("../models/Consulta");
const Retroalimentacion = require("../models/Retroalimentacion");

const openAIInstance = new openAI({
    apiKey: process.env.API_KEY_OPEAI,
});

const ConsultaChatGPT = async (req, res = response) => {
    try {
        console.log("Consulta");

        let consulta_enviar = consulta_plantilla({
            texto_1: req.body.consulta,
        });

        const respuesta = await openAIInstance.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.5,
        });

        const ConsultaNEW = new Consulta({
            Problema: req.body.consulta,
            Respuesta: respuesta.choices[0].message.content,
            Usuario: req.uid,
        });

        const RespDB = await ConsultaNEW.save();

        res.json({
            ok: true,
            resp: respuesta.choices[0].message.content,
            id_consulta: RespDB._id,
        });

        
        // const respuesta = `
        // [
        //     {
        //         "Nombre": "reemplazar_vocales",
        //         "Input": "Un string que incluye al menos una consonante y que puede contener también espacios y números.",
        //         "Output": "Un string con las vocales reemplazadas por números.",
        //         "Descripcion": "Esta función recibe un texto y reemplaza las vocales por los números correspondientes (a->4, e->3, i->1, o->0), sin importar mayúsculas o minúsculas."
        //     },
        //     {
        //         "Nombre": "primer_letra_minuscula",
        //         "Input": "Un string con las vocales reemplazadas por números.",
        //         "Output": "Un string con la primera letra en minúscula y las demás en mayúsculas.",
        //         "Descripcion": "Esta función recibe un texto y convierte la primera letra en minúscula y las demás en mayúsculas."
        //     },
        //     {
        //         "Nombre": "reemplazar_espacios",
        //         "Input": "Un string con la primera letra en minúscula y las demás en mayúsculas.",
        //         "Output": "Un string con los espacios reemplazados por guión bajo.",
        //         "Descripcion": "Esta función recibe un texto y reemplaza los espacios por guión bajo."
        //     },
        //     {
        //         "Nombre": "agregar_caracter_final",
        //         "Input": "Un string con los espacios reemplazados por guión bajo.",
        //         "Output": "Un string con un asterisco (*) al final si la longitud es par, o un símbolo de exclamación (!) si es impar.",
        //         "Descripcion": "Esta función recibe un texto y agrega un asterisco (*) al final si la longitud es par, o un símbolo de exclamación (!) si es impar."
        //     }
        // ]
        // `

        // const ConsultaNEW = new Consulta({
        //     Problema: req.body.consulta,
        //     Respuesta: respuesta,
        //     Usuario: req.uid,
        // });

        // const RespDB = await ConsultaNEW.save();

        // res.json({
        //     ok: true,
        //     resp: respuesta,
        //     id_consulta: RespDB._id,
        // });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const RevisionChatGPT = async (req, res = response) => {
    try {
        console.log("Revision");

        let consulta_enviar = revision_plantilla({
            texto_1: req.body.requested,
            texto_2: req.body.responded,
        });

        const respuesta = await openAIInstance.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.5,
        });

        const RetroalimentacionNEW = new Retroalimentacion({
            Consulta: req.body.id_consulta,
            RespuestaEstudiante:req.body.responded,
            Usuario: req.uid,
            RespuestaLLM: respuesta.choices[0].message.content,
            Titulo:req.body.titulo
        });

        const RespDB = await RetroalimentacionNEW.save();

        res.json({
            ok: true,
            resp: respuesta.choices[0].message.content,
        });

        // const respuesta = `
        // [
        //     {
        //         "Nombre": "reemplazar_vocales",
        //         "Funcionalidad": 10,
        //         "Legibilidad": 9,
        //         "Eficiencia": 8,
        //         "Retroalimentación": "La función reemplaza correctamente las vocales por números y maneja tanto mayúsculas como minúsculas. El código es claro y fácil de entender, pero podría optimizarse en términos de eficiencia."  
        //     },
        //     {
        //         "Nombre": "primer_letra_minuscula",
        //         "Funcionalidad": 10,
        //         "Legibilidad": 9,
        //         "Eficiencia": 10,
        //         "Retroalimentación": "La función convierte la primera letra a minúscula y las demás a mayúsculas de forma correcta. El código es claro, fácil de entender y eficiente en términos de tiempo y espacio."
        //     },
        //     {
        //         "Nombre": "reemplazar_espacios",
        //         "Funcionalidad": 10,
        //         "Legibilidad": 9,
        //         "Eficiencia": 10,
        //         "Retroalimentación": "La función reemplaza correctamente los espacios por guión bajo. El código es claro, fácil de entender y eficiente en términos de tiempo y espacio."
        //     },
        //     {
        //         "Nombre": "agregar_caracter_final",
        //         "Funcionalidad": 10,
        //         "Legibilidad": 9,
        //         "Eficiencia": 10,
        //         "Retroalimentación": "La función agrega correctamente un asterisco (*) al final si la longitud es par, o un símbolo de exclamación (!) si es impar. El código es claro, fácil de entender y eficiente en términos de tiempo y espacio."
        //     }
        // ]
        // `
        // const RetroalimentacionNEW = new Retroalimentacion({
        //     Consulta: req.body.id_consulta,
        //     RespuestaEstudiante: req.body.responded,
        //     Usuario: req.uid,
        //     RespuestaLLM: respuesta,
        //     Titulo:req.body.titulo
        // });

        // const RespDB = await RetroalimentacionNEW.save();

        // res.json({
        //     ok: true,
        //     resp: respuesta
        // });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const Historial = async (req, res = response) => {
    try {
        const respDB = await Retroalimentacion.find({ Usuario: req.uid });
        var lista_resp = [];

        for (const elemento of respDB) {
            let respConsulta = await Consulta.findById(elemento.Consulta);
            let json_push = {
                Problema: respConsulta.Problema,
                RespuestaSubojetivos: respConsulta.Respuesta,
                id_consulta: respConsulta._id,
                id_retroalimento: elemento._id,
                Respuesta_Estudiante: elemento.RespuestaEstudiante,
                Retroalimentacion: elemento.RespuestaLLM,
                Titulo:elemento.Titulo
            };
            lista_resp.push(json_push);
        }

        res.json({
            ok: true,
            historial: lista_resp,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

module.exports = {
    ConsultaChatGPT,
    RevisionChatGPT,
    Historial,
};
