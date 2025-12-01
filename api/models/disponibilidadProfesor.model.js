import { query_vc_bb, execute_vc_bb } from "../db.js";

export class DisponibilidadProfesorModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (DisponibilidadProfesorModel_vc_bb.#instancia_vc_bb) {
      return DisponibilidadProfesorModel_vc_bb.#instancia_vc_bb;
    }
    DisponibilidadProfesorModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!DisponibilidadProfesorModel_vc_bb.#instancia_vc_bb) {
      DisponibilidadProfesorModel_vc_bb.#instancia_vc_bb = new DisponibilidadProfesorModel_vc_bb();
    }
    return DisponibilidadProfesorModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerTodos_vc_bb() {
    const sql_vc_bb = `
      SELECT dp.ID_DisponibilidadProfesor_bb_vc, d.dia_bb_vc, b.hora_bloque_bb_vc, u.userName_bb_vc, p.ID_profesor_bb_vc
      FROM td_DisponibilidadProfesor_bb_vc dp
      JOIN td_Dia_bb_vc d ON dp.ID_dia_DispProfesor_bb_vc = d.ID_dia_bb_vc
      JOIN td_Bloque_bb_vc b ON dp.ID_bloque_DispProfesor_bb_vc = b.ID_bloque_bb_vc
      JOIN td_Profesores_bb_vc p ON dp.ID_profesor_DispProfesor_bb_vc = p.ID_profesor_bb_vc
      JOIN td_UsuarioRol_bb_vc ur ON p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc
      JOIN td_Usuarios_bb_vc u ON ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc
      ORDER BY d.ID_dia_bb_vc, b.ID_bloque_bb_vc
    `;
    return await query_vc_bb(sql_vc_bb);
  }

  async crear_vc_bb({ ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc }) {
    const res_vc_bb = await execute_vc_bb(
      "INSERT IGNORE INTO td_DisponibilidadProfesor_bb_vc (ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc) VALUES (?,?,?)",
      [ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc]
    );
    return res_vc_bb.insertId || 0;
  }

  async eliminar_vc_bb(id_vc_bb) {
    const res_vc_bb = await execute_vc_bb(
      "DELETE FROM td_DisponibilidadProfesor_bb_vc WHERE ID_DisponibilidadProfesor_bb_vc = ?",
      [id_vc_bb]
    );
    return res_vc_bb.affectedRows || 0;
  }

  async actualizar_vc_bb(id_vc_bb, { ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc }) {
    const res_vc_bb = await execute_vc_bb(
      "UPDATE td_DisponibilidadProfesor_bb_vc SET ID_dia_DispProfesor_bb_vc = ?, ID_bloque_DispProfesor_bb_vc = ?, ID_profesor_DispProfesor_bb_vc = ? WHERE ID_DisponibilidadProfesor_bb_vc = ?",
      [ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc, id_vc_bb]
    );
    return res_vc_bb.affectedRows || 0;
  }
}

export default DisponibilidadProfesorModel_vc_bb;
