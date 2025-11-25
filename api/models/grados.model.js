import { query_vc_bb, getOne_vc_bb, execute_vc_bb } from "../db.js";

export class GradoModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (GradoModel_vc_bb.#instancia_vc_bb) {
      return GradoModel_vc_bb.#instancia_vc_bb;
    }
    GradoModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!GradoModel_vc_bb.#instancia_vc_bb) {
      GradoModel_vc_bb.#instancia_vc_bb = new GradoModel_vc_bb();
    }
    return GradoModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerTodos_vc_bb() {
    return await query_vc_bb("SELECT * FROM td_Grados_bb_vc ORDER BY nro_grado_bb_vc");
  }

  async obtenerPorId_vc_bb(id_vc_bb) {
    return await getOne_vc_bb("SELECT * FROM td_Grados_bb_vc WHERE ID_grado_bb_vc = ?", [id_vc_bb]);
  }

  async existePorNumero_vc_bb(nro_vc_bb, excluirId_vc_bb = null) {
    if (excluirId_vc_bb != null) {
      return await getOne_vc_bb("SELECT 1 FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ? AND ID_grado_bb_vc <> ?", [nro_vc_bb, excluirId_vc_bb]);
    }
    return await getOne_vc_bb("SELECT 1 FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ?", [nro_vc_bb]);
  }

  async crear_vc_bb(nro_vc_bb) {
    const res = await execute_vc_bb("INSERT INTO td_Grados_bb_vc (nro_grado_bb_vc) VALUES (?)", [nro_vc_bb]);
    return res.insertId;
  }

  async actualizar_vc_bb(id_vc_bb, nro_vc_bb) {
    const res = await execute_vc_bb("UPDATE td_Grados_bb_vc SET nro_grado_bb_vc = ? WHERE ID_grado_bb_vc = ?", [nro_vc_bb, id_vc_bb]);
    return res.affectedRows || 0;
  }

  async eliminar_vc_bb(id_vc_bb) {
    const res = await execute_vc_bb("DELETE FROM td_Grados_bb_vc WHERE ID_grado_bb_vc = ?", [id_vc_bb]);
    return res.affectedRows || 0;
  }
}

export default GradoModel_vc_bb;

