import { query_vc_bb, getOne_vc_bb, execute_vc_bb } from "../db.js";

export class SeccionModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (SeccionModel_vc_bb.#instancia_vc_bb) {
      return SeccionModel_vc_bb.#instancia_vc_bb;
    }
    SeccionModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!SeccionModel_vc_bb.#instancia_vc_bb) {
      SeccionModel_vc_bb.#instancia_vc_bb = new SeccionModel_vc_bb();
    }
    return SeccionModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerTodos_vc_bb() {
    return await query_vc_bb("SELECT * FROM td_Secciones_bb_vc ORDER BY letra_seccion_bb_vc");
  }

  async obtenerPorId_vc_bb(id_vc_bb) {
    return await getOne_vc_bb("SELECT * FROM td_Secciones_bb_vc WHERE ID_seccion_bb_vc = ?", [id_vc_bb]);
  }

  async existePorLetra_vc_bb(letra_vc_bb, excluirId_vc_bb = null) {
    const letra = String(letra_vc_bb || "").trim();
    if (excluirId_vc_bb != null) {
      return await getOne_vc_bb("SELECT 1 FROM td_Secciones_bb_vc WHERE letra_seccion_bb_vc = ? AND ID_seccion_bb_vc <> ?", [letra, excluirId_vc_bb]);
    }
    return await getOne_vc_bb("SELECT 1 FROM td_Secciones_bb_vc WHERE letra_seccion_bb_vc = ?", [letra]);
  }

  async crear_vc_bb(letra_vc_bb) {
    const letra = String(letra_vc_bb || "").trim();
    const res = await execute_vc_bb("INSERT INTO td_Secciones_bb_vc (letra_seccion_bb_vc) VALUES (?)", [letra]);
    return res.insertId;
  }

  async actualizar_vc_bb(id_vc_bb, letra_vc_bb) {
    const letra = String(letra_vc_bb || "").trim();
    const res = await execute_vc_bb("UPDATE td_Secciones_bb_vc SET letra_seccion_bb_vc = ? WHERE ID_seccion_bb_vc = ?", [letra, id_vc_bb]);
    return res.affectedRows || 0;
  }

  async eliminar_vc_bb(id_vc_bb) {
    const res = await execute_vc_bb("DELETE FROM td_Secciones_bb_vc WHERE ID_seccion_bb_vc = ?", [id_vc_bb]);
    return res.affectedRows || 0;
  }
}

export default SeccionModel_vc_bb;

