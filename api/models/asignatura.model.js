import { query_vc_bb, getOne_vc_bb, execute_vc_bb } from "../db.js";

export class AsignaturaModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (AsignaturaModel_vc_bb.#instancia_vc_bb) {
      return AsignaturaModel_vc_bb.#instancia_vc_bb;
    }
    AsignaturaModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!AsignaturaModel_vc_bb.#instancia_vc_bb) {
      AsignaturaModel_vc_bb.#instancia_vc_bb = new AsignaturaModel_vc_bb();
    }
    return AsignaturaModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerTodos_vc_bb() {
    const sql_vc_bb = `
      SELECT 
        a.*,
        te.tipo_bb_vc AS tipoEspacio_bb_vc,
        COALESCE(GROUP_CONCAT(g.nro_grado_bb_vc SEPARATOR ' | '), '') AS grados_vc_bb
      FROM td_Asignaturas_bb_vc a
      LEFT JOIN td_TipoEspacio_bb_vc te ON a.ID_TipoEspacio_requerido_bb_vc = te.ID_TipoEspacio_bb_vc
      LEFT JOIN td_GradosAsignaturas_bb_vc ga ON ga.ID_asignatura_gradoAsig_bb_vc = a.ID_asignatura_bb_vc
      LEFT JOIN td_Grados_bb_vc g ON ga.ID_grado_gradoAsig_bb_vc = g.ID_grado_bb_vc
      GROUP BY a.ID_asignatura_bb_vc
      ORDER BY a.nombre_bb_vc
    `;
    return await query_vc_bb(sql_vc_bb);
  }

  async obtenerPorId_vc_bb(id_vc_bb) {
    const sql_vc_bb = `
      SELECT a.*, te.tipo_bb_vc as tipoEspacio_bb_vc
      FROM td_Asignaturas_bb_vc a
      LEFT JOIN td_TipoEspacio_bb_vc te ON a.ID_TipoEspacio_requerido_bb_vc = te.ID_TipoEspacio_bb_vc
      WHERE a.ID_asignatura_bb_vc = ?
      LIMIT 1
    `;
    return await getOne_vc_bb(sql_vc_bb, [id_vc_bb]);
  }

  async obtenerPorNombre_vc_bb(nombre_vc_bb) {
    const sql_vc_bb = `
      SELECT a.*, te.tipo_bb_vc as tipoEspacio_bb_vc
      FROM td_Asignaturas_bb_vc a
      LEFT JOIN td_TipoEspacio_bb_vc te ON a.ID_TipoEspacio_requerido_bb_vc = te.ID_TipoEspacio_bb_vc
      WHERE a.nombre_bb_vc = ?
      LIMIT 1
    `;
    return await getOne_vc_bb(sql_vc_bb, [nombre_vc_bb]);
  }

  async crear_vc_bb({ nombre_bb_vc, horas_academicas_bb_vc = null, descripcion_bb_vc = null, duracion_bloque_min_bb_vc = 1, duracion_bloque_max_bb_vc = 1, ID_TipoEspacio_requerido_bb_vc = null }) {
    if (!nombre_bb_vc || String(nombre_bb_vc).trim() === "") {
      throw new Error("El nombre de la asignatura es requerido");
    }
    const result_vc_bb = await execute_vc_bb(
      "INSERT INTO td_Asignaturas_bb_vc (nombre_bb_vc, horas_academicas_bb_vc, descripcion_bb_vc, duracion_bloque_min_bb_vc, duracion_bloque_max_bb_vc, ID_TipoEspacio_requerido_bb_vc) VALUES (?,?,?,?,?,?)",
      [nombre_bb_vc, horas_academicas_bb_vc, descripcion_bb_vc, duracion_bloque_min_bb_vc, duracion_bloque_max_bb_vc, ID_TipoEspacio_requerido_bb_vc]
    );
    return result_vc_bb.insertId;
  }

  async actualizar_vc_bb(id_vc_bb, datos_vc_bb = {}) {
    const fields = [
      "nombre_bb_vc",
      "horas_academicas_bb_vc",
      "descripcion_bb_vc",
      "duracion_bloque_min_bb_vc",
      "duracion_bloque_max_bb_vc",
      "ID_TipoEspacio_requerido_bb_vc",
    ];
    const setParts = [];
    const values = [];
    for (const f of fields) {
      if (datos_vc_bb[f] !== undefined) {
        setParts.push(`${f} = ?`);
        values.push(datos_vc_bb[f]);
      }
    }
    if (!setParts.length) return 0;
    values.push(id_vc_bb);
    const res_vc_bb = await execute_vc_bb(`UPDATE td_Asignaturas_bb_vc SET ${setParts.join(", ")} WHERE ID_asignatura_bb_vc = ?`, values);
    return res_vc_bb.affectedRows || 0;
  }

  async eliminar_vc_bb(id_vc_bb) {
    const res_vc_bb = await execute_vc_bb("DELETE FROM td_Asignaturas_bb_vc WHERE ID_asignatura_bb_vc = ?", [id_vc_bb]);
    return res_vc_bb.affectedRows || 0;
  }

  async obtenerAsignaturasPorGrado_vc_bb(idGrado_vc_bb) {
    const sql_vc_bb = `
      SELECT a.*, te.tipo_bb_vc AS tipoEspacio_bb_vc
      FROM td_Asignaturas_bb_vc a
      JOIN td_GradosAsignaturas_bb_vc ga ON a.ID_asignatura_bb_vc = ga.ID_asignatura_gradoAsig_bb_vc
      LEFT JOIN td_TipoEspacio_bb_vc te ON a.ID_TipoEspacio_requerido_bb_vc = te.ID_TipoEspacio_bb_vc
      WHERE ga.ID_grado_gradoAsig_bb_vc = ?
      ORDER BY a.nombre_bb_vc
    `;
    return await query_vc_bb(sql_vc_bb, [idGrado_vc_bb]);
  }

  async vincularConGrado_vc_bb(idAsignatura_vc_bb, idGrado_vc_bb) {
    await execute_vc_bb(
      "INSERT IGNORE INTO td_GradosAsignaturas_bb_vc (ID_grado_gradoAsig_bb_vc, ID_asignatura_gradoAsig_bb_vc) VALUES (?,?)",
      [idGrado_vc_bb, idAsignatura_vc_bb]
    );
  }

  async desvincularConGrado_vc_bb(idAsignatura_vc_bb, idGrado_vc_bb) {
    const res_vc_bb = await execute_vc_bb(
      "DELETE FROM td_GradosAsignaturas_bb_vc WHERE ID_grado_gradoAsig_bb_vc = ? AND ID_asignatura_gradoAsig_bb_vc = ?",
      [idGrado_vc_bb, idAsignatura_vc_bb]
    );
    return res_vc_bb.affectedRows || 0;
  }
}

export default AsignaturaModel_vc_bb;
