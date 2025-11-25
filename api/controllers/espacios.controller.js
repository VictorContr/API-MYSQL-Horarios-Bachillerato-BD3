import { query_vc_bb, execute_vc_bb } from "../db.js";

export const getAllEspacios_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows_vc_bb = await query_vc_bb("SELECT * FROM td_Espacios_bb_vc ORDER BY nombre_bb_vc");
    res_vc_bb.json(rows_vc_bb);
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al obtener espacios" });
  }
};

export const getAllTipoEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows_vc_bb = await query_vc_bb("SELECT ID_TipoEspacio_bb_vc, tipo_bb_vc FROM td_TipoEspacio_bb_vc ORDER BY tipo_bb_vc");
    res_vc_bb.json(rows_vc_bb);
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al obtener tipos de espacio" });
  }
};

export const createEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc } = req_vc_bb.body;
    if (!nombre_bb_vc) return res_vc_bb.status(400).json({ message: "Falta nombre" });
    const result_vc_bb = await execute_vc_bb(
      "INSERT INTO td_Espacios_bb_vc (nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc) VALUES (?,?,?)",
      [nombre_bb_vc, capacidad_bb_vc || null, ID_TipoEspacio_espacio_bb_vc || null]
    );
    res_vc_bb.status(201).json({ id: result_vc_bb.insertId });
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al crear espacio" });
  }
};

export const updateEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const { nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc } = req_vc_bb.body;
    const result_vc_bb = await execute_vc_bb(
      "UPDATE td_Espacios_bb_vc SET nombre_bb_vc = ?, capacidad_bb_vc = ?, ID_TipoEspacio_espacio_bb_vc = ? WHERE ID_espacio_bb_vc = ?",
      [nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc, id]
    );
    if (!result_vc_bb.affectedRows) return res_vc_bb.status(404).json({ message: "Espacio no encontrado" });
    res_vc_bb.json({ message: "Espacio actualizado" });
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al actualizar espacio" });
  }
};

export const deleteEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const result_vc_bb = await execute_vc_bb("DELETE FROM td_Espacios_bb_vc WHERE ID_espacio_bb_vc = ?", [id]);
    if (!result_vc_bb.affectedRows) return res_vc_bb.status(404).json({ message: "Espacio no encontrado" });
    res_vc_bb.json({ message: "Espacio eliminado" });
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al eliminar espacio" });
  }
};

export default {
  getAllEspacios_vc_bb,
  getAllTipoEspacio_vc_bb,
  createEspacio_vc_bb,
  updateEspacio_vc_bb,
  deleteEspacio_vc_bb,
};
