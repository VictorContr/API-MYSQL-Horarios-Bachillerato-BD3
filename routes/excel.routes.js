import { Router } from "express";
import multer from "multer";
import excelController_vc_bb from "../api/controllers/excel.controller.js";

const routerGradosExcel_vc_bb = Router();
const routerSeccionesExcel_vc_bb = Router();
const routerPensumExcel_vc_bb = Router();

const upload_vc_bb = multer({ dest: "uploads/" });

routerGradosExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirGradosExcel_vc_bb(req, res));
routerGradosExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarGradosExcel_vc_bb(req, res));

routerSeccionesExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirSeccionesExcel_vc_bb(req, res));
routerSeccionesExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarSeccionesExcel_vc_bb(req, res));

routerPensumExcel_vc_bb.post("/upload", upload_vc_bb.single("archivo"), (req, res) => excelController_vc_bb.subirGradosSeccionesExcel_vc_bb(req, res));
routerPensumExcel_vc_bb.get("/download", (req, res) => excelController_vc_bb.descargarGradosSeccionesExcel_vc_bb(req, res));

export { routerGradosExcel_vc_bb, routerSeccionesExcel_vc_bb, routerPensumExcel_vc_bb };
export default routerGradosExcel_vc_bb;
