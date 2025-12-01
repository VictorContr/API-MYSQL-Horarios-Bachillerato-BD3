import { query_vc_bb } from "../db.js";

export class DiaModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (DiaModel_vc_bb.#instancia_vc_bb) {
      return DiaModel_vc_bb.#instancia_vc_bb;
    }
    DiaModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!DiaModel_vc_bb.#instancia_vc_bb) {
      DiaModel_vc_bb.#instancia_vc_bb = new DiaModel_vc_bb();
    }
    return DiaModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerTodos_vc_bb() {
    return await query_vc_bb("SELECT * FROM td_Dia_bb_vc ORDER BY ID_dia_bb_vc");
  }
}

export default DiaModel_vc_bb;
