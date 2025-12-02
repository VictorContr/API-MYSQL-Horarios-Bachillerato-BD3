import { query_vc_bb, getOne_vc_bb, execute_vc_bb } from "../db.js";

export class GradoAsignaturaModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (GradoAsignaturaModel_vc_bb.#instancia_vc_bb) {
      return GradoAsignaturaModel_vc_bb.#instancia_vc_bb;
    }
    GradoAsignaturaModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!GradoAsignaturaModel_vc_bb.#instancia_vc_bb) {
      GradoAsignaturaModel_vc_bb.#instancia_vc_bb = new GradoAsignaturaModel_vc_bb();
    }
    return GradoAsignaturaModel_vc_bb.#instancia_vc_bb;
  }

  async obtenerTodos_vc_bb() {
    const sql_vc_bb = `
      SELECT 
        ga.ID_gradoAsignatura_bb_vc,
        ga.ID_grado_gradoAsig_bb_vc,
        ga.ID_asignatura_gradoAsig_bb_vc,
        g.nro_grado_bb_vc,
        a.nombre_bb_vc AS nombre_asignatura_bb_vc
      FROM td_GradosAsignaturas_bb_vc ga
      JOIN td_Grados_bb_vc g ON g.ID_grado_bb_vc = ga.ID_grado_gradoAsig_bb_vc
      JOIN td_Asignaturas_bb_vc a ON a.ID_asignatura_bb_vc = ga.ID_asignatura_gradoAsig_bb_vc
      ORDER BY g.nro_grado_bb_vc ASC, a.nombre_bb_vc ASC
    `;
    return await query_vc_bb(sql_vc_bb);
  }

  async obtenerPorId_vc_bb(id_vc_bb) {
    const sql_vc_bb = `
      SELECT 
        ga.ID_gradoAsignatura_bb_vc,
        ga.ID_grado_gradoAsig_bb_vc,
        ga.ID_asignatura_gradoAsig_bb_vc
      FROM td_GradosAsignaturas_bb_vc ga
      WHERE ga.ID_gradoAsignatura_bb_vc = ?
      LIMIT 1
    `;
    return await getOne_vc_bb(sql_vc_bb, [id_vc_bb]);
  }

  async crear_vc_bb({ ID_grado_gradoAsig_bb_vc, ID_asignatura_gradoAsig_bb_vc }) {
    const res_vc_bb = await execute_vc_bb(
      "INSERT INTO td_GradosAsignaturas_bb_vc (ID_grado_gradoAsig_bb_vc, ID_asignatura_gradoAsig_bb_vc) VALUES (?, ?)",
      [ID_grado_gradoAsig_bb_vc, ID_asignatura_gradoAsig_bb_vc]
    );
    return res_vc_bb.insertId;
  }

  async actualizar_vc_bb(id_vc_bb, { ID_grado_gradoAsig_bb_vc, ID_asignatura_gradoAsig_bb_vc }) {
    const res_vc_bb = await execute_vc_bb(
      "UPDATE td_GradosAsignaturas_bb_vc SET ID_grado_gradoAsig_bb_vc = ?, ID_asignatura_gradoAsig_bb_vc = ? WHERE ID_gradoAsignatura_bb_vc = ?",
      [ID_grado_gradoAsig_bb_vc, ID_asignatura_gradoAsig_bb_vc, id_vc_bb]
    );
    return res_vc_bb.affectedRows || 0;
  }

  async eliminar_vc_bb(id_vc_bb) {
    const res_vc_bb = await execute_vc_bb(
      "DELETE FROM td_GradosAsignaturas_bb_vc WHERE ID_gradoAsignatura_bb_vc = ?",
      [id_vc_bb]
    );
    return res_vc_bb.affectedRows || 0;
  }
}

export default GradoAsignaturaModel_vc_bb;
/*
GradoAsignaturaModel (MySQL)
- Vincula grados con asignaturas.
- Consultas y mantenimiento de relaciones.
*/
