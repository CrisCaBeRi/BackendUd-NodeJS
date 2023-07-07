var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//* Modulos exportados
const EXPBHS = require("express-handlebars");
const MOMENT = require("moment");
//! RUTAS A JS
var indexRouter = require("./routes/index");
var doctorsRouter = require("./routes/doctors");
var patientsRouter = require("./routes/patients");
var appointmentRouter = require("./routes/appointment");
var app = express();
//* Configuración para reconocer los archivos de la carpeta views.
const HBS = EXPBHS.create({
  defaultLayout: "main",
  layoutsDir: __dirname + "/views/layouts",
  extname: ".hbs",
  partialsDir: ["views/components"],
});
//! HELPERS
//? HELPER PARA BLOQUEAR LA EDICION DE LOS INPUTS EN LOS DOCS HBS
HBS.handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});
//? HELPER DATE 
HBS.handlebars.registerHelper("formatDate", (date)=>{
  return MOMENT(date).format("DD/MM/YYYY");
}); 
// view engine setup
app.engine(".hbs", HBS.engine); //? Definbición del uso del motor de plantilla
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//! USO DE RUTAS JS CON HANDLEBARS
app.use("/", indexRouter);
app.use("/doctors", doctorsRouter);
app.use("/patients", patientsRouter );
app.use("/appointment", appointmentRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;