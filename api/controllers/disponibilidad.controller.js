import DisponibilidadProfesorModel_vc_bb from "../models/disponibilidadProfesor.model.js";

export const getDisponibilidadProfesor_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const model_vc_bb = DisponibilidadProfesorModel_vc_bb.obtenerInstancia_vc_bb();
    const rows = await model_vc_bb.obtenerTodos_vc_bb();
    res_vc_bb.json(rows);
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al obtener disponibilidad profesor" });
  }
};


export const createDisponibilidadProfesor_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc } = req_vc_bb.body;
    if (!ID_dia_DispProfesor_bb_vc || !ID_bloque_DispProfesor_bb_vc || !ID_profesor_DispProfesor_bb_vc) {
      return res_vc_bb.status(400).json({ message: "Faltan datos" });
    }
    const model_vc_bb = DisponibilidadProfesorModel_vc_bb.obtenerInstancia_vc_bb();
    await model_vc_bb.crear_vc_bb({ ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc });
    res_vc_bb.status(201).json({ message: "Disponibilidad profesor creada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al crear disponibilidad profesor" });
  }
};


export const deleteDisponibilidadProfesor_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const model_vc_bb = DisponibilidadProfesorModel_vc_bb.obtenerInstancia_vc_bb();
    const affected_vc_bb = await model_vc_bb.eliminar_vc_bb(req_vc_bb.params.id);
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ message: "Disponibilidad profesor no encontrada" });
    res_vc_bb.json({ message: "Disponibilidad profesor eliminada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al eliminar disponibilidad profesor" });
  }
};


export const updateDisponibilidadProfesor_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const { ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc } = req_vc_bb.body;
    if (!ID_dia_DispProfesor_bb_vc || !ID_bloque_DispProfesor_bb_vc || !ID_profesor_DispProfesor_bb_vc) {
      return res_vc_bb.status(400).json({ message: "Faltan datos para actualizar" });
    }
    const model_vc_bb = DisponibilidadProfesorModel_vc_bb.obtenerInstancia_vc_bb();
    const affected_vc_bb = await model_vc_bb.actualizar_vc_bb(id, { ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc });
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ message: "Disponibilidad profesor no encontrada" });
    res_vc_bb.json({ message: "Disponibilidad profesor actualizada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al actualizar disponibilidad profesor" });
  }
};


export default {
  getDisponibilidadProfesor_vc_bb,
  createDisponibilidadProfesor_vc_bb,
  deleteDisponibilidadProfesor_vc_bb,
  updateDisponibilidadProfesor_vc_bb,
};
