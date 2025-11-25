import { query_vc_bb } from "../db.js";

export const getAllProfesores_vc_bb = async (req_vc_bb, res_vc_bb) => {
  try {
    const rows = await query_vc_bb(`
      SELECT p.ID_profesor_bb_vc, u.ID_usuario_bb_vc, u.userName_bb_vc, u.nombre_bb_vc, u.apellido_bb_vc, u.correo_bb_vc, u.telefono_bb_vc
      FROM td_Profesores_bb_vc p
      JOIN td_UsuarioRol_bb_vc ur ON p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc
      JOIN td_Usuarios_bb_vc u ON ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc
      ORDER BY u.apellido_bb_vc, u.nombre_bb_vc
    `);
    res_vc_bb.json(rows);
  } catch (_) {
    res_vc_bb.status(500).json({ message: "Error al obtener profesores" });
  }
};

export default { getAllProfesores_vc_bb };
