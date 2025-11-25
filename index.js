import express from "express";
import morgan from "morgan";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";

import { initDatabase_vc_bb } from "./api/db.js";
import usuariosRoutes_vc_bb from "./routes/usuarios.routes.js";
import diasRoutes_vc_bb from "./routes/dias.routes.js";
import bloquesRoutes_vc_bb from "./routes/bloques.routes.js";
import espaciosRoutes_vc_bb from "./routes/espacios.routes.js";
import gradosRoutes_vc_bb from "./routes/grados.routes.js";
import asignaturasRoutes_vc_bb from "./routes/asignaturas.routes.js";
import disponibilidadRoutes_vc_bb from "./routes/disponibilidad.routes.js";
import clasesRoutes_vc_bb from "./routes/clases.routes.js";
import seccionesRoutes_vc_bb from "./routes/secciones.routes.js";
import profesoresRoutes_vc_bb from "./routes/profesores.routes.js";
import schemaRoutes_vc_bb from "./routes/schema.routes.js";
import indexRoutes_vc_bb from "./routes/index.routes.js";
import loginRoutes_vc_bb from "./routes/login.routes.js";
import excelProfesoresRouter_vc_bb, { routerEspaciosExcel_vc_bb, routerGradosExcel_vc_bb, routerSeccionesExcel_vc_bb, routerPensumExcel_vc_bb, routerAsignaturasExcel_vc_bb, routerDisponibilidadesExcel_vc_bb } from "./routes/excel.routes.js";
import lockRoutes_vc_bb from "./routes/lock.routes.js";

dotenvConfig();

const PORT_vc_bb = process.env.PORT || 3300;
const app_vc_bb = express();

app_vc_bb.use(morgan("dev"));
app_vc_bb.use(express.json());
app_vc_bb.use(express.urlencoded({ extended: true }));
app_vc_bb.use(cors());

app_vc_bb.use("/api/usuarios", usuariosRoutes_vc_bb);
app_vc_bb.use("/api/dias", diasRoutes_vc_bb);
app_vc_bb.use("/api/bloques", bloquesRoutes_vc_bb);
app_vc_bb.use("/api/espacios", espaciosRoutes_vc_bb);
app_vc_bb.use("/api/grados", gradosRoutes_vc_bb);
app_vc_bb.use("/api/asignaturas", asignaturasRoutes_vc_bb);
app_vc_bb.use("/api/disponibilidad", disponibilidadRoutes_vc_bb);
app_vc_bb.use("/api/clases", clasesRoutes_vc_bb);
app_vc_bb.use("/api/secciones", seccionesRoutes_vc_bb);
app_vc_bb.use("/api/profesores", profesoresRoutes_vc_bb);
app_vc_bb.use("/api/schema", schemaRoutes_vc_bb);
app_vc_bb.use("/", indexRoutes_vc_bb);
app_vc_bb.use("/api/login", loginRoutes_vc_bb);
app_vc_bb.use("/api/profesores/excel", excelProfesoresRouter_vc_bb);
app_vc_bb.use("/api/espacios/excel", routerEspaciosExcel_vc_bb);
app_vc_bb.use("/api/grados/excel", routerGradosExcel_vc_bb);
app_vc_bb.use("/api/secciones/excel", routerSeccionesExcel_vc_bb);
app_vc_bb.use("/api/pensum/excel", routerPensumExcel_vc_bb);
app_vc_bb.use("/api/asignaturas/excel", routerAsignaturasExcel_vc_bb);
app_vc_bb.use("/api/disponibilidades/excel", routerDisponibilidadesExcel_vc_bb);
app_vc_bb.use("/api/lock", lockRoutes_vc_bb);

app_vc_bb.get("/", (req, res) => {
  res.json({ status: "API MySQL operativa" });
});

initDatabase_vc_bb()
  .then(() => {
    app_vc_bb.listen(PORT_vc_bb, () => {
      console.log(`API MySQL escuchando en http://localhost:${PORT_vc_bb}`);
    });
  })
  .catch((err) => {
    console.error("Error inicializando la base de datos:", err);
    process.exit(1);
  });
