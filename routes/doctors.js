var express = require("express");
var router = express.Router();
const { CONNECTION } = require("../database/connection.js");
//!RENDERIZADO DEL HANDLEBAR medicos UTILIZANDO LA INFORMACIÓN DE MYSQL
router.get("/", (req, res, next) => {
  CONNECTION.query("SELECT * FROM medicos", (error, results) => {
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
      res.render("doctors", {
        title: "Medicos",
        doctors: results,
        option: "disabled",
        state: true,
        show: validation(results)
      });
    }
  });
});
//! ENVIO A RUTA DEL FORMULARIO HBS
router.get("/form-doctor", function (req, res, next) {
  CONNECTION.query("SELECT especialidad FROM medicos", (error, results) => {
    if (error) {
      console.log("Error en la consulta", error);
      res.status(500).send("Error en la consulta");
    } else {
      console.log(results);
      //! Filtrado de espcialidades para que no se puedan crear medicos con la misma espeicalidad
      let specialities = [
        "Medicina general",
        "Cardiología",
        "Medicina interna",
        "Dermatología",
        "Rehabilitación física",
        "Psicología",
        "Odontología",
        "Radiología",
      ];
      let resultsSpecialities = results.map((obj) => obj.especialidad);
      //!Toma la respuesta de SQL que contiene las especialidades que ya se encuentran en la BD y las especialidades en un arreglo.
      let resultsUnique = specialities.filter((elemento) => {
        return !resultsSpecialities.includes(elemento);
      });
      res.render("form-doctor", {
        especialities: resultsUnique
      });
    }
  });
});
//! AÑADIR DOCTOR (ACTION DEL FORMULARIO)
router.post("/add-register", (req, res, next) => {
  const dataDoc = {
    idDoc: req.body.document,
    lNameDoc: req.body.lastNameDoc,
    nameDoc: req.body.nameDoc,
    roomDoc: req.body.roomDoc,
    mailDoc: req.body.mailDoc,
    specDoc: req.body.specDoc,
  };
  CONNECTION.query(
    `INSERT INTO medicos (cedula, nombre, apellido, especialidad, consultorio, correo) VALUES (${dataDoc.idDoc}, '${dataDoc.nameDoc}', '${dataDoc.lNameDoc}', '${dataDoc.specDoc}', '${dataDoc.roomDoc}', '${dataDoc.mailDoc}' );`,
    (error, results) => {
      if (error) {
        console.log("Error en la consulta: ", error);
        res.status(500).send("Error en la consulta");
      } else {
        res.redirect("/doctors");
      }
    }
  );
});
//! BORRAR REGISTRO DE DOCTOR
router.get("/delete/:idDoc", (req, res, next) => {
  const idDoc = req.params.idDoc;
  CONNECTION.query(
    `DELETE FROM cita_medica WHERE id_medico=${idDoc} `,
    (error, result) => {
      if (error) {
        console.log("Error al eliminar registro de la BD: ", error);
        res.status(500).send("Error a l eliminar registro");
      } else {
        CONNECTION.query(
          `DELETE FROM medicos WHERE cedula=${idDoc}`,
          (error, results) => {
            if (error) {
              console.log("Error al eliminar registro de la BD: ", error);
              res.status(500).send("Error en la consulta a la BD");
            } else {
              res.redirect("/doctors");
            }
          }
        );
      }
    }
  );
});
//! ACTIVAR LA VISTA DE EDICIÓN DE LOS INPUTS PARA ACTUALIZAR
router.get("/modify/:key", (req, res, next) => {
  const key = req.params.key;
  CONNECTION.query("SELECT * FROM medicos", (error, results) => {
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
      res.render("doctors", {
        title: "Medicos",
        doctors: results,
        option: "disabled",
        state: false,
        keyDoc: key,
        display: "none",
        show: validation(results)
      });
    }
  });
});
//!ACTUALIZAR
router.post("/update/:docId", (req, res, next) => {
  const dataDoc = {
    idDoc: req.params.docId,
    lNameDoc: req.body.lNameDoc,
    nameDoc: req.body.nameDoc,
    roomDoc: req.body.roomDoc,
    mailDoc: req.body.mailDoc,
    specDoc: req.body.specDoc,
  };
  console.log(dataDoc.mailDoc);
  CONNECTION.query(
    `UPDATE medicos SET nombre='${dataDoc.nameDoc}', apellido='${dataDoc.lNameDoc}', especialidad='${dataDoc.specDoc}', consultorio='${dataDoc.roomDoc}', correo='${dataDoc.mailDoc}' WHERE cedula=${dataDoc.idDoc}`,
    (error, results) => {
      if (error) {
        console.log("Error al actualizar datos en la BD: ", error);
        res.status(500).send("Error al actualizar datos en la BD");
      } else {
        res.redirect("/doctors");
      }
    }
  );
});
module.exports = router;
