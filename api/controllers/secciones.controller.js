import SeccionModel_vc_bb from "../models/secciones.model.js";

const seccionModel_vc_bb = SeccionModel_vc_bb.obtenerInstancia_vc_bb();

export const getAllSecciones_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows = await seccionModel_vc_bb.obtenerTodos_vc_bb();
    res_vc_bb.json(rows);
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al obtener secciones" });
  }
};

export const getSeccionById_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const row = await seccionModel_vc_bb.obtenerPorId_vc_bb(req_vc_bb.params.id);
    if (!row) return res_vc_bb.status(404).json({ message: "Sección no encontrada" });
    res_vc_bb.json(row);
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al obtener sección" });
  }
};

export const createSeccion_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { letra_seccion_bb_vc } = req_vc_bb.body;
    const letra = String(letra_seccion_bb_vc || "").trim();
    if (!letra) return res_vc_bb.status(400).json({ message: "Falta letra_seccion_bb_vc" });
    const dup = await seccionModel_vc_bb.existePorLetra_vc_bb(letra);
    if (dup) return res_vc_bb.status(409).json({ message: "La sección ya existe" });
    const id_seccion_vc_bb = await seccionModel_vc_bb.crear_vc_bb(letra);
    res_vc_bb.status(201).json({ id_seccion_vc_bb });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al crear sección" });
  }
};

export const updateSeccion_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const { letra_seccion_bb_vc } = req_vc_bb.body;
    const letra = String(letra_seccion_bb_vc || "").trim();
    if (!letra) return res_vc_bb.status(400).json({ message: "Falta letra_seccion_bb_vc" });
    const dup = await seccionModel_vc_bb.existePorLetra_vc_bb(letra, id);
    if (dup) return res_vc_bb.status(409).json({ message: "Ya existe una sección con esa letra" });
    const affected_vc_bb = await seccionModel_vc_bb.actualizar_vc_bb(id, letra);
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ message: "Sección no encontrada" });
    res_vc_bb.json({ message: "Sección actualizada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al actualizar sección" });
  }
};

export const deleteSeccion_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const affected_vc_bb = await seccionModel_vc_bb.eliminar_vc_bb(req_vc_bb.params.id);
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ message: "Sección no encontrada" });
    res_vc_bb.json({ message: "Sección eliminada" });
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al eliminar sección" });
  }
};

export default {
  getAllSecciones_vc_bb,
  getSeccionById_vc_bb,
  createSeccion_vc_bb,
  updateSeccion_vc_bb,
  deleteSeccion_vc_bb,
};
