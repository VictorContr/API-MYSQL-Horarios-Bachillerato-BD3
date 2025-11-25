import { Router } from "express";
import { getAllProfesores_vc_bb } from "../api/controllers/profesores.controller.js";

const router_vc_bb = Router();

router_vc_bb.get("/", getAllProfesores_vc_bb);

export default router_vc_bb;
