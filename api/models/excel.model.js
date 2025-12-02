import XlsxPopulate_vc_bb from "xlsx-populate";
import xl_vc_bb from "excel4node";
import fs_vc_bb from "fs";
import path_vc_bb from "path";

export class ExcelModel_vc_bb {
  static async generateAndSendExcel_vc_bb({
    res_vc_bb,
    sheetName_vc_bb = "Sheet",
    headers_vc_bb = [],
    fetchRows_vc_bb,
    filePrefix_vc_bb = "reporte"
  }) {
    try {
      const rows_vc_bb = await fetchRows_vc_bb();
      const wb_vc_bb = new xl_vc_bb.Workbook();
      const ws_vc_bb = wb_vc_bb.addWorksheet(sheetName_vc_bb);
      headers_vc_bb.forEach((h_vc_bb, i_vc_bb) => {
        ws_vc_bb.cell(1, i_vc_bb + 1).string(h_vc_bb.title_vc_bb);
      });
      rows_vc_bb.forEach((row_vc_bb, rowIndex_vc_bb) => {
        headers_vc_bb.forEach((h_vc_bb, colIndex_vc_bb) => {
          const value_vc_bb = row_vc_bb[h_vc_bb.key_vc_bb];
          if (typeof value_vc_bb === "number") {
            ws_vc_bb.cell(rowIndex_vc_bb + 2, colIndex_vc_bb + 1).number(value_vc_bb);
          } else {
            ws_vc_bb.cell(rowIndex_vc_bb + 2, colIndex_vc_bb + 1).string(
              value_vc_bb !== undefined && value_vc_bb !== null ? String(value_vc_bb) : ""
            );
          }
        });
      });
      const tempDir_vc_bb = path_vc_bb.resolve("temp");
      if (!fs_vc_bb.existsSync(tempDir_vc_bb)) fs_vc_bb.mkdirSync(tempDir_vc_bb);
      const fileName_vc_bb = `${filePrefix_vc_bb}_${Date.now()}.xlsx`;
      const filePath_vc_bb = path_vc_bb.join(tempDir_vc_bb, fileName_vc_bb);
      await new Promise((resolve_vc_bb, reject_vc_bb) => {
        wb_vc_bb.write(filePath_vc_bb, (err_vc_bb) => {
          if (err_vc_bb) return reject_vc_bb(err_vc_bb);
          resolve_vc_bb(true);
        });
      });
      res_vc_bb.download(filePath_vc_bb, `${filePrefix_vc_bb}.xlsx`, (err_vc_bb) => {
        if (err_vc_bb) {
          if (fs_vc_bb.existsSync(filePath_vc_bb)) fs_vc_bb.unlinkSync(filePath_vc_bb);
        } else {
          fs_vc_bb.unlinkSync(filePath_vc_bb);
        }
      });
    } catch (error_vc_bb) {
      if (!res_vc_bb.headersSent) {
        res_vc_bb.status(500).json({ message: "Error al generar Excel." });
      }
    }
  }

  static async generateAndSendMultiSheetExcel_vc_bb({ res_vc_bb, sheets_vc_bb = [], filePrefix_vc_bb = "reporte" }) {
    try {
      const wb_vc_bb = new xl_vc_bb.Workbook();
      for (const sheetCfg_vc_bb of sheets_vc_bb) {
        const ws_vc_bb = wb_vc_bb.addWorksheet(sheetCfg_vc_bb.sheetName_vc_bb || "Sheet");
        const headers_vc_bb = sheetCfg_vc_bb.headers_vc_bb || [];
        headers_vc_bb.forEach((h_vc_bb, i_vc_bb) => {
          ws_vc_bb.cell(1, i_vc_bb + 1).string(h_vc_bb.title_vc_bb);
        });
        const rows_vc_bb = (await sheetCfg_vc_bb.fetchRows_vc_bb()) || [];
        rows_vc_bb.forEach((row_vc_bb, rowIndex_vc_bb) => {
          headers_vc_bb.forEach((h_vc_bb, colIndex_vc_bb) => {
            const value_vc_bb = row_vc_bb[h_vc_bb.key_vc_bb];
            if (typeof value_vc_bb === "number") {
              ws_vc_bb.cell(rowIndex_vc_bb + 2, colIndex_vc_bb + 1).number(value_vc_bb);
            } else {
              ws_vc_bb.cell(rowIndex_vc_bb + 2, colIndex_vc_bb + 1).string(
                value_vc_bb !== undefined && value_vc_bb !== null ? String(value_vc_bb) : ""
              );
            }
          });
        });
      }
      const tempDir_vc_bb = path_vc_bb.resolve("temp");
      if (!fs_vc_bb.existsSync(tempDir_vc_bb)) fs_vc_bb.mkdirSync(tempDir_vc_bb);
      const fileName_vc_bb = `${filePrefix_vc_bb}_${Date.now()}.xlsx`;
      const filePath_vc_bb = path_vc_bb.join(tempDir_vc_bb, fileName_vc_bb);
      await new Promise((resolve_vc_bb, reject_vc_bb) => {
        wb_vc_bb.write(filePath_vc_bb, (err_vc_bb) => {
          if (err_vc_bb) return reject_vc_bb(err_vc_bb);
          resolve_vc_bb(true);
        });
      });
      res_vc_bb.download(filePath_vc_bb, `${filePrefix_vc_bb}.xlsx`, (err_vc_bb) => {
        if (err_vc_bb) {
          if (fs_vc_bb.existsSync(filePath_vc_bb)) fs_vc_bb.unlinkSync(filePath_vc_bb);
        } else {
          fs_vc_bb.unlinkSync(filePath_vc_bb);
        }
      });
    } catch (_) {
      if (!res_vc_bb.headersSent) {
        res_vc_bb.status(500).json({ message: "Error al generar Excel." });
      }
    }
  }

  static async parseAndProcessExcel_vc_bb({ filePath_vc_bb, columns_vc_bb = [], processRow_vc_bb, expectedOrderTitles_vc_bb = [] }) {
    const result_vc_bb = { successfulImports_vc_bb: 0, errors_vc_bb: [] };
    try {
      const workbook_vc_bb = await XlsxPopulate_vc_bb.fromFileAsync(filePath_vc_bb);
      const sheet_vc_bb = workbook_vc_bb.sheet(0);
      const rows_vc_bb = sheet_vc_bb.usedRange().value();
      if (!rows_vc_bb || rows_vc_bb.length < 2) {
        throw new Error("El archivo está vacío o no tiene formato válido.");
      }
      const headerRow_vc_bb = rows_vc_bb[0] || [];
      const normalize_vc_bb = (s_vc_bb) => String(s_vc_bb || "").toLowerCase().replace(/[ _]/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const headerIndex_vc_bb = {};
      headerRow_vc_bb.forEach((h_vc_bb, idx_vc_bb) => {
        const norm_vc_bb = normalize_vc_bb(h_vc_bb);
        if (norm_vc_bb) headerIndex_vc_bb[norm_vc_bb] = idx_vc_bb;
      });
      if (Array.isArray(expectedOrderTitles_vc_bb) && expectedOrderTitles_vc_bb.length > 0) {
        const normalizedHeaders_vc_bb = headerRow_vc_bb.map(normalize_vc_bb);
        const expectedNormalized_vc_bb = expectedOrderTitles_vc_bb.map(normalize_vc_bb);
        const matchesOrder_vc_bb = expectedNormalized_vc_bb.length <= normalizedHeaders_vc_bb.length && expectedNormalized_vc_bb.every((exp_vc_bb, i_vc_bb) => normalizedHeaders_vc_bb[i_vc_bb] === exp_vc_bb);
        if (!matchesOrder_vc_bb) {
          throw new Error(`Encabezados inválidos. Orden requerido: ${expectedOrderTitles_vc_bb.join(', ')}.`);
        }
      }
      for (let i_vc_bb = 1; i_vc_bb < rows_vc_bb.length; i_vc_bb++) {
        const row_vc_bb = rows_vc_bb[i_vc_bb];
        if (!row_vc_bb || row_vc_bb.every((cell_vc_bb) => cell_vc_bb === null || cell_vc_bb === undefined || cell_vc_bb === "")) {
          continue;
        }
        const rowMap_vc_bb = {};
        columns_vc_bb.forEach((col_vc_bb, idx_vc_bb) => {
          const aliases_vc_bb = Array.isArray(col_vc_bb.aliases_vc_bb) ? col_vc_bb.aliases_vc_bb : [];
          const candidates_vc_bb = [col_vc_bb.key_vc_bb, ...aliases_vc_bb].map(normalize_vc_bb);
          let foundIndex_vc_bb = undefined;
          for (const cand_vc_bb of candidates_vc_bb) {
            if (cand_vc_bb in headerIndex_vc_bb) { foundIndex_vc_bb = headerIndex_vc_bb[cand_vc_bb]; break; }
          }
          const useIdx_vc_bb = foundIndex_vc_bb !== undefined ? foundIndex_vc_bb : idx_vc_bb;
          rowMap_vc_bb[col_vc_bb.key_vc_bb] = row_vc_bb[useIdx_vc_bb];
        });
        const missing_vc_bb = columns_vc_bb.filter((c_vc_bb) => c_vc_bb.required_vc_bb).filter((c_vc_bb) => !rowMap_vc_bb[c_vc_bb.key_vc_bb]);
        if (missing_vc_bb.length) {
          result_vc_bb.errors_vc_bb.push(`Fila ${i_vc_bb + 1}: Faltan datos obligatorios (${missing_vc_bb.map((m_vc_bb) => m_vc_bb.key_vc_bb).join(", ")}).`);
          continue;
        }
        try {
          await processRow_vc_bb(rowMap_vc_bb);
          result_vc_bb.successfulImports_vc_bb++;
        } catch (rowError_vc_bb) {
          result_vc_bb.errors_vc_bb.push(`Fila ${i_vc_bb + 1}: Error - ${rowError_vc_bb.message}`);
        }
      }
    } catch (e_vc_bb) {
      result_vc_bb.errors_vc_bb.push(e_vc_bb.message || "Error procesando archivo.");
    } finally {
      if (filePath_vc_bb && fs_vc_bb.existsSync(filePath_vc_bb)) {
        try { fs_vc_bb.unlinkSync(filePath_vc_bb); } catch {}
      }
    }
    return result_vc_bb;
  }

  static async parseAndProcessMultiSheets_vc_bb({ filePath_vc_bb, sheets_vc_bb = [] }) {
    const result_vc_bb = { successfulImports_vc_bb: 0, errors_vc_bb: [] };
    try {
      const workbook_vc_bb = await XlsxPopulate_vc_bb.fromFileAsync(filePath_vc_bb);
      for (const sheetCfg_vc_bb of sheets_vc_bb) {
        const sheet_vc_bb = workbook_vc_bb.sheet(sheetCfg_vc_bb.sheetName_vc_bb) || workbook_vc_bb.sheet(0);
        const rows_vc_bb = sheet_vc_bb.usedRange().value();
        if (!rows_vc_bb || rows_vc_bb.length < 2) {
          result_vc_bb.errors_vc_bb.push(`Hoja '${sheetCfg_vc_bb.sheetName_vc_bb}': vacía o inválida.`);
          continue;
        }
        const headerRow_vc_bb = rows_vc_bb[0] || [];
        const normalize_vc_bb = (s_vc_bb) => String(s_vc_bb || "").toLowerCase().replace(/[ _]/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const headerIndex_vc_bb = {};
        headerRow_vc_bb.forEach((h_vc_bb, idx_vc_bb) => {
          const norm_vc_bb = normalize_vc_bb(h_vc_bb);
          if (norm_vc_bb) headerIndex_vc_bb[norm_vc_bb] = idx_vc_bb;
        });
        for (let i_vc_bb = 1; i_vc_bb < rows_vc_bb.length; i_vc_bb++) {
          const row_vc_bb = rows_vc_bb[i_vc_bb];
          if (!row_vc_bb || row_vc_bb.every((c_vc_bb) => c_vc_bb === null || c_vc_bb === undefined || c_vc_bb === "")) {
            continue;
          }
          const rowMap_vc_bb = {};
          sheetCfg_vc_bb.columns_vc_bb.forEach((col_vc_bb, idx_vc_bb) => {
            const aliases_vc_bb = Array.isArray(col_vc_bb.aliases_vc_bb) ? col_vc_bb.aliases_vc_bb : [];
            const candidates_vc_bb = [col_vc_bb.key_vc_bb, ...aliases_vc_bb].map(normalize_vc_bb);
            let foundIndex_vc_bb = undefined;
            for (const cand_vc_bb of candidates_vc_bb) {
              if (cand_vc_bb in headerIndex_vc_bb) { foundIndex_vc_bb = headerIndex_vc_bb[cand_vc_bb]; break; }
            }
            const useIdx_vc_bb = foundIndex_vc_bb !== undefined ? foundIndex_vc_bb : idx_vc_bb;
            rowMap_vc_bb[col_vc_bb.key_vc_bb] = row_vc_bb[useIdx_vc_bb];
          });
          const missing_vc_bb = sheetCfg_vc_bb.columns_vc_bb.filter((c_vc_bb) => c_vc_bb.required_vc_bb).filter((c_vc_bb) => !rowMap_vc_bb[c_vc_bb.key_vc_bb]);
          if (missing_vc_bb.length) {
            result_vc_bb.errors_vc_bb.push(`Hoja '${sheetCfg_vc_bb.sheetName_vc_bb}' - Fila ${i_vc_bb + 1}: faltan (${missing_vc_bb.map((m_vc_bb) => m_vc_bb.key_vc_bb).join(", ")}).`);
            continue;
          }
          try {
            await sheetCfg_vc_bb.processRow_vc_bb(rowMap_vc_bb);
            result_vc_bb.successfulImports_vc_bb++;
          } catch (rowError_vc_bb) {
            result_vc_bb.errors_vc_bb.push(`Hoja '${sheetCfg_vc_bb.sheetName_vc_bb}' - Fila ${i_vc_bb + 1}: ${rowError_vc_bb.message}`);
          }
        }
      }
    } catch (e_vc_bb) {
      result_vc_bb.errors_vc_bb.push(e_vc_bb.message || "Error procesando archivo.");
    } finally {
      if (filePath_vc_bb && fs_vc_bb.existsSync(filePath_vc_bb)) {
        try { fs_vc_bb.unlinkSync(filePath_vc_bb); } catch {}
      }
    }
    return result_vc_bb;
  }
}

export default ExcelModel_vc_bb;
/*
ExcelModel (MySQL)
- Transformaciones para carga masiva desde Excel.
- Inserción en tablas destino con validación básica.
*/
