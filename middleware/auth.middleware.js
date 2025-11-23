export const requireAdmin_vc_bb = (req, res, next) => {
  // Stub de ejemplo: en producción validar JWT/rol desde sesión o token
  // Permite todas las operaciones por ahora
  next();
};

export default { requireAdmin_vc_bb };

