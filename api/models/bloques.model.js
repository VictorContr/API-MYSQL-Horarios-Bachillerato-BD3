import { query_vc_bb } from "../db.js";

export class BloqueModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (BloqueModel_vc_bb.#instancia_vc_bb) {
      return BloqueModel_vc_bb.#instancia_vc_bb;
    }
    BloqueModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!BloqueModel_vc_bb.#instancia_vc_bb) {
      BloqueModel_vc_bb.#instancia_vc_bb = new BloqueModel_vc_bb();
    }
    return BloqueModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerTodos_vc_bb() {
    return await query_vc_bb("SELECT * FROM td_Bloque_bb_vc ORDER BY ID_bloque_bb_vc");
  }
}

export default BloqueModel_vc_bb;
