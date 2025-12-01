import GeneradorHorariosModel_vc_bb from "../models/generadorHorarios.model.js";

export const generarHorarios_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const generador_vc_bb = new GeneradorHorariosModel_vc_bb();
    const solucion_vc_bb = await generador_vc_bb.generarLegibleAdmin_vc_bb();
    res_vc_bb.json({ mensaje_vc_bb: "Horarios generados correctamente", cantidad_vc_bb: solucion_vc_bb.length, horarios_vc_bb: solucion_vc_bb });
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al generar horarios", error_vc_bb: error_vc_bb.message });
  }
};

export const obtenerHorariosProfesor_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { idProfesor } = req_vc_bb.params;
    const generador_vc_bb = new GeneradorHorariosModel_vc_bb();
    const horariosProfesor_vc_bb = await generador_vc_bb.obtenerHorariosPorProfesor_vc_bb(idProfesor);
    res_vc_bb.json({ mensaje_vc_bb: `Horarios del profesor ${idProfesor}`, cantidad_vc_bb: horariosProfesor_vc_bb.length, horarios_vc_bb: horariosProfesor_vc_bb });
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al obtener horarios del profesor", error_vc_bb: error_vc_bb.message });
  }
};

export const obtenerProfesorPorUsuario_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const { idUsuario } = req_vc_bb.params;
    const generador_vc_bb = new GeneradorHorariosModel_vc_bb();
    const row_vc_bb = await generador_vc_bb.obtenerProfesorPorUsuario_vc_bb(idUsuario);
    if (!row_vc_bb) {
      return res_vc_bb.status(404).json({ mensaje_vc_bb: "Usuario no asociado a profesor" });
    }
    res_vc_bb.json(row_vc_bb);
  } catch (error_vc_bb) {
    res_vc_bb.status(500).json({ mensaje_vc_bb: "Error al obtener profesor por usuario", error_vc_bb: error_vc_bb.message });
  }
};

export default { generarHorarios_vc_bb, obtenerHorariosProfesor_vc_bb, obtenerProfesorPorUsuario_vc_bb };
