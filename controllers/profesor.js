const { response } = require("express");
const openAI = require("openai");
const { consulta_plantilla } = require("../data/plantillas");
const EjerciciosPropuesto = require("../models/EjerciciosPropuesto");
const Usuario = require("../models/Usuario");
const Retroalimentacion = require("../models/Retroalimentacion");
const CreacionCuentas = require("../models/CreacionCuentas");
const xlsx = require("xlsx");
const fs = require("fs");
const {
    generateRandomPassword,
    EnviarEmailContrasena,
} = require("../helpers/funciones");
const { CrearUsuarioEstudiante } = require("./auth");

const openAIInstance = new openAI({
    apiKey: process.env.API_KEY_OPEAI,
});

const GetDataAlumnos = async (req, res = response) => {
    try {
        const { uid } = req;

        const RespDBUsuario = await Usuario.findById(uid);

        const RespDBlistaEstudiantes = await Usuario.find({
            profesor_id: RespDBUsuario._id,
            rol: "estudiante",
            Estado:true
        });

        let respuesta = [];
        for (const elemento of RespDBlistaEstudiantes) {
            let respDB = await Retroalimentacion.find({ Usuario: elemento._id })
                .sort({ _id: -1 })
                .limit(5);
            respuesta.push(respDB);
        }

        res.json({
            ok: true,
            lista: respuesta,
            estudiantes: RespDBlistaEstudiantes,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const AgregarEjercicio = async (req, res = response) => {
    try {
        let consulta_enviar = consulta_plantilla({
            texto_1: req.body.Problema,
        });

        const respuesta = await openAIInstance.chat.completions.create({
            // model: "gpt-4-0125-preview",
            model: "gpt-4o",
            messages: [{ role: "system", content: consulta_enviar }],
            temperature: 0.5,
        });

        let str = respuesta.choices[0].message.content;
        let lista_problemas;
        if (str.startsWith("```json")) {
            lista_problemas = JSON.parse(str.substring(7, str.length - 3));
        } else {
            lista_problemas = JSON.parse(str);
        }

        const EjerciciosPropuestoNEW = new EjerciciosPropuesto({
            Titulo: req.body.Titulo,
            Problema: req.body.Problema,
            Respuesta: lista_problemas,
            Usuario: req.uid,
            Tags: req.body.Tags,
        });

        const RespDB = await EjerciciosPropuestoNEW.save();

        res.json({
            ok: true,
            resp: respuesta.choices[0].message.content,
            id_EjerciciosPropuesto: RespDB._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const ObtenerEjercicio = async (req, res = response) => {
    try {
        const RespDB = await EjerciciosPropuesto.find({ Usuario: req.uid });
        let respuesta = [];

        for (const elemento of RespDB) {
            let respuestaUsuario = await Usuario.findById(elemento.Usuario);
            respuesta.push({
                ...elemento._doc,
                Nombre: respuestaUsuario.name,
            });
        }

        res.json({
            ok: true,
            lista: respuesta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const ObtenerEjercicioTag = async (req, res = response) => {
    try {
        const RespDB = await EjerciciosPropuesto.find({
            Tags: { $in: [req.body.Tag] },
        });
        let respuesta = [];

        for (const elemento of RespDB) {
            let respuestaUsuario = await Usuario.findById(elemento.Usuario);
            respuesta.push({
                ...elemento._doc,
                Nombre: respuestaUsuario.name,
            });
        }

        res.json({
            ok: true,
            lista: respuesta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const ObtenerRendimientoEjercicio = async (req, res = response) => {
    try {
        const RespDB = await Retroalimentacion.find({
            EjercicioPropuestoID: req.body.EjercicioPropuestoID,
        });

        let respuesta = [];
        for (const elemento of RespDB) {
            let respuestaUsuario = await Usuario.findById(elemento.Usuario);
            if(respuestaUsuario.Estado){
                respuesta.push({
                    ...elemento._doc,
                    Nombre: respuestaUsuario.name,
                });
            }
        }

        res.json({
            ok: true,
            lista: respuesta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const EliminarEjercicioPropuesto = async (req, res = response) => {
    try {
        const respu = await EjerciciosPropuesto.deleteOne({ _id: req.body.ID });

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

const CrearCuentas = async (req, res = response) => {
    const { uid, name } = req;

    try {
        // El archivo se ha subido correctamente
        const uploadedFile = req.file;
        console.log("Archivo recibido:", uploadedFile);

        // Ruta del archivo subido
        const filePath = uploadedFile.path;

        // Leer el archivo Excel
        const workbook = xlsx.readFile(filePath);

        // Obtener la primera hoja del archivo
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convertir la hoja a un objeto JSON
        const listajsonData = xlsx.utils.sheet_to_json(worksheet);

        // Imprimir los datos leídos
        console.log("Datos de la primera hoja:", listajsonData);

        const creacionnew = new CreacionCuentas({
            profesor_id: uid,
        });

        const respuCreacion = await creacionnew.save();

        for (const elemento of listajsonData) {
            // const constrasenausuario = generateRandomPassword(14);
            const rep = await CrearUsuarioEstudiante({
                email: elemento.Email,
                // password: constrasenausuario,
                password: "usmprogra",
                name: elemento.Nombre,
                rol: "estudiante",
                profesor_id: uid,
                IDCreacionCuenta: respuCreacion._id,
            });

            // await EnviarEmailContrasena({
            //     email: elemento.Email,
            //     contrasena: constrasenausuario,
            // });
        }

        fs.unlinkSync(filePath);

        res.json({
            ok: true,
        });
    } catch (error) {
        // Ocurrió un error al subir el archivo
        console.error("Error al subir archivo:", error);
        res.json({
            ok: false,
        });
    }
};

const CrearCuentasHistorial = async (req, res = response) => {
    try {
        const respu = await CreacionCuentas.find({ profesor_id: req.uid });
        let lista = [];
        let aux = [];
        for (const elemento of respu) {
            aux = [];
            let respu2 = await Usuario.find({ IDCreacionCuenta: elemento._id });
            for (const elemento2 of respu2) {
                aux.push(elemento2.name);
            }
            lista.push({
                lista_usuarios: aux,
                ...elemento._doc,
            });
        }

        res.json({
            ok: true,
            lista: lista,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const DesactivarCuentas = async (req, res = response) => {
    try {
        const respu = await Usuario.updateMany(
            { IDCreacionCuenta: req.body.id_creacion },
            { $set: { Estado: false } }
        );

        const respu2 = await CreacionCuentas.findByIdAndUpdate(
            req.body.id_creacion,
            { $set: { Estado: false } }
        );

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

const ActivarCuentas = async (req, res = response) => {
    try {
        const respu = await Usuario.updateMany(
            { IDCreacionCuenta: req.body.id_creacion },
            { $set: { Estado: true } }
        );

        const respu2 = await CreacionCuentas.findByIdAndUpdate(
            req.body.id_creacion,
            { $set: { Estado: true } }
        );

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

module.exports = {
    GetDataAlumnos,
    AgregarEjercicio,
    ObtenerEjercicio,
    ObtenerEjercicioTag,
    ObtenerRendimientoEjercicio,
    EliminarEjercicioPropuesto,
    CrearCuentas,
    CrearCuentasHistorial,
    DesactivarCuentas,
    ActivarCuentas,
};
