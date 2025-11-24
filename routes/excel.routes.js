import { Router } from "express";
import multer from "multer";
import excelController_vc_bb from "../api/controllers/excel.controller.js";

const routerProfesoresExcel_vc_bb = Router();
const routerEspaciosExcel_vc_bb = Router();
const routerGradosExcel_vc_bb = Router();
const routerSeccionesExcel_vc_bb = Router();
const routerPensumExcel_vc_bb = Router();
const routerAsignaturasExcel_vc_bb = Router();
const routerDisponibilidadesExcel_vc_bb = Router();

const upload_vc_bb = multer({ dest: "uploads/" });

routerGradosExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirGradosExcel_vc_bb(req, res));
routerGradosExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarGradosExcel_vc_bb(req, res));

routerSeccionesExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirSeccionesExcel_vc_bb(req, res));
routerSeccionesExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarSeccionesExcel_vc_bb(req, res));

routerPensumExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirGradosSeccionesExcel_vc_bb(req, res));
routerPensumExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarGradosSeccionesExcel_vc_bb(req, res));

routerAsignaturasExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirAsignaturasGradosExcel_vc_bb(req, res));
routerAsignaturasExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarAsignaturasGradosExcel_vc_bb(req, res));

routerDisponibilidadesExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirDisponibilidadesExcel_vc_bb(req, res));
routerDisponibilidadesExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarDisponibilidadesExcel_vc_bb(req, res));

export { routerProfesoresExcel_vc_bb, routerEspaciosExcel_vc_bb, routerGradosExcel_vc_bb, routerSeccionesExcel_vc_bb, routerPensumExcel_vc_bb, routerAsignaturasExcel_vc_bb, routerDisponibilidadesExcel_vc_bb };
export default routerProfesoresExcel_vc_bb;
routerProfesoresExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirProfesoresExcel_vc_bb(req, res));
routerProfesoresExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarProfesoresExcel_vc_bb(req, res));

routerEspaciosExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirEspaciosExcel_vc_bb(req, res));
routerEspaciosExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarEspaciosExcel_vc_bb(req, res));
