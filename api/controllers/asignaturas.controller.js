import { query_vc_bb, getOne_vc_bb, execute_vc_bb } from "../db.js";

export const getAllAsignaturas_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows_vc_bb = await query_vc_bb(`
      SELECT a.*, te.tipo_bb_vc as tipoEspacio_bb_vc
      FROM td_Asignaturas_bb_vc a
      LEFT JOIN td_TipoEspacio_bb_vc te ON a.ID_TipoEspacio_requerido_bb_vc = te.ID_TipoEspacio_bb_vc
      ORDER BY a.nombre_bb_vc
    `);
    res_vc_bb.json(rows_vc_bb);
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al obtener asignaturas", error_vc_bb: error_vc_bb.message });
  }
};

export const createAsignatura_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { nombre_bb_vc, horas_academicas_bb_vc, descripcion_bb_vc, duracion_bloque_min_bb_vc, duracion_bloque_max_bb_vc, ID_TipoEspacio_requerido_bb_vc, ID_grado_bb_vc, nro_grado_bb_vc } = req_vc_bb.body;
    if (!nombre_bb_vc) return res_vc_bb.status(400).json({ mensaje_vc_bb: "El nombre de la asignatura es requerido" });
    const dup_vc_bb = await getOne_vc_bb("SELECT 1 FROM td_Asignaturas_bb_vc WHERE nombre_bb_vc = ?", [nombre_bb_vc]);
    if (dup_vc_bb) return res_vc_bb.status(409).json({ mensaje_vc_bb: "La asignatura ya existe" });
    const result_vc_bb = await execute_vc_bb(
      "INSERT INTO td_Asignaturas_bb_vc (nombre_bb_vc, horas_academicas_bb_vc, descripcion_bb_vc, duracion_bloque_min_bb_vc, duracion_bloque_max_bb_vc, ID_TipoEspacio_requerido_bb_vc) VALUES (?,?,?,?,?,?)",
      [nombre_bb_vc, horas_academicas_bb_vc || null, descripcion_bb_vc || null, duracion_bloque_min_bb_vc || 1, duracion_bloque_max_bb_vc || 1, ID_TipoEspacio_requerido_bb_vc || null]
    );
    const idAsignatura_vc_bb = result_vc_bb.insertId;
    let idGrado_vc_bb = null;
    if (ID_grado_bb_vc != null) {
      idGrado_vc_bb = parseInt(String(ID_grado_bb_vc), 10);
    } else if (nro_grado_bb_vc != null) {
      const grado = await getOne_vc_bb("SELECT ID_grado_bb_vc FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ?", [parseInt(String(nro_grado_bb_vc), 10)]);
      idGrado_vc_bb = grado ? grado.ID_grado_bb_vc : null;
    }
    if (idGrado_vc_bb) {
      await execute_vc_bb("INSERT IGNORE INTO td_GradosAsignaturas_bb_vc (ID_grado_gradoAsig_bb_vc, ID_asignatura_gradoAsig_bb_vc) VALUES (?,?)", [idGrado_vc_bb, idAsignatura_vc_bb]);
    }
    res_vc_bb.status(201).json({ mensaje_vc_bb: "Asignatura creada", id_asignatura_vc_bb: idAsignatura_vc_bb });
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al crear asignatura", error_vc_bb: error_vc_bb.message });
  }
};

export const updateAsignatura_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const payload = req_vc_bb.body || {};
    const exists_vc_bb = await getOne_vc_bb("SELECT 1 FROM td_Asignaturas_bb_vc WHERE ID_asignatura_bb_vc = ?", [id]);
    if (!exists_vc_bb) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Asignatura no encontrada" });
    const fields = ["nombre_bb_vc","horas_academicas_bb_vc","descripcion_bb_vc","duracion_bloque_min_bb_vc","duracion_bloque_max_bb_vc","ID_TipoEspacio_requerido_bb_vc"];
    const setParts = [];
    const values = [];
    for (const f of fields) {
      if (payload[f] !== undefined) { setParts.push(`${f} = ?`); values.push(payload[f]); }
    }
    if (setParts.length) {
      values.push(id);
      await execute_vc_bb(`UPDATE td_Asignaturas_bb_vc SET ${setParts.join(", ")} WHERE ID_asignatura_bb_vc = ?`, values);
    }
    // Vincular con grado si se proporciona
    let idGrado_vc_bb = null;
    if (payload.ID_grado_bb_vc != null) {
      idGrado_vc_bb = parseInt(String(payload.ID_grado_bb_vc), 10);
    } else if (payload.nro_grado_bb_vc != null) {
      const grado = await getOne_vc_bb("SELECT ID_grado_bb_vc FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ?", [parseInt(String(payload.nro_grado_bb_vc), 10)]);
      idGrado_vc_bb = grado ? grado.ID_grado_bb_vc : null;
    }
    if (idGrado_vc_bb) {
      await execute_vc_bb("INSERT IGNORE INTO td_GradosAsignaturas_bb_vc (ID_grado_gradoAsig_bb_vc, ID_asignatura_gradoAsig_bb_vc) VALUES (?,?)", [idGrado_vc_bb, id]);
    }
    res_vc_bb.json({ mensaje_vc_bb: "Asignatura actualizada" });
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al actualizar asignatura", error_vc_bb: error_vc_bb.message });
  }
};

export const deleteAsignatura_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const result = await execute_vc_bb("DELETE FROM td_Asignaturas_bb_vc WHERE ID_asignatura_bb_vc = ?", [req_vc_bb.params.id]);
    if (!result.affectedRows) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Asignatura no encontrada" });
    res_vc_bb.json({ mensaje_vc_bb: "Asignatura eliminada" });
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al eliminar asignatura", error_vc_bb: error_vc_bb.message });
  }
};

export const getAsignaturasPorGrado_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { idGrado } = req_vc_bb.params;
    const grado = await getOne_vc_bb("SELECT 1 FROM td_Grados_bb_vc WHERE ID_grado_bb_vc = ?", [idGrado]);
    if (!grado) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Grado no encontrado" });
    const rows = await query_vc_bb(`
      SELECT a.* FROM td_Asignaturas_bb_vc a
      JOIN td_GradosAsignaturas_bb_vc ga ON a.ID_asignatura_bb_vc = ga.ID_asignatura_gradoAsig_bb_vc
      WHERE ga.ID_grado_gradoAsig_bb_vc = ?
      ORDER BY a.nombre_bb_vc
    `, [idGrado]);
    res_vc_bb.json(rows);
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al obtener asignaturas por grado", error_vc_bb: error_vc_bb.message });
  }
};

export default {
  getAllAsignaturas_vc_bb,
  createAsignatura_vc_bb,
  updateAsignatura_vc_bb,
  deleteAsignatura_vc_bb,
  getAsignaturasPorGrado_vc_bb,
};
