import { query_vc_bb, execute_vc_bb } from "../db.js";

export const getAllClases_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows = await query_vc_bb(`
      SELECT c.ID_clase_bb_vc, g.nro_grado_bb_vc, s.letra_seccion_bb_vc, c.ID_grado_clase_bb_vc, c.ID_seccion_clase_bb_vc
      FROM td_Clases_bb_vc c
      JOIN td_Grados_bb_vc g ON c.ID_grado_clase_bb_vc = g.ID_grado_bb_vc
      JOIN td_Secciones_bb_vc s ON c.ID_seccion_clase_bb_vc = s.ID_seccion_bb_vc
      ORDER BY g.nro_grado_bb_vc, s.letra_seccion_bb_vc
    `);
    res_vc_bb.json(rows);
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al obtener clases" });
  }
};

export const createClase_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { ID_grado_clase_bb_vc, ID_seccion_clase_bb_vc } = req_vc_bb.body;
    if (!ID_grado_clase_bb_vc || !ID_seccion_clase_bb_vc) return res_vc_bb.status(400).json({ message: "Faltan datos" });
    await execute_vc_bb(
      "INSERT IGNORE INTO td_Clases_bb_vc (ID_grado_clase_bb_vc, ID_seccion_clase_bb_vc) VALUES (?,?)",
      [ID_grado_clase_bb_vc, ID_seccion_clase_bb_vc]
    );
    res_vc_bb.status(201).json({ message: "Clase creada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al crear clase" });
  }
};

export const deleteClase_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const result = await execute_vc_bb("DELETE FROM td_Clases_bb_vc WHERE ID_clase_bb_vc = ?", [req_vc_bb.params.id]);
    if (!result.affectedRows) return res_vc_bb.status(404).json({ message: "Clase no encontrada" });
    res_vc_bb.json({ message: "Clase eliminada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al eliminar clase" });
  }
};

export default { getAllClases_vc_bb, createClase_vc_bb, deleteClase_vc_bb };
