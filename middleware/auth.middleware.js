import { getOne_vc_bb } from "../api/db.js";

export const requireAdmin_vc_bb = async (req, res, next) => {
  try {
    const userId_vc_bb = req.header("x-user-id");
    if (!userId_vc_bb) {
      return res.status(401).json({ message: "Falta header x-user-id" });
    }
    const rolRow_vc_bb = await getOne_vc_bb(
      `SELECT r.rol_bb_vc
       FROM td_UsuarioRol_bb_vc ur
       JOIN td_Rol_bb_vc r ON ur.ID_rol_usuarioRol_bb_vc = r.ID_rol_bb_vc
       WHERE ur.ID_usuario_usuarioRol_bb_vc = ?
       LIMIT 1;`,
      [userId_vc_bb]
    );
    if (!rolRow_vc_bb || rolRow_vc_bb.rol_bb_vc !== "Administrador") {
      return res.status(403).json({ message: "Acceso denegado: se requiere rol Administrador" });
    }
    req.user_vc_bb = { id: Number(userId_vc_bb), rol: rolRow_vc_bb.rol_bb_vc };
    next();
  } catch (err_vc_bb) {
    console.error("❌ Error en requireAdmin_vc_bb:", err_vc_bb.message);
    res.status(500).json({ message: "Error en autorización" });
  }
};

export const preventSelfDelete_vc_bb = (req, res, next) => {
  try {
    const currentUser_vc_bb = req.user_vc_bb && req.user_vc_bb.id;
    const targetId_vc_bb = Number(req.params.id);
    if (currentUser_vc_bb && targetId_vc_bb && Number(currentUser_vc_bb) === Number(targetId_vc_bb)) {
      return res.status(403).json({ message: "No puedes eliminar el usuario de la sesión actual" });
    }
    next();
  } catch (err_vc_bb) {
    res.status(500).json({ message: "Error validando eliminación" });
  }
};

export default { requireAdmin_vc_bb, preventSelfDelete_vc_bb };

