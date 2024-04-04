const { response } = require("express");
const openAI = require("openai");
const {
    consulta_plantilla,
    revision_plantilla,
} = require("../data/plantillas");
const Consulta = require("../models/Consulta");
const Retroalimentacion = require("../models/Retroalimentacion");
const EjerciciosPropuesto = require("../models/EjerciciosPropuesto");


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
            // model: "gpt-4",
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.5,
        });
        const lista_problemas= JSON.parse(respuesta.choices[0].message.content)
        const ConsultaNEW = new Consulta({
            Problema: req.body.consulta,
            Respuesta: lista_problemas,
            Usuario: req.uid,
        });

        const RespDB = await ConsultaNEW.save();

        res.json({
            ok: true,
            resp: lista_problemas,
            id_consulta: RespDB._id,
        });


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
        console.log();
    
        const respuestaEstudiante = (req.body.requested).map(obj => {
            // Buscar si el nombre del objeto está en el JSON
            const nombre = obj.Nombre;
            if ((req.body.responded).hasOwnProperty(nombre)) {
                // Asignar el valor correspondiente del JSON al nuevo atributo
                obj.RespuestaEstudiante = (req.body.responded)[nombre];
            }
            return obj;
            });
            
        const  stringRespuiestaEstudiante=JSON.stringify(respuestaEstudiante)
        let consulta_enviar = revision_plantilla({
            texto_1: stringRespuiestaEstudiante
        });

        const respuesta = await openAIInstance.chat.completions.create({
            model: "gpt-4",
            // model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.5,
        });


        const lista_retroalimentacion= JSON.parse(respuesta.choices[0].message.content)
        let RetroalimentacionNEW
        if (req.body.EJ) {
            console.log("Entro en la parte de ejercicio propuesto");
            RetroalimentacionNEW = new Retroalimentacion({
                EjercicioPropuestoID: req.body.id_consulta,
                RespuestaEstudiante:req.body.responded,
                Usuario: req.uid,
                RespuestaLLM: lista_retroalimentacion,
                Titulo:req.body.titulo,
                Propuesto:true
            });
        } else {
            console.log("Entro en la parte de ejercicio normal");
            RetroalimentacionNEW = new Retroalimentacion({
                ConsultaID: req.body.id_consulta,
                RespuestaEstudiante:req.body.responded,
                Usuario: req.uid,
                RespuestaLLM: lista_retroalimentacion,
                Titulo:req.body.titulo
            });
        }


        const RespDB = await RetroalimentacionNEW.save();

        res.json({
            ok: true,
            resp: lista_retroalimentacion,
        });
        

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
        let respConsulta
        let json_push
        for (const elemento of respDB) {
            if (elemento.Propuesto == true) {
                respConsulta = await EjerciciosPropuesto.findById(elemento.EjercicioPropuestoID);
                json_push = {
                    Problema: respConsulta.Problema,
                    RespuestaSubojetivos: respConsulta.Respuesta,
                    id_EjercicioPropuesto: respConsulta._id,
                    id_Retroalimentacion: elemento._id,
                    Respuesta_Estudiante: elemento.RespuestaEstudiante,
                    Retroalimentacion: elemento.RespuestaLLM,
                    Titulo:elemento.Titulo,
                    Propuesto:true
                };
            } else {
                respConsulta = await Consulta.findById(elemento.ConsultaID);
                json_push = {
                    Problema: respConsulta.Problema,
                    RespuestaSubojetivos: respConsulta.Respuesta,
                    id_consulta: respConsulta._id,
                    id_Retroalimentacion: elemento._id,
                    Respuesta_Estudiante: elemento.RespuestaEstudiante,
                    Retroalimentacion: elemento.RespuestaLLM,
                    Titulo:elemento.Titulo,
                    Propuesto:false
                };
            }
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


const CrearProblema = async (req, res = response) => {
    try {
        console.log("Crear Problema");


        const respuesta = await openAIInstance.chat.completions.create({
            // model: "gpt-4",
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: `
            Eres un profesor de programación de Python. Se te entregará una serie de textos componentes con instrucciones, reglas, ejemplos de formato de respuestas y finalmente un documento a revisar. El primer texto componente es instruction_text, está encasillado entre las etiquetas <instruction> y </instruction>. El segundo texto componente será un formato para tus respuestas, este se llama example_responses_text, y está encasillado entre las etiquetas <example_responses> y </example_responses>. El siguiente texto componente será un texto llamado response_example_explanation_text, encasillado entre las etiquetas <response_example_explanation> y </response_example_explanation> y te permitirá entender cómo responder. Usando instruction_text como tus instrucciones y responde de acuerdo con el formato descrito en response_example_text usando las reglas especificadas en response_example_explanation_text. Responde en formato de un de JSON format, con sus llaves y valores en castellano tal como se especificó en response_example_explanation_text
            <instruction>
            Tienes que realizar crear un problema el cual sea apto para un estudiante de programación, este problema tiene que ser apto para poder resolverlo mediante la metodología de subobjetivos
            </instruction>
            <example_responses>
                {
                    "Nombre": <nombre_problem>,
                    "Problema": <Problem_text>
               }
            </example_responses>
            <response_example_explanation>
            Se tendrá que devolver un JSON en el formato descrito en example_responses_text. Los atributos de este JSON son “Nombre” en donde <nombre_problem> corresponde a un titulo que describa el problema que se creo. El otro atributo corresponde a “Problema” en donde <Problem_text> corresponde al problema que se creo para el que el estudiante pueda resolver un problema de programación con Python y la metodología por subobjetivos
            </response_example_explanation>
            `}],
            temperature: 0.5,
        });
        const Json_Problema= JSON.parse(respuesta.choices[0].message.content)
        console.log(Json_Problema);
        res.json({
            ok: true,
            resp: Json_Problema
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
    CrearProblema
};
