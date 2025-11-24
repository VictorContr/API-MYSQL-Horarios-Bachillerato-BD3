import db_vc_bb from "../db.js";

export class LockModel_vc_bb {
  static #instancia_vc_bb = null;

  constructor() {
    if (LockModel_vc_bb.#instancia_vc_bb) {
      return LockModel_vc_bb.#instancia_vc_bb;
    }
    LockModel_vc_bb.#instancia_vc_bb = this;
  }

  static obtenerInstancia_vc_bb() {
    if (!LockModel_vc_bb.#instancia_vc_bb) {
      LockModel_vc_bb.#instancia_vc_bb = new LockModel_vc_bb();
    }
    return LockModel_vc_bb.#instancia_vc_bb;
  }

  #tablasPorCarga_vc_bb = {
    profesores: ["td_Profesores_bb_vc"],
    espacios: ["td_Espacios_bb_vc"],
    grados: ["td_Grados_bb_vc"],
    secciones: ["td_Secciones_bb_vc", "td_Grados_bb_vc"],
    asignaturas: ["td_GradosAsignaturas_bb_vc", "td_Asignaturas_bb_vc"],
    disponibilidades: ["td_DisponibilidadProfesor_bb_vc", "td_DisponibilidadEspacio_bb_vc"],
  };

  obtenerTablasPorTipo_vc_bb(tipoCarga_vc_bb) {
    return this.#tablasPorCarga_vc_bb[tipoCarga_vc_bb] || [];
  }

  async verificarExistenciaDatos_vc_bb(tablas_vc_bb) {
    const resultados_vc_bb = {};
    for (const tabla_vc_bb of tablas_vc_bb) {
      const row_vc_bb = await db_vc_bb.getOne_vc_bb(`SELECT COUNT(*) AS total FROM ${tabla_vc_bb}`);
      resultados_vc_bb[tabla_vc_bb] = (row_vc_bb?.total || 0) > 0;
    }
    return resultados_vc_bb;
  }

  async crearRespaldo_vc_bb(tablas_vc_bb, nombreRespaldo_vc_bb) {
    const ahora_vc_bb = new Date();
    const yyyy_vc_bb = ahora_vc_bb.getFullYear();
    const mm_vc_bb = String(ahora_vc_bb.getMonth() + 1).padStart(2, "0");
    const dd_vc_bb = String(ahora_vc_bb.getDate()).padStart(2, "0");
    const hh_vc_bb = String(ahora_vc_bb.getHours()).padStart(2, "0");
    const mi_vc_bb = String(ahora_vc_bb.getMinutes()).padStart(2, "0");
    const ss_vc_bb = String(ahora_vc_bb.getSeconds()).padStart(2, "0");
    const ms_vc_bb = String(ahora_vc_bb.getMilliseconds()).padStart(3, "0");
    const suffix_vc_bb = `${nombreRespaldo_vc_bb}_${yyyy_vc_bb}${mm_vc_bb}${dd_vc_bb}_${hh_vc_bb}${mi_vc_bb}${ss_vc_bb}_${ms_vc_bb}`.replace(/[^A-Za-z0-9_]/g, "_");

    for (const tabla_vc_bb of tablas_vc_bb) {
      await db_vc_bb.query_vc_bb("CALL sp_backup_table(?, ?)", [tabla_vc_bb, suffix_vc_bb]);
    }
    return suffix_vc_bb;
  }

  async eliminarRespaldosAntiguosExcepto_vc_bb(tablas_vc_bb, nombreRespaldo_vc_bb) {
    for (const tabla_vc_bb of tablas_vc_bb) {
      const keep_vc_bb = `${tabla_vc_bb}_backup_${nombreRespaldo_vc_bb}`;
      const rows_vc_bb = await db_vc_bb.query_vc_bb(
        `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME LIKE CONCAT(?, '_backup_%')`,
        [tabla_vc_bb]
      );
      for (const r_vc_bb of rows_vc_bb) {
        const n_vc_bb = r_vc_bb.TABLE_NAME;
        if (n_vc_bb && n_vc_bb !== keep_vc_bb) {
          await db_vc_bb.query_vc_bb(`DROP TABLE ${n_vc_bb}`);
        }
      }
    }
    return true;
  }

  async limpiarTablas_vc_bb(tablas_vc_bb) {
    await db_vc_bb.query_vc_bb("SET FOREIGN_KEY_CHECKS = 0");
    for (const tabla_vc_bb of tablas_vc_bb) {
      await db_vc_bb.query_vc_bb("CALL sp_delete_all(?)", [tabla_vc_bb]);
    }
    await db_vc_bb.query_vc_bb("SET FOREIGN_KEY_CHECKS = 1");
    return true;
  }

  async restaurarRespaldo_vc_bb(nombreRespaldo_vc_bb, tablas_vc_bb) {
    await db_vc_bb.query_vc_bb("SET FOREIGN_KEY_CHECKS = 0");
    for (const tabla_vc_bb of tablas_vc_bb) {
      await db_vc_bb.query_vc_bb("CALL sp_restore_from_backup(?, ?)", [tabla_vc_bb, nombreRespaldo_vc_bb]);
    }
    await db_vc_bb.query_vc_bb("SET FOREIGN_KEY_CHECKS = 1");
    return true;
  }

  async obtenerInfoRespaldos_vc_bb() {
    const rows_vc_bb = await db_vc_bb.query_vc_bb(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME LIKE '%_backup_%' ORDER BY TABLE_NAME`
    );
    const infoRespaldos_vc_bb = {};
    rows_vc_bb.forEach(({ TABLE_NAME }) => {
      const partes_vc_bb = TABLE_NAME.split("_backup_");
      if (partes_vc_bb.length === 2) {
        const tablaOriginal_vc_bb = partes_vc_bb[0];
        const nombreRespaldo_vc_bb = partes_vc_bb[1];
        if (!infoRespaldos_vc_bb[nombreRespaldo_vc_bb]) infoRespaldos_vc_bb[nombreRespaldo_vc_bb] = [];
        infoRespaldos_vc_bb[nombreRespaldo_vc_bb].push(tablaOriginal_vc_bb);
      }
    });
    return infoRespaldos_vc_bb;
  }
}

export default LockModel_vc_bb;
