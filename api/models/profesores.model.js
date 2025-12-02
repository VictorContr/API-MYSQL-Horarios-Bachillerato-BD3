import { query_vc_bb } from "../db.js";

export class ProfesorModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (ProfesorModel_vc_bb.#instancia_vc_bb) {
      return ProfesorModel_vc_bb.#instancia_vc_bb;
    }
    ProfesorModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!ProfesorModel_vc_bb.#instancia_vc_bb) {
      ProfesorModel_vc_bb.#instancia_vc_bb = new ProfesorModel_vc_bb();
    }
    return ProfesorModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerTodos_vc_bb() {
    const sql_vc_bb = `
      SELECT p.ID_profesor_bb_vc, u.ID_usuario_bb_vc, u.userName_bb_vc, u.nombre_bb_vc, u.apellido_bb_vc, u.correo_bb_vc, u.telefono_bb_vc
      FROM td_Profesores_bb_vc p
      JOIN td_UsuarioRol_bb_vc ur ON p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc
      JOIN td_Usuarios_bb_vc u ON ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc
      ORDER BY u.apellido_bb_vc, u.nombre_bb_vc
    `;
    return await query_vc_bb(sql_vc_bb);
  }
}

export default ProfesorModel_vc_bb;
/*
ProfesoresModel (MySQL)
- CRUD de profesores.
- Asignación de materias y vínculo usuario/rol.
*/
