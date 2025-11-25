import { Router } from "express";
import { query_vc_bb } from "../api/db.js";

const router_vc_bb = Router();

const tableMap_vc_bb = {
  usuarios: 'td_Usuarios_bb_vc',
  profesores: 'td_Profesores_bb_vc',
  asignaturas: 'td_Asignaturas_bb_vc',
  espacios: 'td_Espacios_bb_vc',
  secciones: 'td_Secciones_bb_vc',
  grados: 'td_Grados_bb_vc',
  disponibilidad: 'td_DisponibilidadProfesor_bb_vc',
};

router_vc_bb.get('/:tabla', async (req, res) => {
  try {
    const real = tableMap_vc_bb[req.params.tabla];
    if (!real) return res.status(400).json({ message: 'Tabla desconocida' });
    const rows = await query_vc_bb(
      'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION',
      [real]
    );
    const cols = rows.map(r => r.COLUMN_NAME);
    res.json({ table: real, columns: cols });
  } catch (err) {
    res.status(500).json({ message: 'Error leyendo esquema' });
  }
});

export default router_vc_bb;
