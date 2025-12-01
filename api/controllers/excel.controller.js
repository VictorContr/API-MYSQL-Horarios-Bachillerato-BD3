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
          { key_vc_bb: "nro_grado_bb_vc", required_vc_bb: true, aliases_vc_bb: ["Grado", "grado"] },
        ],
        processRow_vc_bb: async ({ nro_grado_bb_vc }) => {
          const nro_vc_bb = Number(nro_grado_bb_vc);
          if (Number.isNaN(nro_vc_bb)) throw new Error("Grado inválido");
          await db_vc_bb.query_vc_bb("CALL sp_upsert_grado_bb_vc(?)", [nro_vc_bb]);
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
          { title_vc_bb: "Grado", key_vc_bb: "nro_grado_bb_vc" },
        ],
        fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb("SELECT nro_grado_bb_vc FROM td_Grados_bb_vc ORDER BY nro_grado_bb_vc"),
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
          { key_vc_bb: "letra_seccion_bb_vc", required_vc_bb: true, aliases_vc_bb: ["Sección", "seccion", "Seccion"] },
        ],
        processRow_vc_bb: async ({ letra_seccion_bb_vc }) => {
          const letra_vc_bb = String(letra_seccion_bb_vc || "").trim();
          if (!letra_vc_bb) throw new Error("Sección inválida");
          await db_vc_bb.query_vc_bb("CALL sp_upsert_seccion_bb_vc(?)", [letra_vc_bb]);
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
          { title_vc_bb: "Sección", key_vc_bb: "letra_seccion_bb_vc" },
        ],
        fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb("SELECT letra_seccion_bb_vc FROM td_Secciones_bb_vc ORDER BY letra_seccion_bb_vc"),
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
            columns_vc_bb: [
              { key_vc_bb: "nro_grado_bb_vc", required_vc_bb: true, aliases_vc_bb: ["Grado", "grado"] },
            ],
            processRow_vc_bb: async ({ nro_grado_bb_vc }) => {
              const nro_vc_bb = Number(nro_grado_bb_vc);
              if (Number.isNaN(nro_vc_bb)) throw new Error("Grado inválido");
              await db_vc_bb.query_vc_bb("CALL sp_upsert_grado_bb_vc(?)", [nro_vc_bb]);
            },
          },
          {
            sheetName_vc_bb: "Secciones",
            columns_vc_bb: [
              { key_vc_bb: "letra_seccion_bb_vc", required_vc_bb: true, aliases_vc_bb: ["Sección", "seccion", "Seccion"] },
            ],
            processRow_vc_bb: async ({ letra_seccion_bb_vc }) => {
              const letra_vc_bb = String(letra_seccion_bb_vc || "").trim();
              if (!letra_vc_bb) throw new Error("Sección inválida");
              await db_vc_bb.query_vc_bb("CALL sp_upsert_seccion_bb_vc(?)", [letra_vc_bb]);
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
              { title_vc_bb: "Grado", key_vc_bb: "nro_grado_bb_vc" },
            ],
            fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb(
              "SELECT nro_grado_bb_vc FROM td_Grados_bb_vc ORDER BY nro_grado_bb_vc"
            ),
          },
          {
            sheetName_vc_bb: "Secciones",
            headers_vc_bb: [
              { title_vc_bb: "Sección", key_vc_bb: "letra_seccion_bb_vc" },
            ],
            fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb(
              "SELECT letra_seccion_bb_vc FROM td_Secciones_bb_vc ORDER BY letra_seccion_bb_vc"
            ),
          },
        ],
        filePrefix_vc_bb: "grados_secciones",
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error descargando grados+secciones", error: err_vc_bb.message });
    }
  }

  async descargarEspaciosExcel_vc_bb(req_vc_bb, res_vc_bb) {
    try {
      await ExcelModel_vc_bb.generateAndSendExcel_vc_bb({
        res_vc_bb,
        sheetName_vc_bb: "Espacios",
        headers_vc_bb: [
          { title_vc_bb: "Nombre", key_vc_bb: "nombre_bb_vc" },
          { title_vc_bb: "Capacidad", key_vc_bb: "capacidad_bb_vc" },
          { title_vc_bb: "Tipo", key_vc_bb: "tipo_bb_vc" },
        ],
        fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb(
          "SELECT e.nombre_bb_vc, e.capacidad_bb_vc, t.tipo_bb_vc FROM td_Espacios_bb_vc e LEFT JOIN td_TipoEspacio_bb_vc t ON e.ID_TipoEspacio_espacio_bb_vc = t.ID_TipoEspacio_bb_vc"
        ),
        filePrefix_vc_bb: "espacios",
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error descargando espacios", error: err_vc_bb.message });
    }
  }

  async subirEspaciosExcel_vc_bb(req_vc_bb, res_vc_bb) {
    const filePath_vc_bb = req_vc_bb.file?.path;
    if (!filePath_vc_bb) return res_vc_bb.status(400).json({ message: "Archivo faltante" });
    try {
      const result_vc_bb = await ExcelModel_vc_bb.parseAndProcessExcel_vc_bb({
        filePath_vc_bb,
        columns_vc_bb: [
          { key_vc_bb: "nombre_bb_vc", required_vc_bb: true },
          { key_vc_bb: "capacidad_bb_vc", required_vc_bb: false },
          { key_vc_bb: "tipo_bb_vc", required_vc_bb: true },
        ],
        processRow_vc_bb: async ({ nombre_bb_vc, capacidad_bb_vc, tipo_bb_vc }) => {
          const nombre_vc_bb = String(nombre_bb_vc || "").trim();
          const tipoNombre_vc_bb = String(tipo_bb_vc || "").trim();
          if (!nombre_vc_bb || !tipoNombre_vc_bb) throw new Error("Faltan campos requeridos (nombre o tipo)");
          const capacidad_vc_bb = capacidad_bb_vc != null && capacidad_bb_vc !== "" ? parseInt(capacidad_bb_vc, 10) : null;
          const tipo_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_TipoEspacio_bb_vc FROM td_TipoEspacio_bb_vc WHERE tipo_bb_vc = ?", [tipoNombre_vc_bb]);
          if (!tipo_vc_bb) throw new Error(`Tipo de espacio no existe: '${tipoNombre_vc_bb}'`);
          await db_vc_bb.execute_vc_bb(
            "INSERT INTO td_Espacios_bb_vc (nombre_bb_vc, capacidad_bb_vc, ID_TipoEspacio_espacio_bb_vc) VALUES (?, ?, ?)",
            [nombre_vc_bb, capacidad_vc_bb ?? null, tipo_vc_bb.ID_TipoEspacio_bb_vc]
          );
        },
      });
      res_vc_bb.json({
        message: `Proceso finalizado. Importados: ${result_vc_bb.successfulImports_vc_bb}.`,
        errors: result_vc_bb.errors_vc_bb,
        exito: result_vc_bb.successfulImports_vc_bb > 0,
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error importando espacios", error: err_vc_bb.message });
    }
  }

  async descargarProfesoresExcel_vc_bb(req_vc_bb, res_vc_bb) {
    try {
      await ExcelModel_vc_bb.generateAndSendExcel_vc_bb({
        res_vc_bb,
        sheetName_vc_bb: "Profesores",
        headers_vc_bb: [
          { title_vc_bb: "Nombre", key_vc_bb: "nombre_bb_vc" },
          { title_vc_bb: "Apellido", key_vc_bb: "apellido_bb_vc" },
          { title_vc_bb: "Correo", key_vc_bb: "correo_bb_vc" },
          { title_vc_bb: "Teléfono", key_vc_bb: "telefono_bb_vc" },
          { title_vc_bb: "Asignaturas", key_vc_bb: "asignaturas" },
        ],
        fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb(
          "SELECT u.nombre_bb_vc, u.apellido_bb_vc, u.correo_bb_vc, u.telefono_bb_vc, COALESCE(GROUP_CONCAT(a.nombre_bb_vc SEPARATOR ' | '), '') AS asignaturas FROM td_Profesores_bb_vc p JOIN td_UsuarioRol_bb_vc ur ON p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc JOIN td_Usuarios_bb_vc u ON ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc LEFT JOIN td_ProfesorAsignaturas_bb_vc pa ON pa.ID_profesor_profAsig_bb_vc = p.ID_profesor_bb_vc LEFT JOIN td_Asignaturas_bb_vc a ON pa.ID_asignatura_profAsig_bb_vc = a.ID_asignatura_bb_vc GROUP BY u.nombre_bb_vc, u.apellido_bb_vc, u.correo_bb_vc, u.telefono_bb_vc"
        ),
        filePrefix_vc_bb: "profesores",
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error descargando profesores", error: err_vc_bb.message });
    }
  }

  async subirProfesoresExcel_vc_bb(req_vc_bb, res_vc_bb) {
    const filePath_vc_bb = req_vc_bb.file?.path;
    if (!filePath_vc_bb) return res_vc_bb.status(400).json({ message: "Archivo faltante" });
    const warningsAsign_vc_bb = [];
    const getProfesorRolId_vc_bb = async () => {
      const rol_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_rol_bb_vc FROM td_Rol_bb_vc WHERE rol_bb_vc = 'Profesor' LIMIT 1");
      return rol_vc_bb?.ID_rol_bb_vc || 2;
    };
    const generateUsername_vc_bb = async (nombre_vc_bb, apellido_vc_bb) => {
      const cleanNombre_vc_bb = (nombre_vc_bb || "u").toString().toLowerCase().trim();
      const cleanApellido_vc_bb = (apellido_vc_bb || "user").toString().toLowerCase().replace(/\s/g, "").trim();
      const baseUsername_vc_bb = `${cleanNombre_vc_bb.charAt(0)}${cleanApellido_vc_bb}`;
      let username_vc_bb = baseUsername_vc_bb;
      let counter_vc_bb = 1;
      while (true) {
        const existingUser_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_usuario_bb_vc FROM td_Usuarios_bb_vc WHERE userName_bb_vc = ?", [username_vc_bb]);
        if (!existingUser_vc_bb) return username_vc_bb;
        username_vc_bb = `${baseUsername_vc_bb}${counter_vc_bb}`;
        counter_vc_bb++;
        if (counter_vc_bb > 100) return `${baseUsername_vc_bb}${Date.now()}`;
      }
    };
    try {
      const result_vc_bb = await ExcelModel_vc_bb.parseAndProcessExcel_vc_bb({
        filePath_vc_bb,
        columns_vc_bb: [
          { key_vc_bb: "nombre_bb_vc", required_vc_bb: true },
          { key_vc_bb: "apellido_bb_vc", required_vc_bb: true },
          { key_vc_bb: "correo_bb_vc", required_vc_bb: true },
          { key_vc_bb: "telefono_bb_vc", required_vc_bb: false },
          { key_vc_bb: "asignaturas", required_vc_bb: false },
        ],
        processRow_vc_bb: async (rowMap_vc_bb) => {
          const nombre_vc_bb = rowMap_vc_bb.nombre_bb_vc;
          const apellido_vc_bb = rowMap_vc_bb.apellido_bb_vc;
          const correo_vc_bb = rowMap_vc_bb.correo_bb_vc;
          const telefono_vc_bb = rowMap_vc_bb.telefono_bb_vc;
          const asignaturasRaw_vc_bb = rowMap_vc_bb.asignaturas;
          const existingUser_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_usuario_bb_vc FROM td_Usuarios_bb_vc WHERE correo_bb_vc = ?", [correo_vc_bb]);
          if (existingUser_vc_bb) throw new Error(`El correo ${correo_vc_bb} ya existe`);
          const userNameGenerado_vc_bb = await generateUsername_vc_bb(nombre_vc_bb, apellido_vc_bb);
          const passwordDefault_vc_bb = "123456";
          const userInsert_vc_bb = await db_vc_bb.execute_vc_bb(
            "INSERT INTO td_Usuarios_bb_vc (nombre_bb_vc, apellido_bb_vc, correo_bb_vc, telefono_bb_vc, userName_bb_vc, password_bb_vc) VALUES (?, ?, ?, ?, ?, ?)",
            [String(nombre_vc_bb).trim(), String(apellido_vc_bb).trim(), String(correo_vc_bb).trim(), String(telefono_vc_bb ?? "").trim(), userNameGenerado_vc_bb, passwordDefault_vc_bb]
          );
          const newUserId_vc_bb = userInsert_vc_bb.insertId;
          const rolProfesorId_vc_bb = await getProfesorRolId_vc_bb();
          const userRolInsert_vc_bb = await db_vc_bb.execute_vc_bb(
            "INSERT INTO td_UsuarioRol_bb_vc (ID_usuario_usuarioRol_bb_vc, ID_rol_usuarioRol_bb_vc) VALUES (?, ?)",
            [newUserId_vc_bb, rolProfesorId_vc_bb]
          );
          const newUserRolId_vc_bb = userRolInsert_vc_bb.insertId;
          const profInsert_vc_bb = await db_vc_bb.execute_vc_bb(
            "INSERT INTO td_Profesores_bb_vc (ID_usuarioRol_profesor_bb_vc) VALUES (?)",
            [newUserRolId_vc_bb]
          );
          const newProfId_vc_bb = profInsert_vc_bb.insertId;
          if (newProfId_vc_bb && asignaturasRaw_vc_bb != null && asignaturasRaw_vc_bb !== "") {
            const list_vc_bb = String(asignaturasRaw_vc_bb).split(/[,;|]+/).map((s_vc_bb) => s_vc_bb.trim()).filter((s_vc_bb) => s_vc_bb.length > 0);
            for (const nombreAsig_vc_bb of list_vc_bb) {
              const asig_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_asignatura_bb_vc FROM td_Asignaturas_bb_vc WHERE nombre_bb_vc = ?", [nombreAsig_vc_bb]);
              if (!asig_vc_bb) {
                warningsAsign_vc_bb.push(`Fila profesor '${nombre_vc_bb} ${apellido_vc_bb}': asignatura inexistente '${nombreAsig_vc_bb}'`);
                continue;
              }
              const existsRel_vc_bb = await db_vc_bb.getOne_vc_bb(
                "SELECT ID_profesorAsig_bb_vc FROM td_ProfesorAsignaturas_bb_vc WHERE ID_profesor_profAsig_bb_vc = ? AND ID_asignatura_profAsig_bb_vc = ?",
                [newProfId_vc_bb, asig_vc_bb.ID_asignatura_bb_vc]
              );
              if (!existsRel_vc_bb) {
                await db_vc_bb.execute_vc_bb(
                  "INSERT INTO td_ProfesorAsignaturas_bb_vc (ID_profesor_profAsig_bb_vc, ID_asignatura_profAsig_bb_vc) VALUES (?, ?)",
                  [newProfId_vc_bb, asig_vc_bb.ID_asignatura_bb_vc]
                );
              }
            }
          }
        },
      });
      res_vc_bb.json({
        message: `Proceso finalizado. Importados: ${result_vc_bb.successfulImports_vc_bb}.`,
        errors: [...result_vc_bb.errors_vc_bb, ...warningsAsign_vc_bb],
        exito: result_vc_bb.successfulImports_vc_bb > 0,
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error importando profesores", error: err_vc_bb.message });
    }
  }

  async descargarAsignaturasGradosExcel_vc_bb(req_vc_bb, res_vc_bb) {
    try {
      await ExcelModel_vc_bb.generateAndSendExcel_vc_bb({
        res_vc_bb,
        sheetName_vc_bb: "Asignaturas",
        headers_vc_bb: [
          { title_vc_bb: "Asignatura", key_vc_bb: "nombre_bb_vc" },
          { title_vc_bb: "Horas Semanales", key_vc_bb: "horas_academicas_bb_vc" },
          { title_vc_bb: "Descripción", key_vc_bb: "descripcion_bb_vc" },
          { title_vc_bb: "Duración Bloque Min", key_vc_bb: "duracion_bloque_min_bb_vc" },
          { title_vc_bb: "Duración Bloque Max", key_vc_bb: "duracion_bloque_max_bb_vc" },
          { title_vc_bb: "Tipo Espacio Requerido", key_vc_bb: "tipo_espacio_requerido_bb_vc" },
          { title_vc_bb: "Grado", key_vc_bb: "nro_grado_bb_vc" },
        ],
        fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb(
          "SELECT a.nombre_bb_vc, a.horas_academicas_bb_vc, a.descripcion_bb_vc, a.duracion_bloque_min_bb_vc, a.duracion_bloque_max_bb_vc, te.tipo_bb_vc AS tipo_espacio_requerido_bb_vc, g.nro_grado_bb_vc FROM td_Asignaturas_bb_vc a LEFT JOIN td_GradosAsignaturas_bb_vc ga ON ga.ID_asignatura_gradoAsig_bb_vc = a.ID_asignatura_bb_vc LEFT JOIN td_Grados_bb_vc g ON ga.ID_grado_gradoAsig_bb_vc = g.ID_grado_bb_vc LEFT JOIN td_TipoEspacio_bb_vc te ON a.ID_TipoEspacio_requerido_bb_vc = te.ID_TipoEspacio_bb_vc ORDER BY a.nombre_bb_vc ASC, g.nro_grado_bb_vc ASC"
        ),
        filePrefix_vc_bb: "asignaturas_grados",
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error descargando asignaturas", error: err_vc_bb.message });
    }
  }

  async subirAsignaturasGradosExcel_vc_bb(req_vc_bb, res_vc_bb) {
    const filePath_vc_bb = req_vc_bb.file?.path;
    if (!filePath_vc_bb) return res_vc_bb.status(400).json({ message: "Archivo faltante" });
    try {
      const result_vc_bb = await ExcelModel_vc_bb.parseAndProcessExcel_vc_bb({
        filePath_vc_bb,
        columns_vc_bb: [
          { key_vc_bb: "nombre_bb_vc", required_vc_bb: true },
          { key_vc_bb: "horas_academicas_bb_vc", required_vc_bb: false },
          { key_vc_bb: "descripcion_bb_vc", required_vc_bb: false },
          { key_vc_bb: "duracion_bloque_min_bb_vc", required_vc_bb: false },
          { key_vc_bb: "duracion_bloque_max_bb_vc", required_vc_bb: false },
          { key_vc_bb: "tipo_espacio_requerido_bb_vc", required_vc_bb: false },
          { key_vc_bb: "nro_grado_bb_vc", required_vc_bb: false },
        ],
        processRow_vc_bb: async (rowMap_vc_bb) => {
          const nombre_vc_bb = String(rowMap_vc_bb.nombre_bb_vc || "").trim();
          const horasRaw_vc_bb = rowMap_vc_bb.horas_academicas_bb_vc;
          const descripcionRaw_vc_bb = rowMap_vc_bb.descripcion_bb_vc;
          const durMinRaw_vc_bb = rowMap_vc_bb.duracion_bloque_min_bb_vc;
          const durMaxRaw_vc_bb = rowMap_vc_bb.duracion_bloque_max_bb_vc;
          const tipoEspacioNombre_vc_bb = String(rowMap_vc_bb.tipo_espacio_requerido_bb_vc || "").trim();
          const gradoRaw_vc_bb = rowMap_vc_bb.nro_grado_bb_vc;
          if (!nombre_vc_bb) throw new Error("Nombre de asignatura vacío");
          const horas_vc_bb = horasRaw_vc_bb != null && horasRaw_vc_bb !== "" ? parseInt(String(horasRaw_vc_bb).trim(), 10) : null;
          if (horas_vc_bb != null && (!Number.isInteger(horas_vc_bb) || horas_vc_bb < 0)) throw new Error("Horas académicas inválidas");
          const durMin_vc_bb = durMinRaw_vc_bb != null && durMinRaw_vc_bb !== "" ? parseInt(String(durMinRaw_vc_bb).trim(), 10) : null;
          const durMax_vc_bb = durMaxRaw_vc_bb != null && durMaxRaw_vc_bb !== "" ? parseInt(String(durMaxRaw_vc_bb).trim(), 10) : null;
          if (durMin_vc_bb != null && (!Number.isInteger(durMin_vc_bb) || durMin_vc_bb < 1)) throw new Error("Duración mínima inválida (entero >= 1)");
          if (durMax_vc_bb != null && (!Number.isInteger(durMax_vc_bb) || durMax_vc_bb < 1)) throw new Error("Duración máxima inválida (entero >= 1)");
          if (durMin_vc_bb != null && durMax_vc_bb != null && durMin_vc_bb > durMax_vc_bb) throw new Error("Duración mínima no puede ser mayor que máxima");
          let asignatura_vc_bb = await db_vc_bb.getOne_vc_bb(
            "SELECT ID_asignatura_bb_vc, horas_academicas_bb_vc, descripcion_bb_vc, duracion_bloque_min_bb_vc, duracion_bloque_max_bb_vc, ID_TipoEspacio_requerido_bb_vc FROM td_Asignaturas_bb_vc WHERE nombre_bb_vc = ?",
            [nombre_vc_bb]
          );
          if (!asignatura_vc_bb) {
            let tipoEspacioId_vc_bb = null;
            if (tipoEspacioNombre_vc_bb) {
              const tipo_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_TipoEspacio_bb_vc FROM td_TipoEspacio_bb_vc WHERE tipo_bb_vc = ?", [tipoEspacioNombre_vc_bb]);
              if (!tipo_vc_bb) throw new Error(`Tipo de espacio no existe: '${tipoEspacioNombre_vc_bb}'`);
              tipoEspacioId_vc_bb = tipo_vc_bb.ID_TipoEspacio_bb_vc;
            }
            const insert_vc_bb = await db_vc_bb.execute_vc_bb(
              "INSERT INTO td_Asignaturas_bb_vc (nombre_bb_vc, horas_academicas_bb_vc, descripcion_bb_vc, duracion_bloque_min_bb_vc, duracion_bloque_max_bb_vc, ID_TipoEspacio_requerido_bb_vc) VALUES (?, ?, ?, ?, ?, ?)",
              [
                nombre_vc_bb,
                horas_vc_bb ?? null,
                descripcionRaw_vc_bb != null ? String(descripcionRaw_vc_bb).trim() : null,
                durMin_vc_bb ?? null,
                durMax_vc_bb ?? null,
                tipoEspacioId_vc_bb ?? null,
              ]
            );
            asignatura_vc_bb = { ID_asignatura_bb_vc: insert_vc_bb.insertId };
          } else {
            if (horas_vc_bb != null && horas_vc_bb !== asignatura_vc_bb.horas_academicas_bb_vc) {
              await db_vc_bb.execute_vc_bb("UPDATE td_Asignaturas_bb_vc SET horas_academicas_bb_vc = ? WHERE ID_asignatura_bb_vc = ?", [horas_vc_bb, asignatura_vc_bb.ID_asignatura_bb_vc]);
            }
            if (descripcionRaw_vc_bb != null) {
              const nuevaDesc_vc_bb = String(descripcionRaw_vc_bb).trim();
              await db_vc_bb.execute_vc_bb("UPDATE td_Asignaturas_bb_vc SET descripcion_bb_vc = ? WHERE ID_asignatura_bb_vc = ?", [nuevaDesc_vc_bb, asignatura_vc_bb.ID_asignatura_bb_vc]);
            }
            if (durMin_vc_bb != null) {
              await db_vc_bb.execute_vc_bb("UPDATE td_Asignaturas_bb_vc SET duracion_bloque_min_bb_vc = ? WHERE ID_asignatura_bb_vc = ?", [durMin_vc_bb, asignatura_vc_bb.ID_asignatura_bb_vc]);
            }
            if (durMax_vc_bb != null) {
              await db_vc_bb.execute_vc_bb("UPDATE td_Asignaturas_bb_vc SET duracion_bloque_max_bb_vc = ? WHERE ID_asignatura_bb_vc = ?", [durMax_vc_bb, asignatura_vc_bb.ID_asignatura_bb_vc]);
            }
            if (tipoEspacioNombre_vc_bb) {
              const tipo_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_TipoEspacio_bb_vc FROM td_TipoEspacio_bb_vc WHERE tipo_bb_vc = ?", [tipoEspacioNombre_vc_bb]);
              if (!tipo_vc_bb) throw new Error(`Tipo de espacio no existe: '${tipoEspacioNombre_vc_bb}'`);
              await db_vc_bb.execute_vc_bb("UPDATE td_Asignaturas_bb_vc SET ID_TipoEspacio_requerido_bb_vc = ? WHERE ID_asignatura_bb_vc = ?", [tipo_vc_bb.ID_TipoEspacio_bb_vc, asignatura_vc_bb.ID_asignatura_bb_vc]);
            }
          }
          if (gradoRaw_vc_bb != null && gradoRaw_vc_bb !== "") {
            const gradoNum_vc_bb = parseInt(String(gradoRaw_vc_bb).trim(), 10);
            if (!Number.isInteger(gradoNum_vc_bb) || gradoNum_vc_bb < 1 || gradoNum_vc_bb > 5) throw new Error("Grado inválido (debe ser 1-5)");
            const grado_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_grado_bb_vc FROM td_Grados_bb_vc WHERE nro_grado_bb_vc = ?", [gradoNum_vc_bb]);
            if (!grado_vc_bb) throw new Error(`El grado '${gradoNum_vc_bb}' no existe`);
            const existingRel_vc_bb = await db_vc_bb.getOne_vc_bb(
              "SELECT ID_gradoAsignatura_bb_vc FROM td_GradosAsignaturas_bb_vc WHERE ID_grado_gradoAsig_bb_vc = ? AND ID_asignatura_gradoAsig_bb_vc = ?",
              [grado_vc_bb.ID_grado_bb_vc, asignatura_vc_bb.ID_asignatura_bb_vc]
            );
            if (!existingRel_vc_bb) {
              await db_vc_bb.execute_vc_bb(
                "INSERT INTO td_GradosAsignaturas_bb_vc (ID_grado_gradoAsig_bb_vc, ID_asignatura_gradoAsig_bb_vc) VALUES (?, ?)",
                [grado_vc_bb.ID_grado_bb_vc, asignatura_vc_bb.ID_asignatura_bb_vc]
              );
            }
          }
        },
      });
      res_vc_bb.json({
        message: `Proceso finalizado. Importados: ${result_vc_bb.successfulImports_vc_bb}.`,
        errors: result_vc_bb.errors_vc_bb,
        exito: result_vc_bb.successfulImports_vc_bb > 0,
      });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error importando asignaturas", error: err_vc_bb.message });
    }
  }

  async descargarDisponibilidadesExcel_vc_bb(req_vc_bb, res_vc_bb) {
    try {
      const sheets_vc_bb = [
        {
          sheetName_vc_bb: "DisponibilidadProfesor",
          headers_vc_bb: [
            { title_vc_bb: "Día", key_vc_bb: "dia_bb_vc" },
            { title_vc_bb: "Bloque", key_vc_bb: "hora_bloque_bb_vc" },
            { title_vc_bb: "Usuario Profesor", key_vc_bb: "userName_bb_vc" },
          ],
          fetchRows_vc_bb: async () => db_vc_bb.query_vc_bb(
            "SELECT d.dia_bb_vc, b.hora_bloque_bb_vc, u.userName_bb_vc FROM td_DisponibilidadProfesor_bb_vc dp LEFT JOIN td_Dia_bb_vc d ON dp.ID_dia_DispProfesor_bb_vc = d.ID_dia_bb_vc LEFT JOIN td_Bloque_bb_vc b ON dp.ID_bloque_DispProfesor_bb_vc = b.ID_bloque_bb_vc LEFT JOIN td_Profesores_bb_vc p ON dp.ID_profesor_DispProfesor_bb_vc = p.ID_profesor_bb_vc LEFT JOIN td_UsuarioRol_bb_vc ur ON p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc LEFT JOIN td_Usuarios_bb_vc u ON ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc ORDER BY d.dia_bb_vc, b.hora_bloque_bb_vc, u.userName_bb_vc"
          ),
        },
      ];
      await ExcelModel_vc_bb.generateAndSendMultiSheetExcel_vc_bb({ res_vc_bb, sheets_vc_bb, filePrefix_vc_bb: "disponibilidades" });
    } catch (err_vc_bb) {
      res_vc_bb.status(500).json({ message: "Error al generar Excel de disponibilidades", error: err_vc_bb.message });
    }
  }

  async subirDisponibilidadesExcel_vc_bb(req_vc_bb, res_vc_bb) {
    const filePath_vc_bb = req_vc_bb.file?.path;
    if (!filePath_vc_bb) return res_vc_bb.status(400).json({ message: "Archivo faltante" });
    try {
      const result_vc_bb = await ExcelModel_vc_bb.parseAndProcessMultiSheets_vc_bb({
        filePath_vc_bb,
        sheets_vc_bb: [
          {
            sheetName_vc_bb: "DisponibilidadProfesor",
            columns_vc_bb: [
              { key_vc_bb: "dia_bb_vc", required_vc_bb: true },
              { key_vc_bb: "hora_bloque_bb_vc", required_vc_bb: true },
              { key_vc_bb: "userName_bb_vc", required_vc_bb: true },
            ],
            processRow_vc_bb: async ({ dia_bb_vc, hora_bloque_bb_vc, userName_bb_vc }) => {
              const dia_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_dia_bb_vc FROM td_Dia_bb_vc WHERE LOWER(dia_bb_vc) = LOWER(?)", [dia_bb_vc]);
              if (!dia_vc_bb) throw new Error(`Día inválido: '${dia_bb_vc}'`);
              const bloque_vc_bb = await db_vc_bb.getOne_vc_bb("SELECT ID_bloque_bb_vc FROM td_Bloque_bb_vc WHERE hora_bloque_bb_vc = ?", [hora_bloque_bb_vc]);
              if (!bloque_vc_bb) throw new Error(`Bloque inválido: '${hora_bloque_bb_vc}'`);
              const profesor_vc_bb = await db_vc_bb.getOne_vc_bb(
                "SELECT p.ID_profesor_bb_vc AS id_profesor FROM td_Profesores_bb_vc p JOIN td_UsuarioRol_bb_vc ur ON p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc JOIN td_Usuarios_bb_vc u ON ur.ID_usuario_usuarioRol_bb_vc = u.ID_usuario_bb_vc WHERE u.userName_bb_vc = ?",
                [userName_bb_vc]
              );
              if (!profesor_vc_bb) throw new Error(`Profesor no encontrado: '${userName_bb_vc}'`);
              const exists_vc_bb = await db_vc_bb.getOne_vc_bb(
                "SELECT ID_DisponibilidadProfesor_bb_vc FROM td_DisponibilidadProfesor_bb_vc WHERE ID_dia_DispProfesor_bb_vc = ? AND ID_bloque_DispProfesor_bb_vc = ? AND ID_profesor_DispProfesor_bb_vc = ?",
                [dia_vc_bb.ID_dia_bb_vc, bloque_vc_bb.ID_bloque_bb_vc, profesor_vc_bb.id_profesor]
              );
              if (!exists_vc_bb) {
                await db_vc_bb.execute_vc_bb(
                  "INSERT INTO td_DisponibilidadProfesor_bb_vc (ID_dia_DispProfesor_bb_vc, ID_bloque_DispProfesor_bb_vc, ID_profesor_DispProfesor_bb_vc) VALUES (?, ?, ?)",
                  [dia_vc_bb.ID_dia_bb_vc, bloque_vc_bb.ID_bloque_bb_vc, profesor_vc_bb.id_profesor]
                );
              }
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
      res_vc_bb.status(500).json({ message: "Error al subir disponibilidades", error: err_vc_bb.message });
    }
  }
}

export const excelController_vc_bb = new ExcelController_vc_bb();
export default excelController_vc_bb;
