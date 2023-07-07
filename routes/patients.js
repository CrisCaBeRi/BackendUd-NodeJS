var express = require("express");
var router = express.Router();
const { CONNECTION } = require("../database/connection.js");
//!RENDERIZADO DEL HANDLEBAR patients UTILIZANDO LA INFORMACIÓN DE MYSQL
router.get("/", (req, res, next) => {
  CONNECTION.query("SELECT * FROM pacientes", (error, results) => {
    if (error) {
      console.log("Error en la consulta: ", error);
      res.status(500).send("Error en la cosulta");
    } else {
      function validation(results) {
        if (results.length > 0) {
          return true;
        } else {
          return false;
        }
      }
      res.render("patients", {
        title: "Pacientes",
        patients: results,
        option: "disabled",
        state: true,
        show: validation(results)
      });
    }
  });
});
//! ENVIO AL FORMULARIO DE REGISTRO
router.get("/form-patient", (req, res, next) => {
  res.render("form-patient", {
    subTitle: "Formulario de registro: Pacientes",
  });
});
//! AÑADIR PACIENTE
router.post("/add-register", (req, res, next) => {
  const dataPat = {
    idPat: req.body.idPat,
    namePat: req.body.namePat,
    lastnPat: req.body.lastnPat,
    agePat: req.body.agePat,
    telPat: req.body.telPat,
  };
  CONNECTION.query(
    `INSERT INTO pacientes (cedula, nombre, apellido, edad, telefono) VALUES(${dataPat.idPat},'${dataPat.namePat}','${dataPat.lastnPat}',${dataPat.agePat},${dataPat.telPat})`,
    (error, results) => {
      if (error) {
        console.log("Error al añadir elementos a la BD: ", error);
        res.status(500).send("Error al añadir regitros a la BD");
      } else {
        res.redirect("/patients");
      }
    }
  );
});

//TODO BORRAR CITA CUANDO BORRA PACIENTE
//! ELIMINAR PACIENTE
router.get("/delete/:idPat", (req, res, next) => {
  const idPat = req.params.idPat;
  CONNECTION.query(
    `DELETE FROM cita_medica WHERE id_paciente=${idPat}`,
    (error, results) => {
      if (error) {
        console.log("Error al eliminar registro de la BD: ", error);
        res.status(500).send("Error en la consulta a la BD");
      } else {
        CONNECTION.query(
          `DELETE FROM pacientes WHERE cedula=${idPat}`,
          (error, results) => {
            if (error) {
              console.log("Error al eliminar registro de la BD: ", error);
              res.status(500).send("Error en la consulta a la BD");
            } else {
              res.redirect("/patients");
            }
          }
        );
      }
    }
  );
});

//! ACTIVAR LA EDICION DEL FORMULARIO
router.get("/modify/:key", (req, res, next) => {
  const key = req.params.key;
  CONNECTION.query("SELECT * FROM pacientes", (error, results) => {
    if (error) {
      console.log("Error en la consulta: ", error);
      res.status(500).send("Error en la consulta a la BD");
    } else {
      function validation(results) {
        if (results.length > 0) {
          return true;
        } else {
          return false;
        }
      }
      res.render("patients", {
        title: "Pacientes",
        patients: results,
        option: "disabled",
        state: false,
        keyPat: key,
        display: "none",
        show: validation(results),
      });
    }
  });
});
//! MODIFICAR REGISTROS
router.post("/update/:patId", (req, res, next) => {
  const dataPat = {
    idPat: req.params.patId,
    namePat: req.body.namePat,
    lastnPat: req.body.lastnPat,
    agePat: req.body.agePat,
    telPat: req.body.telPat,
  };
  CONNECTION.query(
    `UPDATE pacientes SET nombre='${dataPat.namePat}', apellido='${dataPat.lastnPat}', edad=${dataPat.agePat}, telefono=${dataPat.telPat} WHERE cedula=${dataPat.idPat}`,
    (error, results) => {
      if (error) {
        console.log("Error al actualizar datos en la BD: ", error);
        res.status(500).send("Error al actualizar datos en la BD");
      } else {
        res.redirect("/patients");
      }
    }
  );
});
module.exports = router;