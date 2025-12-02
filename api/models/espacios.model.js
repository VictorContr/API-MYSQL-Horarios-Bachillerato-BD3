import { query_vc_bb, execute_vc_bb } from "../db.js";

export class EspacioModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (EspacioModel_vc_bb.#instancia_vc_bb) {
      return EspacioModel_vc_bb.#instancia_vc_bb;
    }
    EspacioModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!EspacioModel_vc_bb.#instancia_vc_bb) {
      EspacioModel_vc_bb.#instancia_vc_bb = new EspacioModel_vc_bb();
    }
    return EspacioModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerTodos_vc_bb() {
    return await query_vc_bb("SELECT * FROM td_Espacios_bb_vc ORDER BY nombre_bb_vc");
  }

  async obtenerTipos_vc_bb() {
    return await query_vc_bb("SELECT ID_TipoEspacio_bb_vc, tipo_bb_vc FROM td_TipoEspacio_bb_vc ORDER BY tipo_bb_vc");
  }

  async crear_vc_bb({ nombre_bb_vc, capacidad_bb_vc = null, ID_TipoEspacio_espacio_bb_vc = null }) {
    const res_vc_bb = await execute_vc_bb(
      "INSERT INTO td_Espacios_bb_vc (nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc) VALUES (?,?,?)",
      [nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc]
    );
    return res_vc_bb.insertId;
  }

  async actualizar_vc_bb(id_vc_bb, { nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc }) {
    const res_vc_bb = await execute_vc_bb(
      "UPDATE td_Espacios_bb_vc SET nombre_bb_vc = ?, capacidad_bb_vc = ?, ID_TipoEspacio_espacio_bb_vc = ? WHERE ID_espacio_bb_vc = ?",
      [nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc, id_vc_bb]
    );
    return res_vc_bb.affectedRows || 0;
  }

  async eliminar_vc_bb(id_vc_bb) {
    const res_vc_bb = await execute_vc_bb("DELETE FROM td_Espacios_bb_vc WHERE ID_espacio_bb_vc = ?", [id_vc_bb]);
    return res_vc_bb.affectedRows || 0;
  }
}

export default EspacioModel_vc_bb;
/*
EspaciosModel (MySQL)
- CRUD de espacios físicos.
- Validación de tipo y capacidad.
*/
