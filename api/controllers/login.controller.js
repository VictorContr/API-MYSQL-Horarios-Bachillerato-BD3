/*
LoginController (MySQL)
- login_vc_bb: autentica y retorna datos mínimos + ID_profesor.
*/
import LoginModel_vc_bb from "../models/login.model.js";
import { getOne_vc_bb } from "../db.js";

export const login_vc_bb = async (req_vc_bb, res_vc_bb) => {
  const { userName_bb_vc, password_bb_vc } = req_vc_bb.body;
  try {
    const model_vc_bb = LoginModel_vc_bb.obtenerInstancia_vc_bb();
    const user_vc_bb = await model_vc_bb.login_vc_bb(userName_bb_vc, password_bb_vc);

    if (!user_vc_bb) {
      return res_vc_bb.status(401).json({ message: "Credenciales inválidas" });
    }

    res_vc_bb.json({
      ID_usuario: user_vc_bb.ID_usuario_bb_vc,
      nombre: user_vc_bb.nombre_bb_vc,
      apellido: user_vc_bb.apellido_bb_vc,
      correo: user_vc_bb.correo_bb_vc,
      telefono: user_vc_bb.telefono_bb_vc,
      userName: user_vc_bb.userName_bb_vc,
      rol: user_vc_bb.nombre_rol_bb_vc,
      ID_profesor: (await getOne_vc_bb(
        "SELECT p.ID_profesor_bb_vc AS ID_profesor FROM td_Profesores_bb_vc p JOIN td_UsuarioRol_bb_vc ur ON p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc WHERE ur.ID_usuario_usuarioRol_bb_vc = ?",
        [user_vc_bb.ID_usuario_bb_vc]
      ))?.ID_profesor || null,
    });
  } catch (error_vc_bb) {
    console.error("Error en login:", error_vc_bb);
    res_vc_bb.status(500).json({ message: "Error en el servidor" });
  }
};

export default { login_vc_bb };
