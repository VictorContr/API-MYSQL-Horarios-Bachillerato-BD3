import db_vc_bb from "../db.js";

export class RolModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (RolModel_vc_bb.#instancia_vc_bb) {
      return RolModel_vc_bb.#instancia_vc_bb;
    }
    RolModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!RolModel_vc_bb.#instancia_vc_bb) {
      RolModel_vc_bb.#instancia_vc_bb = new RolModel_vc_bb();
    }
    return RolModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerPorNombre_vc_bb(nombreRol_vc_bb) {
    const sql_vc_bb = `SELECT * FROM td_Rol_bb_vc WHERE rol_bb_vc = ? LIMIT 1`;
    return await db_vc_bb.getOne_vc_bb(sql_vc_bb, [nombreRol_vc_bb]);
  }
}

export default RolModel_vc_bb;

