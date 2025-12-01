import { query_vc_bb, getOne_vc_bb } from "../db.js";
import AsignaturaModel_vc_bb from "../models/asignatura.model.js";

const asignaturaModel_vc_bb = AsignaturaModel_vc_bb.obtenerInstancia_vc_bb();

export const getAllAsignaturas_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows_vc_bb = await asignaturaModel_vc_bb.obtenerTodos_vc_bb();
    res_vc_bb.json(rows_vc_bb);
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al obtener asignaturas", error_vc_bb: error_vc_bb.message });
  }
};

export const createAsignatura_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { nombre_bb_vc, horas_academicas_bb_vc, descripcion_bb_vc, duracion_bloque_min_bb_vc, duracion_bloque_max_bb_vc, ID_TipoEspacio_requerido_bb_vc, ID_grado_bb_vc, nro_grado_bb_vc } = req_vc_bb.body;
    if (!nombre_bb_vc) return res_vc_bb.status(400).json({ mensaje_vc_bb: "El nombre de la asignatura es requerido" });
    const dup_vc_bb = await asignaturaModel_vc_bb.obtenerPorNombre_vc_bb(nombre_bb_vc);
    if (dup_vc_bb) return res_vc_bb.status(409).json({ mensaje_vc_bb: "La asignatura ya existe" });
    const idAsignatura_vc_bb = await asignaturaModel_vc_bb.crear_vc_bb({
      nombre_bb_vc,
      horas_academicas_bb_vc: horas_academicas_bb_vc || null,
      descripcion_bb_vc: descripcion_bb_vc || null,
      duracion_bloque_min_bb_vc: duracion_bloque_min_bb_vc || 1,
      duracion_bloque_max_bb_vc: duracion_bloque_max_bb_vc || 1,
      ID_TipoEspacio_requerido_bb_vc: ID_TipoEspacio_requerido_bb_vc || null,
    });
    let idGrado_vc_bb = null;
    if (ID_grado_bb_vc != null) {
      idGrado_vc_bb = parseInt(String(ID_grado_bb_vc), 10);
    } else if (nro_grado_bb_vc != null) {
      const grado = await getOne_vc_bb("SELECT ID_grado_bb_vc FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ?", [parseInt(String(nro_grado_bb_vc), 10)]);
      idGrado_vc_bb = grado ? grado.ID_grado_bb_vc : null;
    }
    if (idGrado_vc_bb) {
      await asignaturaModel_vc_bb.vincularConGrado_vc_bb(idAsignatura_vc_bb, idGrado_vc_bb);
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
    const exists_vc_bb = await asignaturaModel_vc_bb.obtenerPorId_vc_bb(id);
    if (!exists_vc_bb) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Asignatura no encontrada" });
    await asignaturaModel_vc_bb.actualizar_vc_bb(id, payload);
    // Vincular con grado si se proporciona
    let idGrado_vc_bb = null;
    if (payload.ID_grado_bb_vc != null) {
      idGrado_vc_bb = parseInt(String(payload.ID_grado_bb_vc), 10);
    } else if (payload.nro_grado_bb_vc != null) {
      const grado = await getOne_vc_bb("SELECT ID_grado_bb_vc FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ?", [parseInt(String(payload.nro_grado_bb_vc), 10)]);
      idGrado_vc_bb = grado ? grado.ID_grado_bb_vc : null;
    }
    if (idGrado_vc_bb) {
      await asignaturaModel_vc_bb.vincularConGrado_vc_bb(id, idGrado_vc_bb);
    }
    res_vc_bb.json({ mensaje_vc_bb: "Asignatura actualizada" });
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al actualizar asignatura", error_vc_bb: error_vc_bb.message });
  }
};

export const deleteAsignatura_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const affected_vc_bb = await asignaturaModel_vc_bb.eliminar_vc_bb(req_vc_bb.params.id);
    if (!affected_vc_bb) return res_vc_bb.status(404).json({ mensaje_vc_bb: "Asignatura no encontrada" });
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
    const rows = await asignaturaModel_vc_bb.obtenerAsignaturasPorGrado_vc_bb(idGrado);
    res_vc_bb.json(rows);
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al obtener asignaturas por grado", error_vc_bb: error_vc_bb.message });
  }
};

export const quitarGrado_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { id, nroGrado } = req_vc_bb.params;
    const asignaturaExistente_vc_bb = await asignaturaModel_vc_bb.obtenerPorId_vc_bb(id);
    if (!asignaturaExistente_vc_bb) {
      return res_vc_bb.status(404).json({ mensaje_vc_bb: "Asignatura no encontrada" });
    }

    const parsed_vc_bb = parseInt(String(nroGrado).trim(), 10);
    if (!Number.isInteger(parsed_vc_bb)) {
      return res_vc_bb.status(400).json({ mensaje_vc_bb: "Número de grado inválido" });
    }
    const grado_vc_bb = await getOne_vc_bb("SELECT ID_grado_bb_vc FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ?", [parsed_vc_bb]);
    if (!grado_vc_bb) {
      return res_vc_bb.status(404).json({ mensaje_vc_bb: "Grado no encontrado" });
    }

    const cambios_vc_bb = await asignaturaModel_vc_bb.desvincularConGrado_vc_bb(id, grado_vc_bb.ID_grado_bb_vc);
    res_vc_bb.json({ mensaje_vc_bb: "Grado desvinculado", cambios_vc_bb });
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al desvincular grado", error_vc_bb: error_vc_bb.message });
  }
};

export default {
  getAllAsignaturas_vc_bb,
  createAsignatura_vc_bb,
  updateAsignatura_vc_bb,
  deleteAsignatura_vc_bb,
  getAsignaturasPorGrado_vc_bb,
  quitarGrado_vc_bb,
};
