import { Router } from "express";
import { generarHorarios_vc_bb, obtenerHorariosProfesor_vc_bb, obtenerProfesorPorUsuario_vc_bb } from "../api/controllers/horarios.controller.js";

const router_vc_bb = Router();

router_vc_bb.post("/generar", generarHorarios_vc_bb);
router_vc_bb.get("/profesor/:idProfesor", obtenerHorariosProfesor_vc_bb);
router_vc_bb.get("/profesor-por-usuario/:idUsuario", obtenerProfesorPorUsuario_vc_bb);

export default router_vc_bb;
