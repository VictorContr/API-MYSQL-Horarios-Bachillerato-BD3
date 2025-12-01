import ClaseModel_vc_bb from "../models/clases.model.js";

export const getAllClases_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const model_vc_bb = ClaseModel_vc_bb.obtenerInstancia_vc_bb();
    const rows = await model_vc_bb.obtenerTodos_vc_bb();
    res_vc_bb.json(rows);
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al obtener clases" });
  }
};

export const createClase_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { ID_grado_clase_bb_vc, ID_seccion_clase_bb_vc } = req_vc_bb.body;
    if (!ID_grado_clase_bb_vc || !ID_seccion_clase_bb_vc) return res_vc_bb.status(400).json({ message: "Faltan datos" });
    const model_vc_bb = ClaseModel_vc_bb.obtenerInstancia_vc_bb();
    await model_vc_bb.crear_vc_bb({ ID_grado_clase_bb_vc, ID_seccion_clase_bb_vc });
    res_vc_bb.status(201).json({ message: "Clase creada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al crear clase" });
  }
};

export const deleteClase_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const model_vc_bb = ClaseModel_vc_bb.obtenerInstancia_vc_bb();
    const affected_vc_bb = await model_vc_bb.eliminar_vc_bb(req_vc_bb.params.id);
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ message: "Clase no encontrada" });
    res_vc_bb.json({ message: "Clase eliminada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al eliminar clase" });
  }
};

export default { getAllClases_vc_bb, createClase_vc_bb, deleteClase_vc_bb };
