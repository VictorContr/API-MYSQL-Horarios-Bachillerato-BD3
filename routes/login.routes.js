import { Router } from "express";
import { login_vc_bb } from "../api/controllers/login.controller.js";

const routerLogin_vc_bb = Router();

routerLogin_vc_bb.post("/", login_vc_bb);

export default routerLogin_vc_bb;

