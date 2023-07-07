var express = require("express");
var router = express.Router();
const { CONNECTION } = require("../database/connection.js");
//! TRAE LOS REGISTROS A LA DABLA
router.get("/", (req, res, next) => {
  CONNECTION.query(
    "SELECT cm.id, cm.id_paciente, cm.id_medico, cm.fecha, pc.cedula, pc.apellido, pc.nombre, md.cedula, md.apellido as apellidoDoc, md.nombre as nombreDoc, md.especialidad, md.consultorio FROM cita_medica cm, pacientes pc, medicos md WHERE cm.id_paciente = pc.cedula AND cm.id_medico = md.cedula",
    (error, results) => {
      if (error) {
        console.log("Error en la consulta  a la BD: ", error);
        res.status(500).send("Error en la consulta a la BD");
      } else {
        function validation(results) {
          if (results.length > 0) {
            return true;
          } else {
            return false;
          }
        }
        res.render("appointment", {
          subtitle: "Citas",
          appointments: results,
          show1: validation(results)
        });
      }
    }
  );
});
//! ENVIO AL FORMULARIO DE REGISTROS CON LOS DATOS DE CEDULA PACIENTE Y ESPECIALIDAD FILTRADAS
router.get("/form-appointment", (req, res, next) => {
  CONNECTION.query("SELECT cedula FROM pacientes", (error, results) => {
    if (error) {
      console.log("Error al realizar consulta a la BD: ", error);
      res.status(500).send("Error al realizar consulta a la BD");
    } else {
      CONNECTION.query(
        "SELECT especialidad FROM medicos",
        (error, resultsB) => {
          if (error) {
            console.log("Error al realizar consulta a la BD: ", error);
            res.status(500).send("Error al realizar consulta a la BD");
          } else {            
            res.render("form-appointment", {
              subTitle: "Formulario de registro: citas",
              documentsPat: results,
              especMed: resultsB,
            });
          }
        }
      );
    }
  });
});
//!AGREGAR REGISTRO DE CITA
router.post("/add-appointment", (req, res, next) => {
  const dataApp = {
    documentPat: req.body.documentPat,
    especDoc: req.body.especDoc,
    date: req.body.dateAp,
  };
  //Ya que se debe enviar la cedula del medico para el registro de la tabla de citas, se debe tomar el dato de especialidad y hacer una consulta previa a qué cedula corresponde esa especialidad.
  CONNECTION.query(
    `SELECT cedula FROM medicos WHERE especialidad='${dataApp.especDoc}'`,
    (error, results) => {
      if (error) {
        console.log("Error en la consulta a la BD: ", error);
        res.status(500).send("Error en la consulta");
      } else {
        //al resultado de la consulta se le asigna una variable
        let getIdMed = results[0].cedula;
        CONNECTION.query(
          `INSERT INTO cita_medica (id_paciente, id_medico, fecha) VALUES (${dataApp.documentPat}, ${getIdMed}, '${dataApp.date}') `,
          (error, results2) => {
            if (error) {
              console.log("Error al agregar registro en la BD: ", error);
              res.status(500).send("Error en la cosulta");
            } else {
              res.redirect("/appointment");
            }
          }
        );
      }
    }
  );
});
//! BORRAR REGISTRO DE CITA
router.get("/delete/:idApp", (req, res, next) => {
  const idApp = req.params.idApp;
  CONNECTION.query(
    `DELETE FROM cita_medica WHERE id=${idApp}`,
    (error, results) => {
      if (error) {
        console.log("Error al eliminar registro de lka BD: ", error);
        res.status(500).send("Error en la consulta");
      } else {
        res.redirect("/appointment");
      }
    }
  );
});
module.exports = router;