import { query_vc_bb, getOne_vc_bb, execute_vc_bb } from "../db.js";

export const getAllGrados_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows_vc_bb = await query_vc_bb("SELECT * FROM td_Grados_bb_vc ORDER BY nro_grado_bb_vc");
    res_vc_bb.json(rows_vc_bb);
  } catch (_) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al obtener grados" });
  }
};

export const getGradoById_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const grado_vc_bb = await getOne_vc_bb("SELECT * FROM td_Grados_bb_vc WHERE ID_grado_bb_vc = ?", [req_vc_bb.params.id]);
    if (!grado_vc_bb) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Grado no encontrado" });
    res_vc_bb.json(grado_vc_bb);
  } catch (_) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al obtener grado" });
  }
};

export const createGrado_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { nro_grado_bb_vc } = req_vc_bb.body;
    const n = parseInt(String(nro_grado_bb_vc), 10);
    if (!Number.isInteger(n) || n < 1 || n > 5) return res_vc_bb.status(400).json({ mensaje_vc_bb: "nro_grado_bb_vc inválido" });
    const exists_vc_bb = await getOne_vc_bb("SELECT 1 FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ?", [n]);
    if (exists_vc_bb) return res_vc_bb.status(409).json({ mensaje_vc_bb: "El grado ya existe" });
    const result_vc_bb = await execute_vc_bb("INSERT INTO td_Grados_bb_vc (nro_grado_bb_vc) VALUES (?)", [n]);
    res_vc_bb.status(201).json({ mensaje_vc_bb: "Grado creado", id_grado_vc_bb: result_vc_bb.insertId });
  } catch (_) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al crear grado" });
  }
};

export const updateGrado_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const { nro_grado_bb_vc } = req_vc_bb.body;
    const n = parseInt(String(nro_grado_bb_vc), 10);
    if (!Number.isInteger(n) || n < 1 || n > 5) return res_vc_bb.status(400).json({ mensaje_vc_bb: "nro_grado_bb_vc inválido" });
    const dup_vc_bb = await getOne_vc_bb("SELECT 1 FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ? AND ID_grado_bb_vc <> ?", [n, id]);
    if (dup_vc_bb) return res_vc_bb.status(409).json({ mensaje_vc_bb: "Ya existe un grado con ese número" });
    const result_vc_bb = await execute_vc_bb("UPDATE td_Grados_bb_vc SET nro_grado_bb_vc = ? WHERE ID_grado_bb_vc = ?", [n, id]);
    if (!result_vc_bb.affectedRows) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Grado no encontrado" });
    res_vc_bb.json({ mensaje_vc_bb: "Grado actualizado" });
  } catch (_) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al actualizar grado" });
  }
};

export const deleteGrado_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const result_vc_bb = await execute_vc_bb("DELETE FROM td_Grados_bb_vc WHERE ID_grado_bb_vc = ?", [req_vc_bb.params.id]);
    if (!result_vc_bb.affectedRows) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Grado no encontrado" });
    res_vc_bb.json({ mensaje_vc_bb: "Grado eliminado" });
  } catch (_) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al eliminar grado" });
  }
};

export default {
  getAllGrados_vc_bb,
  getGradoById_vc_bb,
  createGrado_vc_bb,
  updateGrado_vc_bb,
  deleteGrado_vc_bb,
};
