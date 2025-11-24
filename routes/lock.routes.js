import { Router } from "express";
import lockController_vc_bb from "../api/controllers/lock.controller.js";
import { requireAdmin_vc_bb } from "../middleware/auth.middleware.js";

const router_vc_bb = Router();

router_vc_bb.get("/verificar/:tipoCarga", (req, res) => lockController_vc_bb.verificarDatosExistentes_vc_bb(req, res));
router_vc_bb.post("/rollback/:tipoCarga", requireAdmin_vc_bb, (req, res) => lockController_vc_bb.ejecutarRollback_vc_bb(req, res));
router_vc_bb.get("/respaldos", requireAdmin_vc_bb, (req, res) => lockController_vc_bb.obtenerRespaldos_vc_bb(req, res));
router_vc_bb.post("/restaurar/:nombreRespaldo", requireAdmin_vc_bb, (req, res) => lockController_vc_bb.restaurarRespaldo_vc_bb(req, res));

export default router_vc_bb;
