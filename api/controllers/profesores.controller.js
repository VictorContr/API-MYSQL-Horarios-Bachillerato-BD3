import ProfesorModel_vc_bb from "../models/profesores.model.js";

export const getAllProfesores_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const model_vc_bb = ProfesorModel_vc_bb.obtenerInstancia_vc_bb();
    const rows = await model_vc_bb.obtenerTodos_vc_bb();
    res_vc_bb.json(rows);
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al obtener profesores" });
  }
};

export default { getAllProfesores_vc_bb };
/*
ProfesoresController (MySQL)
- Endpoints CRUD de profesores.
- Vinculación con asignaturas y manejo de disponibilidad.
*/
