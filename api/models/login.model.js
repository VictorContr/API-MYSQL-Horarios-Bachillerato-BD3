import { getOne_vc_bb } from "../db.js";

export class LoginModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (LoginModel_vc_bb.#instancia_vc_bb) {
      return LoginModel_vc_bb.#instancia_vc_bb;
    }
    LoginModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!LoginModel_vc_bb.#instancia_vc_bb) {
      LoginModel_vc_bb.#instancia_vc_bb = new LoginModel_vc_bb();
    }
    return LoginModel_vc_bb.#instancia_vc_bb;
  }

  async login_vc_bb(userName_bb_vc, password_bb_vc) {
    const sql_vc_bb = `
      SELECT u.*, r.rol_bb_vc AS nombre_rol_bb_vc
      FROM td_Usuarios_bb_vc u
      LEFT JOIN td_UsuarioRol_bb_vc ur ON u.ID_usuario_bb_vc = ur.ID_usuario_usuarioRol_bb_vc
      LEFT JOIN td_Rol_bb_vc r ON ur.ID_rol_usuarioRol_bb_vc = r.ID_rol_bb_vc
      WHERE u.userName_bb_vc = ? AND u.password_bb_vc = ?
      LIMIT 1
    `;
    return await getOne_vc_bb(sql_vc_bb, [userName_bb_vc, password_bb_vc]);
  }
}

export default LoginModel_vc_bb;
