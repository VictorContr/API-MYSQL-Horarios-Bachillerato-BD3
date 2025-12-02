import EspacioModel_vc_bb from "../models/espacios.model.js";

const espacioModel_vc_bb = EspacioModel_vc_bb.obtenerInstancia_vc_bb();

export const getAllEspacios_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows_vc_bb = await espacioModel_vc_bb.obtenerTodos_vc_bb();
    res_vc_bb.json(rows_vc_bb);
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al obtener espacios" });
  }
};

export const getAllTipoEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows_vc_bb = await espacioModel_vc_bb.obtenerTipos_vc_bb();
    res_vc_bb.json(rows_vc_bb);
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al obtener tipos de espacio" });
  }
};

export const createEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc } = req_vc_bb.body;
    if (!nombre_bb_vc) return res_vc_bb.status(400).json({ message: "Falta nombre" });
    const id_vc_bb = await espacioModel_vc_bb.crear_vc_bb({ nombre_bb_vc, capacidad_bb_vc: capacidad_bb_vc || null, ID_TipoEspacio_espacio_bb_vc: ID_TipoEspacio_espacio_bb_vc || null });
    res_vc_bb.status(201).json({ id: id_vc_bb });
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al crear espacio" });
  }
};

export const updateEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const { nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc } = req_vc_bb.body;
    const affected_vc_bb = await espacioModel_vc_bb.actualizar_vc_bb(id, { nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc });
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ message: "Espacio no encontrado" });
    res_vc_bb.json({ message: "Espacio actualizado" });
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al actualizar espacio" });
  }
};

export const deleteEspacio_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id } = req_vc_bb.params;
    const affected_vc_bb = await espacioModel_vc_bb.eliminar_vc_bb(id);
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ message: "Espacio no encontrado" });
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
/*
EspaciosController (MySQL)
- Endpoints CRUD de espacios físicos.
- Filtros por tipo y disponibilidad.
*/
