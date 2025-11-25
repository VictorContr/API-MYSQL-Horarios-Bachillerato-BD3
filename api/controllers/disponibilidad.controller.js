import { query_vc_bb, getOne_vc_bb, execute_vc_bb } from "../db.js";

export const getDisponibilidadProfesor_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows = await query_vc_bb(`
      SELECT dp.ID_DisponibilidadProfesor_bb_vc, d.dia_bb_vc, b.hora_bloque_bb_vc, u.userName_bb_vc, p.ID_profesor_bb_vc
      FROM td_DisponibilidadProfesor_bb_vc dp
      JOIN td_Dia_bb_vc d ON dp.ID_dia_DispProfesor_bb_vc = d.ID_dia_bb_vc
      JOIN td_Bloque_bb_vc b ON dp.ID_bloque_DispProfesor_bb_vc = b.ID_bloque_bb_vc
      JOIN td_Profesores_bb_vc p ON dp.ID_profesor_DispProfesor_bb_vc = p.ID_profesor_bb_vc
      JOIN td_UsuarioRol_bb_vc ur ON p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc
      JOIN td_Usuarios_bb_vc u ON ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc
      ORDER BY d.ID_dia_bb_vc, b.ID_bloque_bb_vc
    `);
    res_vc_bb.json(rows);
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al obtener disponibilidad profesor" });
  }
};

export const getDisponibilidadEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows = await query_vc_bb(`
      SELECT de.ID_DisponibilidadEspacio_bb_vc, d.dia_bb_vc, b.hora_bloque_bb_vc, e.nombre_bb_vc, e.ID_espacio_bb_vc
      FROM td_DisponibilidadEspacio_bb_vc de
      JOIN td_Dia_bb_vc d ON de.ID_dia_DispEspacio_bb_vc = d.ID_dia_bb_vc
      JOIN td_Bloque_bb_vc b ON de.ID_bloque_DispEspacio_bb_vc = b.ID_bloque_bb_vc
      JOIN td_Espacios_bb_vc e ON de.ID_espacio_DispEspacio_bb_vc = e.ID_espacio_bb_vc
      ORDER BY d.ID_dia_bb_vc, b.ID_bloque_bb_vc
    `);
    res_vc_bb.json(rows);
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al obtener disponibilidad espacio" });
  }
};

export const createDisponibilidadProfesor_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc } = req_vc_bb.body;
    if (!ID_dia_DispProfesor_bb_vc || !ID_bloque_DispProfesor_bb_vc || !ID_profesor_DispProfesor_bb_vc) {
      return res_vc_bb.status(400).json({ message: "Faltan datos" });
    }
    await execute_vc_bb(
      "INSERT IGNORE INTO td_DisponibilidadProfesor_bb_vc (ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc) VALUES (?,?,?)",
      [ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc]
    );
    res_vc_bb.status(201).json({ message: "Disponibilidad profesor creada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al crear disponibilidad profesor" });
  }
};

export const createDisponibilidadEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { ID_dia_DispEspacio_bb_vc, ID_bloque_DispEspacio_bb_vc, ID_espacio_DispEspacio_bb_vc } = req_vc_bb.body;
    if (!ID_dia_DispEspacio_bb_vc || !ID_bloque_DispEspacio_bb_vc || !ID_espacio_DispEspacio_bb_vc) {
      return res_vc_bb.status(400).json({ message: "Faltan datos" });
    }
    await execute_vc_bb(
      "INSERT IGNORE INTO td_DisponibilidadEspacio_bb_vc (ID_dia_DispEspacio_bb_vc, ID_bloque_DispEspacio_bb_vc, ID_espacio_DispEspacio_bb_vc) VALUES (?,?,?)",
      [ID_dia_DispEspacio_bb_vc, ID_bloque_DispEspacio_bb_vc, ID_espacio_DispEspacio_bb_vc]
    );
    res_vc_bb.status(201).json({ message: "Disponibilidad espacio creada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al crear disponibilidad espacio" });
  }
};

export const deleteDisponibilidadProfesor_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const result = await execute_vc_bb("DELETE FROM td_DisponibilidadProfesor_bb_vc WHERE ID_DisponibilidadProfesor_bb_vc = ?", [req_vc_bb.params.id]);
    if (!result.affectedRows) return res_vc_bb.status(404).json({ message: "Disponibilidad profesor no encontrada" });
    res_vc_bb.json({ message: "Disponibilidad profesor eliminada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al eliminar disponibilidad profesor" });
  }
};

export const deleteDisponibilidadEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const result = await execute_vc_bb("DELETE FROM td_DisponibilidadEspacio_bb_vc WHERE ID_DisponibilidadEspacio_bb_vc = ?", [req_vc_bb.params.id]);
    if (!result.affectedRows) return res_vc_bb.status(404).json({ message: "Disponibilidad espacio no encontrada" });
    res_vc_bb.json({ message: "Disponibilidad espacio eliminada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al eliminar disponibilidad espacio" });
  }
};

export const updateDisponibilidadProfesor_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const { ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc } = req_vc_bb.body;
    if (!ID_dia_DispProfesor_bb_vc || !ID_bloque_DispProfesor_bb_vc || !ID_profesor_DispProfesor_bb_vc) {
      return res_vc_bb.status(400).json({ message: "Faltan datos para actualizar" });
    }
    const result = await execute_vc_bb(
      "UPDATE td_DisponibilidadProfesor_bb_vc SET ID_dia_DispProfesor_bb_vc = ?, ID_bloque_DispProfesor_bb_vc = ?, ID_profesor_DispProfesor_bb_vc = ? WHERE ID_DisponibilidadProfesor_bb_vc = ?",
      [ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc, id]
    );
    if (!result.affectedRows) return res_vc_bb.status(404).json({ message: "Disponibilidad profesor no encontrada" });
    res_vc_bb.json({ message: "Disponibilidad profesor actualizada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al actualizar disponibilidad profesor" });
  }
};

export const updateDisponibilidadEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const { ID_dia_DispEspacio_bb_vc, ID_bloque_DispEspacio_bb_vc, ID_espacio_DispEspacio_bb_vc } = req_vc_bb.body;
    if (!ID_dia_DispEspacio_bb_vc || !ID_bloque_DispEspacio_bb_vc || !ID_espacio_DispEspacio_bb_vc) {
      return res_vc_bb.status(400).json({ message: "Faltan datos para actualizar" });
    }
    const result = await execute_vc_bb(
      "UPDATE td_DisponibilidadEspacio_bb_vc SET ID_dia_DispEspacio_bb_vc = ?, ID_bloque_DispEspacio_bb_vc = ?, ID_espacio_DispEspacio_bb_vc = ? WHERE ID_DisponibilidadEspacio_bb_vc = ?",
      [ID_dia_DispEspacio_bb_vc, ID_bloque_DispEspacio_bb_vc, ID_espacio_DispEspacio_bb_vc, id]
    );
    if (!result.affectedRows) return res_vc_bb.status(404).json({ message: "Disponibilidad espacio no encontrada" });
    res_vc_bb.json({ message: "Disponibilidad espacio actualizada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al actualizar disponibilidad espacio" });
  }
};

export default {
  getDisponibilidadProfesor_vc_bb,
  getDisponibilidadEspacio_vc_bb,
  createDisponibilidadProfesor_vc_bb,
  createDisponibilidadEspacio_vc_bb,
  deleteDisponibilidadProfesor_vc_bb,
  deleteDisponibilidadEspacio_vc_bb,
  updateDisponibilidadProfesor_vc_bb,
  updateDisponibilidadEspacio_vc_bb,
};
