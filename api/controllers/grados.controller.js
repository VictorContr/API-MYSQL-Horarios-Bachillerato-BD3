import GradoModel_vc_bb from "../models/grados.model.js";

const gradoModel_vc_bb = GradoModel_vc_bb.obtenerInstancia_vc_bb();

export const getAllGrados_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows_vc_bb = await gradoModel_vc_bb.obtenerTodos_vc_bb();
    res_vc_bb.json(rows_vc_bb);
  } catch (_) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al obtener grados" });
  }
};

export const getGradoById_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const grado_vc_bb = await gradoModel_vc_bb.obtenerPorId_vc_bb(req_vc_bb.params.id);
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
    const exists_vc_bb = await gradoModel_vc_bb.existePorNumero_vc_bb(n);
    if (exists_vc_bb) return res_vc_bb.status(409).json({ mensaje_vc_bb: "El grado ya existe" });
    const id_grado_vc_bb = await gradoModel_vc_bb.crear_vc_bb(n);
    res_vc_bb.status(201).json({ mensaje_vc_bb: "Grado creado", id_grado_vc_bb });
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
    const dup_vc_bb = await gradoModel_vc_bb.existePorNumero_vc_bb(n, id);
    if (dup_vc_bb) return res_vc_bb.status(409).json({ mensaje_vc_bb: "Ya existe un grado con ese número" });
    const affected_vc_bb = await gradoModel_vc_bb.actualizar_vc_bb(id, n);
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Grado no encontrado" });
    res_vc_bb.json({ mensaje_vc_bb: "Grado actualizado" });
  } catch (_) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al actualizar grado" });
  }
};

export const deleteGrado_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const affected_vc_bb = await gradoModel_vc_bb.eliminar_vc_bb(req_vc_bb.params.id);
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Grado no encontrado" });
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
/*
GradosController (MySQL)
- Endpoints CRUD de grados.
- Relación con asignaturas y secciones.
*/
