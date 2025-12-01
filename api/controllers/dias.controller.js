import DiaModel_vc_bb from "../models/dias.model.js";

export const getAllDias_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const model_vc_bb = DiaModel_vc_bb.obtenerInstancia_vc_bb();
    const rows_vc_bb = await model_vc_bb.obtenerTodos_vc_bb();
    res_vc_bb.json(rows_vc_bb);
  } catch (err_vc_bb) {
    res_vc_bb.status(500).json({ message: "Error al obtener días" });
  }
};

export default { getAllDias_vc_bb };
