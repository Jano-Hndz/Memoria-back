const { response } = require("express");
const Foro = require("../models/Foro");
const Retroalimentacion = require("../models/Retroalimentacion");
const Consulta = require("../models/Consulta");
const Usuario = require("../models/Usuario");
const ForoComentario = require("../models/ForoComentario");
const EjerciciosPropuesto = require("../models/EjerciciosPropuesto");

const PublicarForo = async (req, res = response) => {
    try {
        const ForoNEW = new Foro({
            ...req.body,
            Usuario: req.uid,
        });

        const RespDB = await ForoNEW.save();

        res.json({
            ok: true,
            id: RespDB._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const GetForo = async (req, res = response) => {
    try {
        console.log(req.body);
        let cantidadDocumentos;
        if (req.body.pag == 1) {
            cantidadDocumentos = await Foro.countDocuments();
        }
        let skip_num = (req.body.pag - 1) * 5;
        const respDB = await Foro.find()
            .sort({ _id: -1 })
            .skip(skip_num)
            .limit(5);
        let respuesta = [];

        for (const elemento of respDB) {
            let respuestaUsuario = await Usuario.findById(elemento.Usuario);
            let respRetroalimentacion = await Retroalimentacion.findById(
                elemento.RetroalimentacionID
            );
            respuesta.push({
                ...elemento._doc,
                Propuesto: respRetroalimentacion.Propuesto,
                Usuario: respuestaUsuario.name,
            });
        }

        if (req.body.pag == 1) {
            res.json({
                ok: true,
                lista: respuesta,
                cantidad: cantidadDocumentos,
            });
        } else {
            res.json({
                ok: true,
                lista: respuesta,
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

const GetPostUsuario = async (req, res = response) => {
    try {
        console.log(req.body);
        let cantidadDocumentos;
        if (req.body.pag == 1) {
            cantidadDocumentos = await Foro.countDocuments({
                Usuario: req.uid,
            });
        }
        let skip_num = (req.body.pag - 1) * 5;
        const respDB = await Foro.find({ Usuario: req.uid })
            .sort({ _id: -1 })
            .skip(skip_num)
            .limit(5);
        let respuesta = [];

        for (const elemento of respDB) {
            let respuestaUsuario = await Usuario.findById(elemento.Usuario);
            let respRetroalimentacion = await Retroalimentacion.findById(
                elemento.RetroalimentacionID
            );
            respuesta.push({
                ...elemento._doc,
                Propuesto: respRetroalimentacion.Propuesto,
                Usuario: respuestaUsuario.name,
            });
        }

        if (req.body.pag == 1) {
            res.json({
                ok: true,
                lista: respuesta,
                cantidad: cantidadDocumentos,
            });
        } else {
            res.json({
                ok: true,
                lista: respuesta,
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

const GetRetroalimentacion = async (req, res = response) => {
    try {
        let respRetroalimentacion = await Retroalimentacion.findById(
            req.body.RetroalimentacionID
        );
        let respConsulta;
        let respuesta;
        if (respRetroalimentacion.Propuesto) {
            respConsulta = await EjerciciosPropuesto.findById(
                respRetroalimentacion.EjercicioPropuestoID
            );
            respuesta = {
                inputs: respRetroalimentacion.RespuestaEstudiante,
                retroalimentacion: respRetroalimentacion.RespuestaLLM,
                lista_funciones: respConsulta.Respuesta,
                problema: respConsulta.Problema,
                Propuesto: true,
            };
        } else {
            respConsulta = await Consulta.findById(
                respRetroalimentacion.ConsultaID
            );
            respuesta = {
                inputs: respRetroalimentacion.RespuestaEstudiante,
                retroalimentacion: respRetroalimentacion.RespuestaLLM,
                lista_funciones: respConsulta.Respuesta,
                problema: respConsulta.Problema,
                Propuesto: false,
            };
        }

        res.json({
            ok: true,
            data: respuesta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const GetConsulta = async (req, res = response) => {
    try {
        let respRetroalimentacion = await Retroalimentacion.findById(
            req.body.id_consulta
        );
        let respConsulta;
        let respuesta;
        if (respRetroalimentacion.Propuesto) {
            respConsulta = await EjerciciosPropuesto.findById(
                respRetroalimentacion.EjercicioPropuestoID
            );
            respuesta = {
                Date: respConsulta.Date,
                Problema: respConsulta.Problema,
                Respuesta: respConsulta.Respuesta,
                _id: respConsulta._id,
                Propuesto: true,
            };
        } else {
            respConsulta = await Consulta.findById(
                respRetroalimentacion.ConsultaID
            );
            respuesta = {
                Date: respConsulta.Date,
                Problema: respConsulta.Problema,
                Respuesta: respConsulta.Respuesta,
                _id: respConsulta._id,
                Propuesto: false,
            };
        }

        res.json({
            ok: true,
            data: respuesta,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const ComentarForo = async (req, res = response) => {
    try {
        const ForoNEW = new ForoComentario({
            ...req.body,
            Usuario: req.uid,
        });
        const RespDB = await ForoNEW.save();

        res.json({
            ok: true,
            id_comentario: RespDB._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador",
        });
    }
};

const GetComentarios = async (req, res = response) => {
    try {
        console.log("Entro aca");

        const RespDB = await ForoComentario.find({ ForoID: req.body.id_foro });

        let respuesta = [];

        for (const elemento of RespDB) {
            let respuestaUsuario = await Usuario.findById(elemento.Usuario);
            respuesta.push({
                ...elemento._doc,
                Usuario: respuestaUsuario.name,
            });
        }

        console.log(data);

        res.json({
            ok: true,
            data: respuesta,
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
    PublicarForo,
    GetForo,
    GetRetroalimentacion,
    ComentarForo,
    GetComentarios,
    GetConsulta,
    GetPostUsuario,
};
