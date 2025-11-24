import db_vc_bb from "../db.js";
import { ExcelModel_vc_bb } from "../models/excel.model.js";

export class ExcelController_vc_bb {
  async subirGradosExcel_vc_bb(req_vc_bb, res_vc_bb) {
    const filePath_vc_bb = req_vc_bb.file?.path;
    if (!filePath_vc_bb) return res_vc_bb.status(400).json({ message: "Archivo faltante" });
    try {
      const result_vc_bb = await ExcelModel_vc_bb.parseAndProcessExcel_vc_bb({
        filePath_vc_bb,
        columns_vc_bb: [
          { key_vc_bb: "nro_grado_bb_vc", required_vc_bb: true },
        ],
        processRow_vc_bb: async ({ nro_grado_bb_vc }) => {
          const nro_vc_bb = Number(nro_grado_bb_vc);
          if (Number.isNaN(nro_vc_bb)) throw new Error("Grado inválido");
          await db_vc_bb.query_vc_bb("CALL sp_upsert_grado(?)", [nro_vc_bb]);
        }
      });
      res_vc_bb.json({
        message: "Importación de grados completa",
        errors: result_vc_bb.errors_vc_bb,
        exito: result_vc_bb.successfulImports_vc_bb > 0,
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error importando grados", error: err_vc_bb.message });
    }
  }

  async descargarGradosExcel_vc_bb(req_vc_bb, res_vc_bb) {
    try {
      await ExcelModel_vc_bb.generateAndSendExcel_vc_bb({
        res_vc_bb,
        sheetName_vc_bb: "Grados",
        headers_vc_bb: [
          { title_vc_bb: "ID", key_vc_bb: "ID_grado_bb_vc" },
          { title_vc_bb: "Grado", key_vc_bb: "nro_grado_bb_vc" },
        ],
        fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb("SELECT ID_grado_bb_vc, nro_grado_bb_vc FROM td_Grados_bb_vc ORDER BY nro_grado_bb_vc"),
        filePrefix_vc_bb: "grados"
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error descargando grados", error: err_vc_bb.message });
    }
  }

  async subirSeccionesExcel_vc_bb(req_vc_bb, res_vc_bb) {
    const filePath_vc_bb = req_vc_bb.file?.path;
    if (!filePath_vc_bb) return res_vc_bb.status(400).json({ message: "Archivo faltante" });
    try {
      const result_vc_bb = await ExcelModel_vc_bb.parseAndProcessExcel_vc_bb({
        filePath_vc_bb,
        columns_vc_bb: [
          { key_vc_bb: "letra_seccion_bb_vc", required_vc_bb: true },
        ],
        processRow_vc_bb: async ({ letra_seccion_bb_vc }) => {
          const letra_vc_bb = String(letra_seccion_bb_vc || "").trim();
          if (!letra_vc_bb) throw new Error("Sección inválida");
          await db_vc_bb.query_vc_bb("CALL sp_upsert_seccion(?)", [letra_vc_bb]);
        }
      });
      res_vc_bb.json({
        message: "Importación de secciones completa",
        errors: result_vc_bb.errors_vc_bb,
        exito: result_vc_bb.successfulImports_vc_bb > 0,
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error importando secciones", error: err_vc_bb.message });
    }
  }

  async descargarSeccionesExcel_vc_bb(req_vc_bb, res_vc_bb) {
    try {
      await ExcelModel_vc_bb.generateAndSendExcel_vc_bb({
        res_vc_bb,
        sheetName_vc_bb: "Secciones",
        headers_vc_bb: [
          { title_vc_bb: "ID", key_vc_bb: "ID_seccion_bb_vc" },
          { title_vc_bb: "Sección", key_vc_bb: "letra_seccion_bb_vc" },
        ],
        fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb("SELECT ID_seccion_bb_vc, letra_seccion_bb_vc FROM td_Secciones_bb_vc ORDER BY letra_seccion_bb_vc"),
      filePrefix_vc_bb: "secciones"
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error descargando secciones", error: err_vc_bb.message });
    }
  }

  async subirGradosSeccionesExcel_vc_bb(req_vc_bb, res_vc_bb) {
    const filePath_vc_bb = req_vc_bb.file?.path;
    if (!filePath_vc_bb) return res_vc_bb.status(400).json({ message: "Archivo faltante" });
    try {
      const result_vc_bb = await ExcelModel_vc_bb.parseAndProcessMultiSheets_vc_bb({
        filePath_vc_bb,
        sheets_vc_bb: [
          {
            sheetName_vc_bb: "Grados",
            columns_vc_bb: [{ key_vc_bb: "nro_grado_bb_vc", required_vc_bb: true }],
            processRow_vc_bb: async ({ nro_grado_bb_vc }) => {
              const nro_vc_bb = Number(nro_grado_bb_vc);
              if (Number.isNaN(nro_vc_bb)) throw new Error("Grado inválido");
              await db_vc_bb.query_vc_bb("CALL sp_upsert_grado(?)", [nro_vc_bb]);
            },
          },
          {
            sheetName_vc_bb: "Secciones",
            columns_vc_bb: [{ key_vc_bb: "letra_seccion_bb_vc", required_vc_bb: true }],
            processRow_vc_bb: async ({ letra_seccion_bb_vc }) => {
              const letra_vc_bb = String(letra_seccion_bb_vc || "").trim();
              if (!letra_vc_bb) throw new Error("Sección inválida");
              await db_vc_bb.query_vc_bb("CALL sp_upsert_seccion(?)", [letra_vc_bb]);
            },
          },
        ],
      });
      res_vc_bb.json({
        message: `Proceso finalizado. Importados: ${result_vc_bb.successfulImports_vc_bb}.`,
        errors: result_vc_bb.errors_vc_bb,
        exito: result_vc_bb.successfulImports_vc_bb > 0,
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error importando grados+secciones", error: err_vc_bb.message });
    }
  }

  async descargarGradosSeccionesExcel_vc_bb(req_vc_bb, res_vc_bb) {
    try {
      await ExcelModel_vc_bb.generateAndSendMultiSheetExcel_vc_bb({
        res_vc_bb,
        sheets_vc_bb: [
          {
            sheetName_vc_bb: "Grados",
            headers_vc_bb: [
              { title_vc_bb: "ID", key_vc_bb: "ID_grado_bb_vc" },
              { title_vc_bb: "Grado", key_vc_bb: "nro_grado_bb_vc" },
            ],
            fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb(
              "SELECT ID_grado_bb_vc, nro_grado_bb_vc FROM td_Grados_bb_vc ORDER BY nro_grado_bb_vc"
            ),
          },
          {
            sheetName_vc_bb: "Secciones",
            headers_vc_bb: [
              { title_vc_bb: "ID", key_vc_bb: "ID_seccion_bb_vc" },
              { title_vc_bb: "Sección", key_vc_bb: "letra_seccion_bb_vc" },
            ],
            fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb(
              "SELECT ID_seccion_bb_vc, letra_seccion_bb_vc FROM td_Secciones_bb_vc ORDER BY letra_seccion_bb_vc"
            ),
          },
        ],
        filePrefix_vc_bb: "grados_secciones",
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error descargando grados+secciones", error: err_vc_bb.message });
    }
  }
}

export const excelController_vc_bb = new ExcelController_vc_bb();
export default excelController_vc_bb;
