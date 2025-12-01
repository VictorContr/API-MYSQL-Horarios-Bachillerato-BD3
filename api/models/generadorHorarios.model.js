import { query_vc_bb, getOne_vc_bb, execute_vc_bb } from "../db.js";

export class GeneradorHorariosModel_vc_bb {
  constructor() {
    this.asignaturas_vc_bb = [];
    this.profesores_vc_bb = [];
    this.espacios_vc_bb = [];
    this.disponibilidadProf_vc_bb = [];
    this.disponibilidadEsp_vc_bb = [];
    this.gradosAsignaturas_vc_bb = [];
    this.secciones_vc_bb = [];
    this.clases_vc_bb = [];
    this.tiposEspacio_vc_bb = [];
    this._tipoEspacioPorId_vc_bb = new Map();
    this.ocupacionProf_vc_bb = {};
    this.ocupacionEsp_vc_bb = {};
    this.ocupacionGrupo_vc_bb = {};
    this.solucion_vc_bb = [];
    this.dominios_vc_bb = {};
    this.mejorSolucion_vc_bb = [];
    this.mejorCosto_vc_bb = Infinity;
    this._dispRealIndex_vc_bb = new Set();
    this._globalStartTime_vc_bb = null;
    this.timeLimitMs_vc_bb = 180000;
  }

  _pickField(obj, candidates) {
    for (const c of candidates) {
      if (Object.prototype.hasOwnProperty.call(obj, c)) return obj[c];
    }
    return undefined;
  }

  async cargarDatos_vc_bb() {
    const asignaturas = await query_vc_bb("SELECT * FROM td_Asignaturas_bb_vc");
    const profesores = await query_vc_bb("SELECT * FROM td_ProfesorAsignaturas_bb_vc");
    const espacios = await query_vc_bb("SELECT * FROM td_Espacios_bb_vc");
    const disponibilidadProf = await query_vc_bb("SELECT * FROM td_DisponibilidadProfesor_bb_vc");
    const disponibilidadEsp = await query_vc_bb("SELECT * FROM vista_DisponibilidadRealEspacio_bb_vc");
    const gradosAsignaturas = await query_vc_bb("SELECT * FROM td_GradosAsignaturas_bb_vc");
    const secciones = await query_vc_bb("SELECT * FROM td_Secciones_bb_vc");
    const clases = await query_vc_bb("SELECT * FROM td_Clases_bb_vc");

    this.asignaturas_vc_bb = asignaturas;
    this.profesores_vc_bb = profesores;
    this.espacios_vc_bb = espacios;
    this.disponibilidadProf_vc_bb = disponibilidadProf;
    this.disponibilidadEsp_vc_bb = disponibilidadEsp;
    this.gradosAsignaturas_vc_bb = gradosAsignaturas;
    this.secciones_vc_bb = secciones;
    this.clases_vc_bb = clases;

    const tiposEspacio = await query_vc_bb("SELECT * FROM td_TipoEspacio_bb_vc");
    this.tiposEspacio_vc_bb = tiposEspacio;
    this._tipoEspacioPorId_vc_bb = new Map(this.tiposEspacio_vc_bb.map(t => [t.ID_TipoEspacio_bb_vc, t.tipo_bb_vc]));

    this._dispRealIndex_vc_bb = new Set();
    for (const row of this.disponibilidadEsp_vc_bb) {
      const dia = this._pickField(row, ["ID_dia", "ID_dia_OcupEspacio_bb_vc", "ID_dia_DisponEspacio_bb_vc", "ID_dia_DisponibilidadEspacio_bb_vc"]);
      const bloque = this._pickField(row, ["ID_bloque", "ID_bloque_OcupEspacio_bb_vc", "ID_bloque_DisponEspacio_bb_vc", "ID_bloque_DisponibilidadEspacio_bb_vc"]);
      const espacio = this._pickField(row, ["ID_espacio", "ID_espacio_OcupEspacio_bb_vc", "ID_espacio_bb_vc", "ID_espacio_DisponEspacio_bb_vc"]);
      if (typeof dia !== "undefined" && typeof bloque !== "undefined" && typeof espacio !== "undefined") {
        const key = `${dia}|${bloque}|${espacio}`;
        this._dispRealIndex_vc_bb.add(key);
      }
    }
  }

  async validarDisponibilidades_vc_bb() {
    const countProf = await getOne_vc_bb("SELECT COUNT(*) AS total FROM td_DisponibilidadProfesor_bb_vc");
    const countDias = await getOne_vc_bb("SELECT COUNT(*) AS total FROM td_Dia_bb_vc");
    const countBloques = await getOne_vc_bb("SELECT COUNT(*) AS total FROM td_Bloque_bb_vc");
    const countEspacios = await getOne_vc_bb("SELECT COUNT(*) AS total FROM td_Espacios_bb_vc");
    if (!countProf || countProf.total === 0) throw new Error("No hay disponibilidad de profesores registrada.");
    if (!countDias || !countBloques || !countEspacios || countDias.total === 0 || countBloques.total === 0 || countEspacios.total === 0) throw new Error("Faltan días, bloques o espacios para calcular la disponibilidad real.");
  }

  construirDominios_vc_bb() {
    this.asignaturasExpand_vc_bb = [];
    for (const asig of this.asignaturas_vc_bb) {
      const profIdoneos = this.getProfesoresIdoneos_vc_bb(asig.ID_asignatura_bb_vc);
      this.dominios_vc_bb[asig.ID_asignatura_bb_vc] = [];
      for (const prof of profIdoneos) {
        const slots = this.getSlotsDisponibles_vc_bb(prof, asig.ID_TipoEspacio_requerido_bb_vc, asig.ID_asignatura_bb_vc);
        slots.sort((a, b) => {
          const cargaA = (this.ocupacionProf_vc_bb[a.profesor]?.[a.dia]?.size || 0) + (this.ocupacionEsp_vc_bb[a.espacio]?.[a.dia]?.size || 0);
          const cargaB = (this.ocupacionProf_vc_bb[b.profesor]?.[b.dia]?.size || 0) + (this.ocupacionEsp_vc_bb[b.espacio]?.[b.dia]?.size || 0);
          return cargaA - cargaB;
        });
        this.dominios_vc_bb[asig.ID_asignatura_bb_vc].push(...slots);
      }
      const repeticiones = Math.max(1, asig.horas_academicas_bb_vc || 1);
      for (let i = 0; i < repeticiones; i++) this.asignaturasExpand_vc_bb.push(asig);
    }
    this.asignaturasExpand_vc_bb.sort((a, b) => {
      const domA = this.dominios_vc_bb[a.ID_asignatura_bb_vc]?.length || 0;
      const domB = this.dominios_vc_bb[b.ID_asignatura_bb_vc]?.length || 0;
      return domA - domB;
    });
  }

  getProfesoresIdoneos_vc_bb(idAsignatura) {
    return this.profesores_vc_bb.filter(p => p.ID_asignatura_profAsig_bb_vc === idAsignatura).map(p => p.ID_profesor_profAsig_bb_vc);
  }

  getSlotsDisponibles_vc_bb(profesorId, tipoEspacio, asignaturaId) {
    const candidatos = [];
    const seen = new Set();
    const dispProfIndex = new Map();
    for (const dp of this.disponibilidadProf_vc_bb) {
      if (dp.ID_profesor_DispProfesor_bb_vc === profesorId) dispProfIndex.set(`${dp.ID_dia_DispProfesor_bb_vc}|${dp.ID_bloque_DispProfesor_bb_vc}`, dp);
    }
    if (dispProfIndex.size === 0) return candidatos;
    const espaciosCompatibles = tipoEspacio ? this.espacios_vc_bb.filter(e => e.ID_TipoEspacio_espacio_bb_vc === tipoEspacio) : this.espacios_vc_bb;
    if (espaciosCompatibles.length === 0) return candidatos;
    const asignaturaObj = this.asignaturas_vc_bb.find(a => a.ID_asignatura_bb_vc === asignaturaId);
    const gradosAsignatura = this.gradosAsignaturas_vc_bb.filter(ga => ga.ID_asignatura_gradoAsig_bb_vc === asignaturaId);
    if (gradosAsignatura.length === 0) return candidatos;
    const seccionesPorGrado = {};
    for (const grado of gradosAsignatura) {
      const claseRows = this.clases_vc_bb.filter(c => c.ID_grado_clase_bb_vc === grado.ID_grado_gradoAsig_bb_vc);
      seccionesPorGrado[grado.ID_grado_gradoAsig_bb_vc] = claseRows.map(c => this.secciones_vc_bb.find(s => s.ID_seccion_bb_vc === c.ID_seccion_clase_bb_vc)).filter(Boolean);
    }
    for (const [diaBloque] of dispProfIndex.entries()) {
      const [dia, bloque] = diaBloque.split("|");
      for (const espacio of espaciosCompatibles) {
        if (!this._esEspacioCompatibleConAsignatura_vc_bb(espacio, asignaturaObj)) continue;
        const keyEsp = `${dia}|${bloque}|${espacio.ID_espacio_bb_vc}`;
        if (!this._dispRealIndex_vc_bb.has(keyEsp)) continue;
        for (const grado of gradosAsignatura) {
          const seccionesGrado = seccionesPorGrado[grado.ID_grado_gradoAsig_bb_vc];
          if (!seccionesGrado || seccionesGrado.length === 0) continue;
          for (const seccion of seccionesGrado) {
            const slot = {
              dia: parseInt(dia),
              bloque: parseInt(bloque),
              profesor: profesorId,
              espacio: espacio.ID_espacio_bb_vc,
              asignatura: asignaturaId,
              grado: grado.ID_grado_gradoAsig_bb_vc,
              seccion: seccion.ID_seccion_bb_vc
            };
            const k = `${slot.dia}|${slot.bloque}|${slot.espacio}|${slot.profesor}|${slot.grado}|${slot.seccion}`;
            if (!seen.has(k)) { seen.add(k); candidatos.push(slot); }
          }
        }
      }
    }
    return candidatos;
  }

  _esEspacioCompatibleConAsignatura_vc_bb(espacio, asignatura) {
    if (!espacio || !asignatura) return false;
    const tipoEspId = espacio.ID_TipoEspacio_espacio_bb_vc;
    const tipoNombre = (this._tipoEspacioPorId_vc_bb.get(tipoEspId) || "").toLowerCase();
    const requerido = asignatura.ID_TipoEspacio_requerido_bb_vc;
    const nombreAsig = (asignatura.nombre_bb_vc || "").toLowerCase();
    if (requerido) { if (tipoEspId !== requerido) return false; }
    if (nombreAsig.includes("quim")) { if (tipoNombre.includes("cancha") || tipoNombre.includes("gimnasio")) return false; }
    if (nombreAsig.includes("preemilitar") || nombreAsig.includes("educación física") || nombreAsig.includes("educacion fisica") || nombreAsig.includes("fisica")) { if (tipoNombre.includes("laboratorio")) return false; }
    return true;
  }

  buscarHorario_vc_bb() {
    this.ocupacionProf_vc_bb = {};
    this.ocupacionEsp_vc_bb = {};
    this.ocupacionGrupo_vc_bb = {};
    this.solucion_vc_bb = [];
    this.mejorSolucion_vc_bb = [];
    this.mejorCosto_vc_bb = Infinity;
    const listaTrabajo = this.asignaturasExpand_vc_bb.length ? this.asignaturasExpand_vc_bb : this.asignaturas_vc_bb;
    listaTrabajo.sort((a, b) => {
      const domA = this.dominios_vc_bb[a.ID_asignatura_bb_vc]?.length || 0;
      const domB = this.dominios_vc_bb[b.ID_asignatura_bb_vc]?.length || 0;
      if (domA === domB) return (b.horas_academicas_bb_vc || 1) - (a.horas_academicas_bb_vc || 1);
      return domA - domB;
    });
    this._listaTrabajo_vc_bb = listaTrabajo;
    this._globalStartTime_vc_bb = Date.now();
    this.buscarSoluciones_vc_bb(0);
    this.solucion_vc_bb = this.mejorSolucion_vc_bb;
    return this.mejorSolucion_vc_bb.length > 0;
  }

  buscarSoluciones_vc_bb(idx) {
    if (this._globalStartTime_vc_bb && Date.now() - this._globalStartTime_vc_bb > this.timeLimitMs_vc_bb) return;
    const listaTrabajo = this._listaTrabajo_vc_bb || this.asignaturas_vc_bb;
    if (idx >= listaTrabajo.length) {
      const costo = this.calcularCosto_vc_bb(this.solucion_vc_bb);
      if (costo < this.mejorCosto_vc_bb) { this.mejorCosto_vc_bb = costo; this.mejorSolucion_vc_bb = [...this.solucion_vc_bb]; }
      return;
    }
    const asig = listaTrabajo[idx];
    let candidatos = this.dominios_vc_bb[asig.ID_asignatura_bb_vc] || [];
    if (candidatos.length === 0) { this.buscarSoluciones_vc_bb(idx + 1); return; }
    candidatos.sort((a, b) => {
      const cargaA = (this.ocupacionProf_vc_bb[a.profesor]?.[a.dia]?.size || 0) + (this.ocupacionEsp_vc_bb[a.espacio]?.[a.dia]?.size || 0);
      const cargaB = (this.ocupacionProf_vc_bb[b.profesor]?.[b.dia]?.size || 0) + (this.ocupacionEsp_vc_bb[b.espacio]?.[b.dia]?.size || 0);
      const diasUsadosA = new Set(this.solucion_vc_bb.filter(s => s.asignatura === a.asignatura && s.grado === a.grado && s.seccion === a.seccion).map(s => s.dia));
      const diasUsadosB = new Set(this.solucion_vc_bb.filter(s => s.asignatura === b.asignatura && s.grado === b.grado && s.seccion === b.seccion).map(s => s.dia));
      const prefA = diasUsadosA.has(a.dia) ? 1 : 0;
      const prefB = diasUsadosB.has(b.dia) ? 1 : 0;
      if (cargaA !== cargaB) return cargaA - cargaB;
      return prefA - prefB;
    });
    for (const slot of candidatos) {
      if (this._globalStartTime_vc_bb && Date.now() - this._globalStartTime_vc_bb > this.timeLimitMs_vc_bb) return;
      if (this.esFactible_vc_bb(slot)) {
        this.solucion_vc_bb.push(slot);
        this._marcarOcupacion_vc_bb(slot);
        const costoParcial = this.calcularCostoParcial_vc_bb(this.solucion_vc_bb);
        if (costoParcial < this.mejorCosto_vc_bb) this.buscarSoluciones_vc_bb(idx + 1);
        this._desmarcarOcupacion_vc_bb(slot);
        this.solucion_vc_bb.pop();
      }
    }
  }

  esFactible_vc_bb(slot) {
    const { profesor, dia, bloque, espacio, grado, seccion } = slot;
    if (this.ocupacionProf_vc_bb[profesor]?.[dia]?.has(bloque)) return false;
    if (this.ocupacionEsp_vc_bb[espacio]?.[dia]?.has(bloque)) return false;
    if (this.ocupacionGrupo_vc_bb[grado]?.[seccion]?.[dia]?.has(bloque)) return false;
    return true;
  }

  _marcarOcupacion_vc_bb(slot) {
    const { profesor, dia, bloque, espacio, grado, seccion } = slot;
    if (!this.ocupacionProf_vc_bb[profesor]) this.ocupacionProf_vc_bb[profesor] = {};
    if (!this.ocupacionProf_vc_bb[profesor][dia]) this.ocupacionProf_vc_bb[profesor][dia] = new Set();
    this.ocupacionProf_vc_bb[profesor][dia].add(bloque);
    if (!this.ocupacionEsp_vc_bb[espacio]) this.ocupacionEsp_vc_bb[espacio] = {};
    if (!this.ocupacionEsp_vc_bb[espacio][dia]) this.ocupacionEsp_vc_bb[espacio][dia] = new Set();
    this.ocupacionEsp_vc_bb[espacio][dia].add(bloque);
    if (!this.ocupacionGrupo_vc_bb[grado]) this.ocupacionGrupo_vc_bb[grado] = {};
    if (!this.ocupacionGrupo_vc_bb[grado][seccion]) this.ocupacionGrupo_vc_bb[grado][seccion] = {};
    if (!this.ocupacionGrupo_vc_bb[grado][seccion][dia]) this.ocupacionGrupo_vc_bb[grado][seccion][dia] = new Set();
    this.ocupacionGrupo_vc_bb[grado][seccion][dia].add(bloque);
    const key = `${dia}|${bloque}|${espacio}`;
    this._dispRealIndex_vc_bb.delete(key);
  }

  _desmarcarOcupacion_vc_bb(slot) {
    const { profesor, dia, bloque, espacio, grado, seccion } = slot;
    this.ocupacionProf_vc_bb[profesor]?.[dia]?.delete(bloque);
    this.ocupacionEsp_vc_bb[espacio]?.[dia]?.delete(bloque);
    this.ocupacionGrupo_vc_bb[grado]?.[seccion]?.[dia]?.delete(bloque);
    const key = `${dia}|${bloque}|${espacio}`;
    this._dispRealIndex_vc_bb.add(key);
  }

  calcularCosto_vc_bb(solucion) {
    let costo = 0;
    const horasPorProfesor = {};
    for (const s of solucion) {
      if (!horasPorProfesor[s.profesor]) horasPorProfesor[s.profesor] = {};
      if (!horasPorProfesor[s.profesor][s.dia]) horasPorProfesor[s.profesor][s.dia] = [];
      horasPorProfesor[s.profesor][s.dia].push(s.bloque);
    }
    for (const prof in horasPorProfesor) {
      for (const dia in horasPorProfesor[prof]) {
        const horas = horasPorProfesor[prof][dia].sort((a, b) => a - b);
        let consecutivas = 1;
        for (let i = 1; i < horas.length; i++) {
          if (horas[i] === horas[i - 1] + 1) { consecutivas++; if (consecutivas > 3) costo += 2; }
          else { consecutivas = 1; }
          if (horas[i] - horas[i - 1] > 2) costo += 1;
        }
      }
    }
    const diasPorAsignatura = {};
    for (const s of solucion) { if (!diasPorAsignatura[s.asignatura]) diasPorAsignatura[s.asignatura] = new Set(); diasPorAsignatura[s.asignatura].add(s.dia); }
    for (const asig in diasPorAsignatura) { const dias = diasPorAsignatura[asig].size; if (dias > 3) costo += (dias - 3) * 2; }
    const cargaDiaProfesor = {}; const cargaDiaEspacio = {}; const cargaDiaGrupo = {}; const diasPorAsigGrupo = {};
    for (const s of solucion) {
      const kp = `${s.profesor}|${s.dia}`; const ke = `${s.espacio}|${s.dia}`; const kg = `${s.grado}|${s.seccion}|${s.dia}`; const kag = `${s.asignatura}|${s.grado}|${s.seccion}`;
      cargaDiaProfesor[kp] = (cargaDiaProfesor[kp] || 0) + 1;
      cargaDiaEspacio[ke] = (cargaDiaEspacio[ke] || 0) + 1;
      cargaDiaGrupo[kg] = (cargaDiaGrupo[kg] || 0) + 1;
      if (!diasPorAsigGrupo[kag]) diasPorAsigGrupo[kag] = new Set();
      diasPorAsigGrupo[kag].add(s.dia);
    }
    for (const k in cargaDiaProfesor) costo += Math.max(0, cargaDiaProfesor[k] - 3);
    for (const k in cargaDiaEspacio) costo += Math.max(0, cargaDiaEspacio[k] - 3);
    for (const k in cargaDiaGrupo) costo += Math.max(0, cargaDiaGrupo[k] - 4);
    for (const kag in diasPorAsigGrupo) { const dias = diasPorAsigGrupo[kag].size; if (dias === 1) costo += 50; }
    return costo;
  }

  calcularCostoParcial_vc_bb(solucion) {
    let costo = 0;
    const horasPorProfesor = {};
    for (const s of solucion) {
      if (!horasPorProfesor[s.profesor]) horasPorProfesor[s.profesor] = {};
      if (!horasPorProfesor[s.profesor][s.dia]) horasPorProfesor[s.profesor][s.dia] = [];
      horasPorProfesor[s.profesor][s.dia].push(s.bloque);
    }
    for (const prof in horasPorProfesor) {
      for (const dia in horasPorProfesor[prof]) {
        const horas = horasPorProfesor[prof][dia].sort((a, b) => a - b);
        let consecutivas = 1;
        for (let i = 1; i < horas.length; i++) {
          if (horas[i] === horas[i - 1] + 1) { consecutivas++; if (consecutivas > 3) costo += 2; }
          else { consecutivas = 1; }
          if (horas[i] - horas[i - 1] > 2) costo += 1;
        }
      }
    }
    const cargaDiaProfesor = {}; const cargaDiaEspacio = {}; const cargaDiaGrupo = {}; const diasPorAsigGrupo = {};
    for (const s of solucion) {
      const kp = `${s.profesor}|${s.dia}`; const ke = `${s.espacio}|${s.dia}`; const kg = `${s.grado}|${s.seccion}|${s.dia}`; const kag = `${s.asignatura}|${s.grado}|${s.seccion}`;
      cargaDiaProfesor[kp] = (cargaDiaProfesor[kp] || 0) + 1;
      cargaDiaEspacio[ke] = (cargaDiaEspacio[ke] || 0) + 1;
      cargaDiaGrupo[kg] = (cargaDiaGrupo[kg] || 0) + 1;
      if (!diasPorAsigGrupo[kag]) diasPorAsigGrupo[kag] = new Set();
      diasPorAsigGrupo[kag].add(s.dia);
    }
    for (const k in cargaDiaProfesor) costo += Math.max(0, cargaDiaProfesor[k] - 3);
    for (const k in cargaDiaEspacio) costo += Math.max(0, cargaDiaEspacio[k] - 3);
    for (const k in cargaDiaGrupo) costo += Math.max(0, cargaDiaGrupo[k] - 4);
    for (const kag in diasPorAsigGrupo) { const dias = diasPorAsigGrupo[kag].size; if (dias === 1 && (Object.values(cargaDiaGrupo).some(v => v > 1))) costo += 10; }
    return costo;
  }

  async guardarEnBaseDeDatos_vc_bb() {
    await execute_vc_bb("DELETE FROM td_Horario_bb_vc");
    const sql = "INSERT INTO td_Horario_bb_vc (ID_asignatura_horario_bb_vc, ID_profesor_horario_bb_vc, ID_espacio_horario_bb_vc, ID_grado_horario_bb_vc, ID_seccion_horario_bb_vc, ID_dia_horario_bb_vc, ID_bloque_horario_bb_vc) VALUES (?,?,?,?,?,?,?)";
    for (const s of this.solucion_vc_bb) {
      await execute_vc_bb(sql, [s.asignatura, s.profesor, s.espacio, s.grado, s.seccion, s.dia, s.bloque]);
    }
  }

  exportarSolucion_vc_bb() {
    return this.solucion_vc_bb.map(s => ({ asignatura: s.asignatura, profesor: s.profesor, espacio: s.espacio, grado: s.grado, seccion: s.seccion, dia: s.dia, bloque: s.bloque }));
  }

  async generar_vc_bb() {
    const count = await getOne_vc_bb("SELECT COUNT(*) AS total FROM td_Horario_bb_vc");
    if (count && count.total > 0) return this.obtenerHorariosLegiblesAdmin_vc_bb();
    await this.cargarDatos_vc_bb();
    await this.validarDisponibilidades_vc_bb();
    this.construirDominios_vc_bb();
    const exito = this.buscarHorario_vc_bb();
    if (!exito) throw new Error("No se pudo generar un horario válido.");
    await this.guardarEnBaseDeDatos_vc_bb();
    return this.obtenerHorariosLegiblesAdmin_vc_bb();
  }

  async obtenerHorariosPorProfesor_vc_bb(idProfesor) {
    const rows = await query_vc_bb("SELECT * FROM vista_horarios_profesor_bb_vc WHERE ID_profesor = ?", [idProfesor]);
    return rows;
  }

  async obtenerProfesorPorUsuario_vc_bb(idUsuario) {
    const row = await getOne_vc_bb(
      "SELECT p.ID_profesor_bb_vc AS ID_profesor FROM td_Profesores_bb_vc p JOIN td_UsuarioRol_bb_vc ur ON p.ID_usuarioRol_profesor_bb_vc = ur.ID_usuarioRol_bb_vc WHERE ur.ID_usuario_usuarioRol_bb_vc = ?",
      [idUsuario]
    );
    return row || null;
  }

  async obtenerHorariosLegiblesAdmin_vc_bb() {
    const rows = await query_vc_bb("SELECT * FROM vista_horarios_admin_bb_vc");
    return rows;
  }

  async generarLegibleAdmin_vc_bb() {
    await this.generar_vc_bb();
    return this.obtenerHorariosLegiblesAdmin_vc_bb();
  }
}

export default GeneradorHorariosModel_vc_bb;
