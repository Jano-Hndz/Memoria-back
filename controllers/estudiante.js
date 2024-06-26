const { response } = require("express");
const openAI = require("openai");
const {
    consulta_plantilla,
    revision_plantilla,
    analisis_plantilla,
    creacion_problema_plantilla,
} = require("../data/plantillas");
const Consulta = require("../models/Consulta");
const Retroalimentacion = require("../models/Retroalimentacion");
const EjerciciosPropuesto = require("../models/EjerciciosPropuesto");
const Usuario = require("../models/Usuario");
const Analisis_Rendimiento = require("../models/Analisis_Rendimiento");
const bcrypt = require("bcryptjs");

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
            // model: "gpt-4-0125-preview",
            model: "gpt-4o",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.0,
        });
        console.log(respuesta.usage);


        let str = respuesta.choices[0].message.content;
        let lista_problemas;
        if (str.startsWith("```json")) {
            lista_problemas = JSON.parse(str.substring(7, str.length - 3));
        } else {
            lista_problemas = JSON.parse(str);
        }

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

        const respuestaEstudiante = req.body.requested.map((obj) => {
            // Buscar si el nombre del objeto está en el JSON
            const nombre = obj.Nombre;
            if (req.body.responded.hasOwnProperty(nombre)) {
                // Asignar el valor correspondiente del JSON al nuevo atributo
                obj.RespuestaEstudiante = req.body.responded[nombre];
            }
            return obj;
        });

        const stringRespuiestaEstudiante = JSON.stringify(respuestaEstudiante);
        let consulta_enviar = revision_plantilla({
            texto_1: stringRespuiestaEstudiante,
        });

        const respuesta = await openAIInstance.chat.completions.create({
            // model: "gpt-4-0125-preview",
            model: "gpt-4o",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.0,
        });

        console.log(respuesta.usage);
        let str = respuesta.choices[0].message.content;

        let lista_retroalimentacion;
        if (str.startsWith("```json")) {
            lista_retroalimentacion = JSON.parse(
                str.substring(7, str.length - 3)
            );
        } else {
            lista_retroalimentacion = JSON.parse(str);
        }

        let RetroalimentacionNEW;
        if (req.body.EJ) {
            console.log("Entro en la parte de ejercicio propuesto");
            RetroalimentacionNEW = new Retroalimentacion({
                EjercicioPropuestoID: req.body.id_consulta,
                RespuestaEstudiante: req.body.responded,
                Usuario: req.uid,
                RespuestaLLM: lista_retroalimentacion,
                Titulo: req.body.titulo,
                Propuesto: true,
            });
        } else {
            console.log("Entro en la parte de ejercicio normal");
            RetroalimentacionNEW = new Retroalimentacion({
                ConsultaID: req.body.id_consulta,
                RespuestaEstudiante: req.body.responded,
                Usuario: req.uid,
                RespuestaLLM: lista_retroalimentacion,
                Titulo: req.body.titulo,
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

const HistorialPaginado = async (req, res = response) => {
    try {
        let cantidadDocumentos;
        if (req.body.pag == 1) {
            cantidadDocumentos = await Retroalimentacion.countDocuments({
                Usuario: req.uid,
            });
        }
        let skip_num = (req.body.pag - 1) * 5;
        const respDB = await Retroalimentacion.find({ Usuario: req.uid })
            .sort({ _id: -1 })
            .skip(skip_num)
            .limit(5);
        var lista_resp = [];
        let respConsulta;
        let json_push;
        for (const elemento of respDB) {
            if (elemento.Propuesto == true) {
                respConsulta = await EjerciciosPropuesto.findById(
                    elemento.EjercicioPropuestoID
                );
                json_push = {
                    Problema: respConsulta.Problema,
                    RespuestaSubojetivos: respConsulta.Respuesta,
                    id_EjercicioPropuesto: respConsulta._id,
                    id_Retroalimentacion: elemento._id,
                    Respuesta_Estudiante: elemento.RespuestaEstudiante,
                    Retroalimentacion: elemento.RespuestaLLM,
                    Titulo: elemento.Titulo,
                    Propuesto: true,
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
                    Titulo: elemento.Titulo,
                    Propuesto: false,
                };
            }
            lista_resp.push(json_push);
        }
        if (req.body.pag == 1) {
            res.json({
                ok: true,
                historial: lista_resp,
                cantidad: cantidadDocumentos,
            });
        } else {
            res.json({
                ok: true,
                historial: lista_resp,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const ObtenerEjercicioPropuesto = async (req, res = response) => {
    try {
        const respUsuario = await Usuario.findById(req.uid);

        console.log(req.body);
        let cantidadDocumentos;
        if (req.body.pag == 1) {
            cantidadDocumentos = await EjerciciosPropuesto.countDocuments({
                Usuario: respUsuario.profesor_id,
            });
        }
        let skip_num = (req.body.pag - 1) * 5;

        const respEPBD = await EjerciciosPropuesto.find({
            Usuario: respUsuario.profesor_id,
        })
            .sort({ _id: -1 })
            .skip(skip_num)
            .limit(5);

        if (req.body.pag == 1) {
            res.json({
                ok: true,
                lista: respEPBD,
                cantidad: cantidadDocumentos,
            });
        } else {
            res.json({
                ok: true,
                lista: respEPBD,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const ObtenerEjercicioPropuestoTag = async (req, res = response) => {
    try {
        const respUsuario = await Usuario.findById(req.uid);

        console.log(req.body);
        let cantidadDocumentos;
        if (req.body.pag == 1) {
            cantidadDocumentos = await EjerciciosPropuesto.countDocuments({
                Usuario: respUsuario.profesor_id,
                Tags: { $in: [req.body.Tag] },
            });
            console.log(cantidadDocumentos);
        }
        let skip_num = (req.body.pag - 1) * 5;

        const respEPBD = await EjerciciosPropuesto.find({
            Usuario: respUsuario.profesor_id,
            Tags: { $in: [req.body.Tag] },
        })
            .sort({ _id: -1 })
            .skip(skip_num)
            .limit(5);

        if (req.body.pag == 1) {
            res.json({
                ok: true,
                lista: respEPBD,
                cantidad: cantidadDocumentos,
            });
        } else {
            res.json({
                ok: true,
                lista: respEPBD,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const Rendimiento_Estudiante = async (req, res = response) => {
    try {
        let respDB = await Retroalimentacion.find({ Usuario: req.uid })
            .sort({ _id: -1 })
            .limit(5);

        res.json({
            ok: true,
            lista: respDB,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const CambiarContrasena = async (req, res = response) => {
    try {
        const usuarioData = await Usuario.findById(req.uid);

        const validPassword = bcrypt.compareSync(
            req.body.constrasenaantigua,
            usuarioData.password
        );

        if (!validPassword) {
            res.json({
                ok: false,
            });
        }
        const salt = bcrypt.genSaltSync();

        const newcontra = bcrypt.hashSync(req.body.newPassword, salt);

        usuarioData.password = newcontra;

        await usuarioData.save();

        res.json({
            ok: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const Analisis_Rendimiento_Estudiante = async (req, res = response) => {
    try {
        console.log("Analisis Estudiante");

        let consulta_enviar = analisis_plantilla({
            texto_1: req.body.Rendimiento,
        });

        const respuesta = await openAIInstance.chat.completions.create({
           // model: "gpt-4-0125-preview",
           model: "gpt-4o",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.0,
        });
        console.log(respuesta.usage);
        let str = respuesta.choices[0].message.content;
        let Json_Retroalimentaion;
        if (str.startsWith("```json")) {
            Json_Retroalimentaion = JSON.parse(
                str.substring(7, str.length - 3)
            );
        } else {
            Json_Retroalimentaion = JSON.parse(str);
        }

        console.log("Paso Analisis");

        let consulta_enviar2 = creacion_problema_plantilla({
            texto_1: JSON.stringify(Json_Retroalimentaion),
        });

        const respuesta2 = await openAIInstance.chat.completions.create({
            // model: "gpt-4-0125-preview",
            model: "gpt-4o",
            messages: [{ role: "system", content: consulta_enviar2 }],
            temperature: 0.0,
        });
        console.log(respuesta2.usage);
        let stringProblema = respuesta2.choices[0].message.content;
        console.log(stringProblema);
        let Json_Problema;
        if (stringProblema.startsWith("```json")) {
            Json_Problema = JSON.parse(
                stringProblema.substring(7, stringProblema.length - 3)
            );
        } else {
            Json_Problema = JSON.parse(stringProblema);
        }

        console.log("Paso creacion de problema");

        let consulta_enviar3 = consulta_plantilla({
            texto_1: Json_Problema.Problema,
        });

        const respuesta3 = await openAIInstance.chat.completions.create({
            // model: "gpt-4-0125-preview",
            model: "gpt-4o",
            messages: [{ role: "system", content: consulta_enviar3 }],
            temperature: 0.0,
        });
        console.log(respuesta3.usage);
        let stringConsulta = respuesta3.choices[0].message.content;
        let lista_problemas;
        if (stringConsulta.startsWith("```json")) {
            lista_problemas = JSON.parse(
                stringConsulta.substring(7, stringConsulta.length - 3)
            );
        } else {
            lista_problemas = JSON.parse(stringConsulta);
        }

        console.log("Paso asistente de subobjetivos");

        const EjerciciosPropuestoNEW = new EjerciciosPropuesto({
            Titulo: Json_Problema.Titulo,
            Problema: Json_Problema.Problema,
            Respuesta: lista_problemas,
            Usuario: req.uid,
            Tags: Json_Retroalimentaion.lista_topicos,
        });

        const RespDB2 = await EjerciciosPropuestoNEW.save();

        const AnalisisNEW = new Analisis_Rendimiento({
            Retroalimentacion: Json_Retroalimentaion.Retroalimentacion,
            Topicos: Json_Retroalimentaion.lista_topicos,
            Usuario: req.uid,
            EjercicioPropuestoID: RespDB2._id,
        });

        const RespDB = await AnalisisNEW.save();

        res.json({
            ok: true,
            retroalimentacion: Json_Retroalimentaion,
            problema: Json_Problema,
            lista_problemas: lista_problemas,
            ID_Analisis: RespDB._id,
            ID_Ejercicio_Propuesto: RespDB2._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const GETRendimientoEstudiantes = async (req, res = response) => {
    try {
        let cantidadDocumentos;
        if (req.body.pag == 1) {
            cantidadDocumentos = await Analisis_Rendimiento.countDocuments({
                Usuario: req.uid,
            });
        }
        let skip_num = (req.body.pag - 1) * 5;
        const respDB = await Analisis_Rendimiento.find({ Usuario: req.uid })
            .sort({ _id: -1 })
            .skip(skip_num)
            .limit(5);
        var lista_resp = [];
        let respConsulta;
        let json_push;
        for (const elemento of respDB) {
            respConsulta = await EjerciciosPropuesto.findById(
                elemento.EjercicioPropuestoID
            );
            json_push = {
                Problema: respConsulta.Problema,
                RespuestaSubojetivos: respConsulta.Respuesta,
                id_EjercicioPropuesto: respConsulta._id,
                id_Retroalimentacion: elemento._id,
                Retroalimentacion: elemento.Retroalimentacion,
                Topicos: elemento.Topicos,
                Date: elemento.Date,
            };
            lista_resp.push(json_push);
        }
        if (req.body.pag == 1) {
            res.json({
                ok: true,
                lista: lista_resp,
                cantidad: cantidadDocumentos,
            });
        } else {
            res.json({
                ok: true,
                lista: lista_resp,
            });
        }
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
    HistorialPaginado,
    ObtenerEjercicioPropuesto,
    ObtenerEjercicioPropuestoTag,
    Rendimiento_Estudiante,
    Analisis_Rendimiento_Estudiante,
    GETRendimientoEstudiantes,
    CambiarContrasena,
};
