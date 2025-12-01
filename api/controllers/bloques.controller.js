import BloqueModel_vc_bb from "../models/bloques.model.js";

export const getAllBloques_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const model_vc_bb = BloqueModel_vc_bb.obtenerInstancia_vc_bb();
    const rows_vc_bb = await model_vc_bb.obtenerTodos_vc_bb();
    res_vc_bb.json(rows_vc_bb);
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al obtener bloques" });
  }
};

export default { getAllBloques_vc_bb };
