	// -------------------------
// Persistencia localStorage
// -------------------------
const LS_KEY = "sgpt_armada_v1";
const LS_KEY_PUESTOS = "sgpt_armada_puestos_filters_v1";

// Datos iniciales (para reset o primera carga)
const SEED = {
  dbImpacto: [
    { id: "1", nombre: "1. Actuación con Valores" },
    { id: "2", nombre: "2. Liderazgo y Mando" },
    { id: "3", nombre: "3. Capacidades y Análisis de Gestión" },
    { id: "4", nombre: "4. Capacidades Técnicas" }
  ],
  dbComp: {
    "1": ["Integridad", "Compromiso"],
    "2": ["Liderazgo", "Decisión"],
    "3": ["Estrategia"],
    "4": ["Saber Experto", "Técnico Especialista"]
  },
  dbExp: {
    "Saber Experto": [
      "Aprovisionamiento (CINA)",
      "Ciber (CGA y CIM)",
      "Sostenimiento (CGA, CIM y CIA)"
    ]
  },
  dbHab: {
    "Aprovisionamiento (CINA)": [
      { n: "Dominio de herramientas ofimáticas", d: "PowerPoint y Excel eficiente" }
    ]
  }
};

// Estado (se carga desde LS o SEED)
let dbImpacto = [];
let dbComp = {};
let dbExp = {};
let dbHab = {};

let modActual = "";         // 'ALTA' | 'MOD'
let tipoBorradoActual = ""; // 'Impacto' | 'Comp' | 'Exp' | 'Hab'

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function cargarDeLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.dbImpacto || !parsed.dbComp || !parsed.dbExp || !parsed.dbHab) return false;

    dbImpacto = parsed.dbImpacto;
    dbComp = parsed.dbComp;
    dbExp = parsed.dbExp;
    dbHab = parsed.dbHab;
    return true;
  } catch {
    return false;
  }
}

function guardarEnLocalStorage() {
  const payload = { dbImpacto, dbComp, dbExp, dbHab, savedAt: new Date().toISOString() };
  localStorage.setItem(LS_KEY, JSON.stringify(payload));
}

function cargarSeed() {
  const seed = deepClone(SEED);
  dbImpacto = seed.dbImpacto;
  dbComp = seed.dbComp;
  dbExp = seed.dbExp;
  dbHab = seed.dbHab;
  guardarEnLocalStorage();
}

function resetearDatos() {
  if (!confirm("Se borrarán los datos guardados y se restaurarán los valores iniciales. ¿Continuar?")) return;
  localStorage.removeItem(LS_KEY);
  cargarSeed();
  refrescarTodosLosSelects();
  showSection('impacto');
  alert("Datos restaurados.");
}

function exportarDatos() {
  const payload = { dbImpacto, dbComp, dbExp, dbHab, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sgpt_armada_datos.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// -------------------------
// INIT + REFRESH
// -------------------------
function init() {
  renderUsuarioHeader();
  wireModalUX();

  const ok = cargarDeLocalStorage();
  if (!ok) cargarSeed();

  refrescarTodosLosSelects();
//  showSection('impacto');
}

function wireModalUX() {
  const modal = document.getElementById('modalBorrado');
  modal.addEventListener('click', (e) => {
    if (e.target.id === 'modalBorrado') cerrarModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModal();
  });
}

function refrescarTodosLosSelects() {
  const ids = ['selImpacto', 'selImpactoPadre', 'selImpactoExp', 'hArea'];
  ids.forEach(id => {
    const s = document.getElementById(id);
    if (!s) return;
    const currentVal = s.value;
    s.innerHTML = '<option value="">-- Seleccionar --</option>';
    dbImpacto.forEach(a => s.add(new Option(a.nombre, a.id)));
    s.value = currentVal;
    if (s.value !== currentVal) s.value = "";
  });

  cargarCompetencias();
  cargarCompParaExp();
  hCargarComp();

  toggleBtns('Impacto');
}

//function showSection(s) {
//  document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
//  document.querySelectorAll('.submenu-item').forEach(m => m.classList.remove('active'));
//
//  const sectionId = 'section' + s.charAt(0).toUpperCase() + s.slice(1);
//  const menuId = 'menu' + s.charAt(0).toUpperCase() + s.slice(1);
//
//  document.getElementById(sectionId).classList.remove('hidden');
//  document.getElementById(menuId).classList.add('active');
//
//  if (s === 'habilidades') hSeleccionar();
//
//  if (s === 'puestos' && typeof puestosInit === 'function') puestosInit();
//}

function showSection(sectionId) {
    // 1. Ocultamos absolutamente todo lo que sea sección
    document.querySelectorAll('.card, .card-full').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('active');
        s.style.display = 'none';
    });

    const idFormateado = 'section' + sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    const target = document.getElementById(idFormateado);
    
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');

        // 2. Lógica condicional según el tipo de sección
        if (target.classList.contains('card-full')) {
            // Si es para un iframe, usamos flex para maximizar
            target.style.display = 'flex'; 
        } else {
            // Si es una .card normal (formulario), usamos block para no descolocar el diseño
            target.style.display = 'block';
        }
    }
}
// -------------------------
// HABILITAR BOTONES
// -------------------------
function toggleBtns(tipo) {
  const sel = document.getElementById('sel' + tipo);
  const val = sel ? sel.value : "";
  const editBtn = document.getElementById('btnEdit' + tipo);
  const delBtn  = document.getElementById('btnDel' + tipo);
  if (editBtn) editBtn.disabled = !val;
  if (delBtn) delBtn.disabled = !val;
}

// -------------------------
// SUBMENUS
// -------------------------

function toggleSubmenu(id) {
    const sub = document.getElementById(id);
    if (sub.style.display === "none") {
        sub.style.display = "block";
    } else {
        sub.style.display = "none";
    }
}

// -------------------------
// EDITOR
// -------------------------
function abrirEditor(tipo, modo) {
  modActual = modo;

  document.getElementById('view' + tipo).classList.add('hidden');
  document.getElementById('edit' + tipo).classList.remove('hidden');

  if (modo === 'MOD') {
    if (tipo === 'Hab') {
      const exp = document.getElementById('hExp').value;
      const idx = document.getElementById('selHab').value;
      if (exp && idx !== "" && dbHab[exp] && dbHab[exp][idx]) {
        const h = dbHab[exp][idx];
        document.getElementById('inHabNombre').value = h.n || "";
        document.getElementById('inHabDesc').value   = h.d || "";
      }
    } else {
      const s = document.getElementById('sel' + tipo);
      const inId = 'in' + tipo;
      if (s && document.getElementById(inId)) {
        document.getElementById(inId).value = s.options[s.selectedIndex]?.text || "";
      }
    }
  } else {
    if (tipo === 'Hab') {
      document.getElementById('inHabNombre').value = "";
      document.getElementById('inHabDesc').value = "";
    } else {
      const inId = 'in' + tipo;
      if (document.getElementById(inId)) document.getElementById(inId).value = "";
    }
  }
}

function cerrarEditor(tipo) {
  document.getElementById('view' + tipo).classList.remove('hidden');
  document.getElementById('edit' + tipo).classList.add('hidden');
}

// -------------------------
// CARGAS CASCADA
// -------------------------
function cargarCompetencias() {
  const id = document.getElementById('selImpactoPadre').value;
  const s = document.getElementById('selComp');

  s.innerHTML = '<option value="">-- Competencia --</option>';
  document.getElementById('btnAddComp').disabled = !id;

  if (id && dbComp[id]) dbComp[id].forEach(c => s.add(new Option(c, c)));

  s.disabled = !id;
  s.value = "";
  toggleBtns('Comp');
}

function cargarCompParaExp() {
  const id = document.getElementById('selImpactoExp').value;
  const s = document.getElementById('selCompExp');

  s.innerHTML = '<option value="">-- Competencia --</option>';
  if (id && dbComp[id]) dbComp[id].forEach(c => s.add(new Option(c, c)));

  s.disabled = !id;
  s.value = "";
  cargarExperiencias();
}

function cargarExperiencias() {
  const c = document.getElementById('selCompExp').value;
  const s = document.getElementById('selExp');

  s.innerHTML = '<option value="">-- Experiencia --</option>';
  document.getElementById('btnAddExp').disabled = !c;

  if (c && dbExp[c]) dbExp[c].forEach(e => s.add(new Option(e, e)));

  s.disabled = !c;
  s.value = "";
  toggleBtns('Exp');
}

function hCargarComp() {
  const a = document.getElementById('hArea').value;
  const s = document.getElementById('hComp');

  s.innerHTML = '<option value="">-- Competencia --</option>';
  if (a && dbComp[a]) dbComp[a].forEach(c => s.add(new Option(c, c)));

  s.disabled = !a;
  s.value = "";
  hCargarExp();
}

function hCargarExp() {
  const c = document.getElementById('hComp').value;
  const s = document.getElementById('hExp');

  s.innerHTML = '<option value="">-- Experiencia --</option>';
  if (c && dbExp[c]) dbExp[c].forEach(e => s.add(new Option(e, e)));

  s.disabled = !c;
  s.value = "";
  hCargarHab();
}

function hCargarHab() {
  const e = document.getElementById('hExp').value;
  const s = document.getElementById('selHab');

  s.innerHTML = '<option value="">-- Habilidad --</option>';
  document.getElementById('btnAddHab').disabled = !e;

  if (e && dbHab[e]) dbHab[e].forEach((h, idx) => s.add(new Option(h.n, idx)));

  s.disabled = !e;
  s.value = "";
  hSeleccionar();
}

function hSeleccionar() {
  const e = document.getElementById('hExp').value;
  const idx = document.getElementById('selHab').value;

  const desc = document.getElementById('hDescView');
  if (idx !== "" && e && dbHab[e] && dbHab[e][idx]) desc.value = dbHab[e][idx].d || "";
  else desc.value = "";

  toggleBtns('Hab');
}

// -------------------------
// GUARDAR
// -------------------------
function guardar(tipo) {
  if (tipo === 'Impacto') return guardarImpacto();
  if (tipo === 'Comp')    return guardarComp();
  if (tipo === 'Exp')     return guardarExp();
  if (tipo === 'Hab')     return guardarHab();
}

function guardarImpacto() {
  const val = (document.getElementById('inImpacto').value || "").trim();
  if (!val) return;

  if (modActual === 'ALTA') {
    dbImpacto.push({ id: Date.now().toString(), nombre: val });
  } else {
    const idSel = document.getElementById('selImpacto').value;
    const item = dbImpacto.find(a => a.id === idSel);
    if (item) item.nombre = val;
  }

  guardarEnLocalStorage();
  refrescarTodosLosSelects();
  cerrarEditor('Impacto');
}

function guardarComp() {
  const areaId = document.getElementById('selImpactoPadre').value;
  const val = (document.getElementById('inComp').value || "").trim();
  if (!areaId || !val) return;

  if (!dbComp[areaId]) dbComp[areaId] = [];

  if (modActual === 'ALTA') {
    dbComp[areaId].push(val);
  } else {
    const oldVal = document.getElementById('selComp').value;
    const idx = dbComp[areaId].indexOf(oldVal);
    if (idx !== -1) {
      dbComp[areaId][idx] = val;
      // mover experiencias colgadas de competencia
      if (dbExp[oldVal]) {
        dbExp[val] = dbExp[oldVal];
        delete dbExp[oldVal];
      }
    }
  }

  guardarEnLocalStorage();
  cargarCompetencias();
  cargarCompParaExp();
  hCargarComp();
  cerrarEditor('Comp');
}

function guardarExp() {
  const comp = document.getElementById('selCompExp').value;
  const val = (document.getElementById('inExp').value || "").trim();
  if (!comp || !val) return;

  if (!dbExp[comp]) dbExp[comp] = [];

  if (modActual === 'ALTA') {
    dbExp[comp].push(val);
  } else {
    const oldVal = document.getElementById('selExp').value;
    const idx = dbExp[comp].indexOf(oldVal);
    if (idx !== -1) {
      dbExp[comp][idx] = val;
      // mover habilidades colgadas de experiencia
      if (dbHab[oldVal]) {
        dbHab[val] = dbHab[oldVal];
        delete dbHab[oldVal];
      }
    }
  }

  guardarEnLocalStorage();
  cargarExperiencias();
  hCargarComp();
  cerrarEditor('Exp');
}

function guardarHab() {
  const exp = document.getElementById('hExp').value;
  const n = (document.getElementById('inHabNombre').value || "").trim();
  const d = (document.getElementById('inHabDesc').value || "").trim();
  if (!exp || !n) return;

  if (!dbHab[exp]) dbHab[exp] = [];

  if (modActual === 'ALTA') {
    dbHab[exp].push({ n, d });
  } else {
    const idx = document.getElementById('selHab').value;
    if (idx !== "" && dbHab[exp] && dbHab[exp][idx]) dbHab[exp][idx] = { n, d };
  }

  guardarEnLocalStorage();
  hCargarHab();
  cerrarEditor('Hab');
}

// -------------------------
// BORRADO
// -------------------------
function confirmarBorrado(tipo) {
  tipoBorradoActual = tipo;
  const modalBody = document.getElementById('msgBorrado');
  const itemTxt = getTextoSeleccion(tipo);

  modalBody.innerHTML = `
    ¿Está seguro de eliminar el registro seleccionado de <b>${tipo}</b>?
    <br><br>
    <b>Registro:</b> ${itemTxt || "(sin selección)"}
    <br><br>
    Esta acción es permanente.
  `;

  document.getElementById('btnConfirmaBorrar').onclick = () => ejecutarBaja(tipo);
  document.getElementById('modalBorrado').classList.add('active');
}

function getTextoSeleccion(tipo) {
  if (tipo === 'Impacto') {
    const s = document.getElementById('selImpacto');
    return s.value ? s.options[s.selectedIndex].text : "";
  }
  if (tipo === 'Comp') return document.getElementById('selComp').value || "";
  if (tipo === 'Exp')  return document.getElementById('selExp').value || "";
  if (tipo === 'Hab') {
    const s = document.getElementById('selHab');
    return s.value !== "" ? s.options[s.selectedIndex].text : "";
  }
  return "";
}

function cerrarModal() {
  document.getElementById('modalBorrado').classList.remove('active');
}

function ejecutarBaja(tipo) {
  if (tipo === 'Impacto') return borrarImpacto();
  if (tipo === 'Comp')    return borrarComp();
  if (tipo === 'Exp')     return borrarExp();
  if (tipo === 'Hab')     return borrarHab();
}

function borrarImpacto() {
  const id = document.getElementById('selImpacto').value;
  if (!id) return cerrarModal();

  const comps = (dbComp[id] || []).slice();

  dbImpacto = dbImpacto.filter(x => x.id !== id);

  delete dbComp[id];
  comps.forEach(c => {
    const exps = (dbExp[c] || []).slice();
    delete dbExp[c];
    exps.forEach(e => { delete dbHab[e]; });
  });

  guardarEnLocalStorage();
  refrescarTodosLosSelects();
  cerrarModal();
}

function borrarComp() {
  const areaId = document.getElementById('selImpactoPadre').value;
  const comp = document.getElementById('selComp').value;
  if (!areaId || !comp) return cerrarModal();

  dbComp[areaId] = (dbComp[areaId] || []).filter(x => x !== comp);

  const exps = (dbExp[comp] || []).slice();
  delete dbExp[comp];
  exps.forEach(e => { delete dbHab[e]; });

  guardarEnLocalStorage();
  cargarCompetencias();
  cargarCompParaExp();
  hCargarComp();
  cerrarModal();
}

function borrarExp() {
  const comp = document.getElementById('selCompExp').value;
  const exp = document.getElementById('selExp').value;
  if (!comp || !exp) return cerrarModal();

  dbExp[comp] = (dbExp[comp] || []).filter(x => x !== exp);
  delete dbHab[exp];

  guardarEnLocalStorage();
  cargarExperiencias();
  hCargarComp();
  cerrarModal();
}

function borrarHab() {
  const exp = document.getElementById('hExp').value;
  const idx = document.getElementById('selHab').value;
  if (!exp || idx === "" || !dbHab[exp]) return cerrarModal();

  dbHab[exp].splice(Number(idx), 1);

  guardarEnLocalStorage();
  hCargarHab();
  cerrarModal();
}


// -------------------------
// PUESTOS DE TRABAJO (UI + persistencia de filtros)
// -------------------------
const PT_CATALOG = {
	
unidadesArmada: [
  "60001000 - AJEMA",
  "60110017 - AJEMA-GABINETE",
  "60201602 - TEAR - SECRETARIA GETEAR",
  "60201608 - TEAR - SECOMTEAR",
  "60201673 - TEAR - AYUMAR",
  "60201684 - TEAR - SEA",
  "60202931 - TERNOR",
  "60202932 - TERSUR",
  "60202933 - TERLEV",
  "60202934 - AGRUMAD",
  "60203061 - FIM",
  "60203900 - FGNE",
  "60207863 - TERSUR.SEGURIDAD BN.ROTA",
  "60212926 - TEAR - GASC",
  "60213062 - TEAR - BDE-I",
  "60213063 - TEAR - BDE-II",
  "60213064 - TEAR - GAD",
  "60213065 - TEAR - BDMZ-III",
  "60213074 - USCAN",
  "60213075 - TEAR - GRUMA",
  "60219600 - FUPRO-CG",
  "60221700 - CUARTEL GENERAL DE LA FIM",
  "60222900 - TEAR",
  "60222911 - TEAR - EM",
  "60232901 - TEAR - BCG",
  "60233078 - FUPRO",
  "60300131 - ARCHIVO ALVARO DE BAZAN",
  "60300136 - ORG.HIST.CULT.NAVAL",
  "60301133 - ARCHIVO GRAL ALVARO DE BAZAN",
  "60301176 - SEDE \"JUAN S. DE ELCANO\"",
  "60306085 - OHCN- ARCHIVO FERROL",
  "60306137 - MUSEO NAVAL-FERROL",
  "60307085 - OHCN- ARCHIVO SAN FDO.",
  "60307137 - MUSEO NAVAL-SAN FERNANDO",
  "60307471 - MUSEO TORRE DEL ORO",
  "60307478 - MUSEO NAVAL-CANARIAS",
  "60307690 - OHCN- ARCHIVO CANARIAS",
  "60308085 - OHCN- ARCHIVO CARTAGENA",
  "60308152 - MUSEO NAVAL-CARTAGENA",
  "60310136 - IHCN",
  "60601104 - JECIS-CRIPTOCEN",
  "60601113 - JECIS - SEGINFO",
  "60601114 - JECIS - GRUCECIS",
  "60601117 - JECIS - ERNAR",
  "60603079 - JECIS - CECISJAL",
  "60603080 - JECIS-CESINJAL",
  "60603134 - JECIS - CECOMJAL",
  "60606176 - JECIS-CESINFER",
  "60606186 - JECIS - CECISFER",
  "60606187 - JECIS - CECOMFER",
  "60607012 - JECIS - CESINROT",
  "60607083 - JECIS - CESINDIZ",
  "60607176 - JECIS - CECISDIZ",
  "60607177 - JECIS - CECOMDIZ",
  "60607308 - JECIS - ERDIZ RX",
  "60607309 - JECIS - ERDIZ TX",
  "60607913 - JECIS - CANARIAS",
  "60607916 - JECIS - ERPAL TX",
  "60607917 - JECIS - ERPAL RX",
  "60608070 - JECIS - CECOMCART",
  "60608082 - JECIS - CESINCART",
  "60608087 - JECIS - ERMAR - TX",
  "60608186 - JECIS - CECISCART",
  "60609798 - JECIS - CECISROT",
  "60609864 - JECIS - CECOMROT",
  "60610112 - JEASER-RGM",
  "60610115 - JESACIS-SV PUBLICACIONES",
  "60610285 - JESAT-JINFRA",
  "60610292 - JESAT-JAT-MUNICIONAMIENTO",
  "60610414 - JESACIS-JAS MADRID",
  "60610450 - JESACIS-AY MAYOR CGA",
  "60611127 - JECIS - CESINMAD",
  "60611138 - JECIS - EREJA",
  "60611139 - JECIS - ERCAZ",
  "60611142 - JECIS - CECOMMAD",
  "60611300 - JECIS",
  "60611307 - JECIS - CIBER",
  "60611801 - JESACIS",
  "60613510 - JESACIS-JAT MADRID",
  "60613519 - JESAT-JAT-ALMACEN",
  "60621801 - JESAT",
  "60621803 - JESAT-OAJ",
  "60621940 - JESACIS-ROA",
  "60621950 - JESACIS-NORMALIZACION",
  "60623510 - JESAT-JAT MADRID",
  "60629845 - CAMARA OFICIALES MADRID",
  "60629846 - CAMARA SUBOFICIALES MADRID",
  "60701505 - SECC. JURIDICA BAHIA CADIZ",
  "60703116 - SECC. JURIDICA CARTAGENA",
  "60709607 - SECC. JURIDICA ENM",
  "60711505 - ASEJUR-SECJUR B.CADIZ",
  "60720204 - ASEJUR",
  "60900313 - TRIBUNAL MARITIMO CENTRAL",
  "60900597 - ASOCIACION SOC MUT SUBOF",
  "60906114 - JUMAPER 6 EL FERROL",
  "60907114 - JUMAPER 4 CADIZ",
  "60908112 - JUMAPER 2 CARTAGENA",
  "61001001 - EMA",
  "61021009 - EMA-SP 2AJEMA",
  "61111030 - EMA-SEGEMAR",
  "61311200 - EMA-DIVLOG",
  "61511400 - EMA-DIVPLA",
  "61801115 - SSN CENTRAL",
  "61807178 - CECOMDIZ-PUNTALES",
  "61807782 - JECIS - CESINPAL",
  "61807914 - JECIS - CECOMPAL",
  "62001500 - FLOTA",
  "62101102 - FLOTA-EM-INTEL-CESAEROB",
  "62101110 - FLOTA-EM-INTEL-MADRID",
  "62111501 - FLOTA-CUARTEL GENERAL",
  "62111501 - INC",
  "62201518 - 41 ESCLLA-JEFATURA ORDENES",
  "62202120 - BAC CANTABRIA",
  "62202170 - REINA SOFIA",
  "62202171 - SANTA MARIA",
  "62202172 - VICTORIA",
  "62202173 - NUMANCIA",
  "62202181 - NAVARRA",
  "62202182 - CANARIAS",
  "62202183 - PATIÑO",
  "62211518 - 41 ESC-JO",
  "62211526 - 41 ESC. ESCOLTAS",
  "62212104 - ALVARO DE BAZAN",
  "62212105 - ALMIRANTE JUAN DE BORBON",
  "62212106 - BLAS DE LEZO",
  "62212107 - MENDEZ NUÑEZ",
  "62212112 - CRISTOBAL COLON",
  "62311593 - GRUPO 2",
  "62312102 - GALICIA L-51",
  "62312103 - CASTILLA",
  "62322102 - GALICIA",
  "62322103 - CASTILLA",
  "62322109 - JUAN CARLOS I",
  "62331553 - GNP",
  "62401691 - FMCM-OAM-SEA",
  "62401692 - FMCM-OAM-AY MAYOR",
  "62411554 - FMCM",
  "62411637 - FMCM-UNIDADES-1/A ESCLLA",
  "62411646 - FMCM-UNIDADES-1/A ESCLLA-J.O.",
  "62411647 - FMCM-OAM-2 ESC. MANTTO",
  "62418148 - FMCM-UNIDADES-UBMCM",
  "62422262 - SEGURA",
  "62422263 - SELLA",
  "62422269 - TAMBRE",
  "62422270 - TURIA",
  "62422271 - DUERO",
  "62422272 - TAJO",
  "62431651 - FMCM-OAM-JEFATURA ORDENES",
  "62511522 - 31 ESCUADRILLA DE SUPERFICIE",
  "62511523 - 31 ESCLLA-JEFATURA ORDENES",
  "62602260 - FLOSUB",
  "62602295 - GALERNA",
  "62608400 - BASUB",
  "62618423 - CPT-SUB",
  "62707811 - FLOAN",
  "62707819 - FLOAN-2 ESCALON MNTO",
  "62707958 - FLOAN-12 ESCUADRILLA",
  "62707959 - FLOAN-14 ESCUADRILLA",
  "62711631 - FLOAN-JEFATURA ORDENES",
  "62711632 - FLOAN-GAE",
  "62717811 - FLOAN",
  "62717820 - FLOAN - SERVICIOS GENERALES",
  "62717825 - FLOAN-4 ESCUADRILLA",
  "62717826 - FLOAN-5 ESCUADRILLA",
  "62717865 - FLOAN-9 ESCUADRILLA",
  "62717866 - FLOAN-10 ESCUADRILLA",
  "62719886 - FLOAN-PILOTO FLO/ARIZ",
  "62727866 - FLOAN-10 ESCUADRILLA",
  "62727957 - FLOAN-11 ESCUADRILLA",
  "62729809 - FLOAN-ALA 11",
  "62901563 - CEVACO",
  "62911656 - CEVACO-EVACART",
  "62938434 - CEFLOT-SECPER",
  "63000464 - JEPER-PAHUAR-CHA",
  "63000571 - JEPER-PAHUAR",
  "63004000 - JEPER",
  "63004005 - JEPER-OAJ",
  "63004012 - JEPER-OAJ-UPA",
  "63010571 - JEPER-PAHUAR",
  "63010597 - ASOCIACION SOC MUT SUBOF",
  "63104254 - SUBDIREC",
  "63114060 - DIPER",
  "63114100 - SUBDIGPER",
  "63114254 - SUBDIREC",
  "63118032 - OAP MADRID-OAA",
  "63126016 - OAP FERROL",
  "63128006 - OAP CARTAGENA",
  "63136016 - OAP FERROL",
  "63137026 - OAP SAN FERNANDO",
  "63137031 - OAP ROTA",
  "63138006 - OAP CARTAGENA",
  "63138015 - OAP LAS PALMAS",
  "63138016 - OAP MADRID",
  "63147026 - OAP SAN FERNANDO",
  "63147031 - OAP ROTA",
  "63148015 - OAP LAS PALMAS",
  "63200460 - ETSIAN",
  "63204200 - DIENA",
  "63204217 - SECCION DEPARTAMENTAL MCM",
  "63207400 - ESUBO",
  "63207402 - EIM",
  "63208403 - ESCUELA SUBMARINOS",
  "63208415 - ESCUELA BUCEO",
  "63209017 - DIENA 01-CURSOS",
  "63209032 - DIENA 02-CURSOS",
  "63209033 - DIENA 03-CURSOS",
  "63209034 - DIENA 04-CURSOS",
  "63209037 - DIENA 05-CURSOS",
  "63209228 - DIENA 06-CURSOS",
  "63209229 - DIENA 07-CURSOS",
  "63209237 - DIENA 08-CURSOS",
  "63209238 - DIENA 09-CURSOS",
  "63210463 - INST. DEPORTIVAS MADRID",
  "63210480 - DIENA- IDIOMAS",
  "63210481 - CESIA",
  "63210509 - DIENA CENTROS DOCENTES",
  "63211920 - EGN",
  "63214252 - CAE - UVICOA",
  "63216194 - INSTALACIONES DEPORTIVAS FERRO",
  "63216271 - NUCLEO LANCHAS DE INSTRUCCION",
  "63216273 - ENM-VELEROS ESCUELA",
  "63216400 - ENM",
  "63216402 - ANTONIO ESCAÑO",
  "63216404 - ENM-CAI",
  "63216525 - ENM-TREN NAVAL",
  "63217009 - CNR CADIZ",
  "63217194 - INST. DEPORTIVAS SAN FDO.",
  "63217401 - ESCUELA ESTUDIOS SUPERIORES",
  "63217402 - EIMGAF",
  "63217404 - ESHIDRO",
  "63217696 - INSTALACIONES DEPORT.CANARIAS",
  "63217709 - CNR CANARIAS",
  "63217835 - EDAN-CN CARDONA",
  "63217890 - INSTALACIONES DEPORTIVAS ROTA",
  "63218009 - CNR CARTAGENA",
  "63218010 - CNR BALEARES",
  "63218197 - INST. DEPORTIVAS CARTAGENA",
  "63218403 - ESUBMAR",
  "63226446 - ESENGRA",
  "63314301 - DISAN-SECRETARIA",
  "63400407 - RESMAD",
  "63404406 - INSTASAR SOLLER",
  "63406150 - DEL EPISCOPAL FERROL",
  "63406474 - RME",
  "63407150 - VICARIA ARMADA B. CADIZ",
  "63407470 - PARROQUIA CASTRENSE SAN FDO",
  "63408150 - VICARIA ARMADA CARTAGENA",
  "63408844 - R.A.S. MAHON",
  "63408845 - R.A.S. BARCELONA",
  "63410045 - DIASPER",
  "63410051 - REASPER MADRID",
  "63410415 - JEF. ASIST. RELIGIOSA MADRID",
  "63416059 - CEP JUAN SEBASTIAN ELCANO",
  "63417472 - CDSCA OFICIALES SAN FERNANDO",
  "63417473 - CDSCASUBOFICIALESSAN FERNANDO",
  "63417474 - CDSCA MPTM SAN FERNANDO",
  "63417476 - CDSCA MPTM CARTAGENA",
  "63417715 - SV. ASIS. RELIGIOSA CANARIAS",
  "63418472 - CDSCA OFICIALES CARTAGENA",
  "63418473 - CDSCA SUBOFICIALES CARTAGENA",
  "63420466 - CMU JORGE JUAN",
  "63426059 - COLEGIO JUAN SEBASTIÁN ELCANO",
  "63436428 - CDSCA-FERROL",
  "64003000 - JAL",
  "64013000 - JAL",
  "64013101 - JAL-OAJ",
  "64033004 - JAL-AYUDANTIA MAYOR",
  "64103200 - JAL-DIC",
  "64113200 - JAL-DIC",
  "64116414 - DIC-SUBDING-RTSIST-CEMEDEM",
  "64513570 - DIGEC",
  "64623440 - JAL-DIN",
  "64813300 - DISOS-SUBDAT",
  "64823131 - DISOS",
  "64833260 - DISOS-SUBDEM",
  "64900006 - CPT-ROTA",
  "64901543 - INTENDENCIA ROTA",
  "64901998 - ARPAL-JASAN",
  "64902521 - ISAAC PERAL",
  "64902522 - NARCISO MONTURIOL",
  "64902523 - COSME GARCIA",
  "64906107 - SSN FERROL",
  "64906130 - INTENDENCIA DE FERROL",
  "64906140 - JEF. APOYO SAN. FERROL",
  "64906330 - PARQUE AUTO FERROL",
  "64906451 - ARFER-TORPEDOS/MINAS",
  "64906472 - ALOJ. LOG. MPTM FERROL",
  "64906500 - ARFER",
  "64906518 - ARFER-TREN NAVAL",
  "64906546 - ARFER-JAP-MUNICIONAMIENTO",
  "64907130 - INTENDENCIA SAN FERNANDO",
  "64907140 - JEF. APOYO SANITARIO B. CADIZ",
  "64907214 - RES.LOG. CABOS SAN FDO.",
  "64907315 - ARDIZ-TORPEDOS/MINAS",
  "64907330 - PARQUE AUTO SAN FDO",
  "64907458 - ARDIZ-TALLER MISILES",
  "64907500 - ARDIZ",
  "64907518 - ARDIZ-TREN NAVAL",
  "64907525 - BN ROTA-TREN NAVAL",
  "64907546 - ARDIZ-JAP-MUNICIONAMIENTO",
  "64907713 - INTENDENCIA LAS PALMAS",
  "64907731 - PARQUE AUTO 6 LAS PALMAS",
  "64907750 - ARPAL",
  "64907800 - BN ROTA",
  "64907810 - BN ROTA-CAPITANIA PUERTO",
  "64907817 - ISEMER",
  "64907891 - BN ROTA AERODROMO",
  "64908130 - INTENDENCIA CARTAGENA",
  "64908198 - RES. LOG. CABOS CARTAGENA",
  "64908216 - RLA Y ALA EN CADIZ",
  "64908313 - EN LA ALGAMECA",
  "64908330 - PARQUE AUTO CARTAGENA",
  "64908453 - ARCART-TALLER-TORPEDOS/MINAS",
  "64908500 - ARCART",
  "64908518 - ARCART-TREN NAVAL",
  "64916192 - RLA Y ALA EN FERROL",
  "64916458 - ARFER-TALLER-MISILES",
  "64917212 - RLA Y ALA SAN FDO",
  "64917757 - ARPAL-JMAN",
  "64917758 - ARPAL-AY.MAYOR",
  "64917767 - ARPAL-JAT",
  "64917816 - ARPAL-JINFRA",
  "64917841 - RLA Y ALA EN ROTA",
  "64918191 - RLA Y ALA CARTAGENA",
  "64920004 - CPT",
  "64921555 - ARDIZ-PUNTALES",
  "64927210 - ARDIZ-CASR",
  "64927750 - ARPAL",
  "64928587 - ALA MTM GALERA",
  "65015000 - DAE",
  "65015100 - DAE-OAD",
  "65105200 - DAE-SUBGECO",
  "65115200 - DAE-SUBGECO",
  "65215400 - DAE-SUBCON",
  "65638130 - DAE-INTEN CT",
  "65727713 - DAE-INTEN-LPM",
  "65930413 - DAE-INTEN MAD",
  "66400199 - ARCART-COTALS-OTACV",
  "66408641 - ARCART-COTALS-CETSUB",
  "66418632 - ARCART-OPAE",
  "66428140 - ARCART-JASAN",
  "66428313 - ARCART-ENA",
  "66428500 - ARCART",
  "66428509 - ARCART-JINFRA",
  "66428510 - ARCART-OAJ",
  "66428540 - ARCART-JMAN",
  "66428550 - ARCART-JAT",
  "66428570 - ARCART-JICO",
  "66428578 - ARCART-COTALS-CEMCAM",
  "66428580 - ARCART-AYUMA",
  "66428592 - ARCART-COTALS-OCEPIT",
  "67003098 - FAM",
  "67103123 - COVAM",
  "67113099 - FAM-CG",
  "67200206 - ISLA DE LEON",
  "67201403 - EMBARCACIÓN APOYO BUCEADORES",
  "67201930 - INSHIDRO",
  "67202013 - GEAT",
  "67202020 - MALASPINA",
  "67202021 - TOFIÑO",
  "67202023 - LANCHAS HIDROGRAFICAS",
  "67202046 - EL CAMINO ESPAÑOL",
  "67202345 - POSEIDÓN",
  "67203126 - MARDIZ-JEFATURA",
  "67203150 - MARFER-A CORUÑA",
  "67203162 - MARCART",
  "67203163 - MARCART-JEFATURA",
  "67207058 - INSHIDRO-NIFHC",
  "67207710 - MANDO NAVAL CANARIAS",
  "67207722 - SSN CANARIAS",
  "67207742 - RES. LOG. OF/SUBOF CANARIAS",
  "67207780 - CENTRO IDIOMAS CANARIAS",
  "67207794 - ALOJ.LOG. MPTM,S CANARIAS",
  "67208416 - CBA",
  "67208800 - SN BALEARES",
  "67208840 - INTERMARES",
  "67208850 - CARNOTA",
  "67208851 - A-62",
  "67209180 - COM NAVAL VIGO",
  "67209210 - COM NAVAL HUELVA",
  "67209220 - COM NAVAL SEVILLA",
  "67209240 - COM NAVAL ALGECIRAS",
  "67210207 - ISLA PINTO",
  "67212000 - YSABEL",
  "67212001 - JUAN SEBASTIAN DE ELCANO",
  "67212005 - ALERTA",
  "67212020 - MALASPINA",
  "67212021 - TOFIÑO",
  "67212022 - HESPERIDES",
  "67212195 - TARIFA",
  "67212197 - ATALAYA",
  "67212198 - VIGIA",
  "67212200 - SERVIOLA",
  "67212209 - INFANTA CRISTINA",
  "67212338 - MAR CARIBE",
  "67212339 - NEPTUNO",
  "67212441 - LA GRAÑA",
  "67212503 - ALBORAN",
  "67212542 - TABARCA",
  "67212546 - TORALLA",
  "67212547 - FORMENTOR",
  "67212565 - CABO FRADERA",
  "67213125 - MARDIZ",
  "67213126 - MARDIZ-JEFATURA",
  "67213155 - MARFER",
  "67213162 - MARCART",
  "67213630 - METEORO",
  "67213631 - RAYO",
  "67213632 - RELAMPAGO",
  "67213633 - TORNADO",
  "67213634 - AUDAZ",
  "67213635 - FUROR",
  "67216149 - UNIDAD DE BUCEO DE FERROL",
  "67216710 - COM NAVAL SS-AYUD. BIDASOA",
  "67217149 - UNIDAD DE BUCEO CADIZ",
  "67217700 - MN CANARIAS-CUARTEL GENERAL",
  "67217714 - MN CANARIAS-UNIDAD SANITARIA",
  "67217720 - MN CANARIAS-ESTADO MAYOR",
  "67217764 - UNIDAD DE BUCEO CANARIAS",
  "67217930 - MN CANARIAS-COMARCAN",
  "67218416 - CBA",
  "67218800 - SNB",
  "67218801 - SNB-JORD",
  "67218840 - INTERMARES",
  "67219110 - COM NAVAL SAN SEBASTIAN",
  "67219120 - COM NAVAL BILBAO",
  "67219130 - COM NAVAL SANTANDER",
  "67219140 - COM NAVAL GIJON",
  "67219188 - COM NAVAL MIÑO",
  "67219210 - COM NAVAL HUELVA",
  "67219211 - A.N. AYAMONTE",
  "67219240 - C.N. ALGECIRAS",
  "67219270 - COM NAVAL MALAGA",
  "67219280 - COM NAVAL ALMERIA",
  "67219320 - COM NAVAL ALICANTE",
  "67219330 - COM NAVAL VALENCIA",
  "67219350 - COM NAVAL TARRAGONA",
  "67219360 - COM NAVAL BARCELONA",
  "67219366 - CN BARCELONA-AYUD. ROSAS",
  "67219430 - C.N. MAHON",
  "67222199 - CENTINELA",
  "67222536 - TAGOMAGO",
  "67222540 - MEDAS",
  "67222644 - P-114",
  "67223125 - MARDIZ",
  "67227198 - EVIEST TARIFA",
  "67227199 - EVIEST CEUTA",
  "67229180 - C.N. VIGO",
  "67229188 - C.N. MIÑO",
  "67229211 - A.N. AYAMONTE",
  "67229250 - C.N. CEUTA",
  "67229260 - C.N. MELILLA",
  "67229410 - C.N. PALMA",
  "67229420 - AYUDANTIA NAVAL IBIZA",
  "67229430 - C.N. MAHON",
  "67229510 - C.N. TENERIFE",
  "67229512 - AN. SANTA CRUZ DE LA PALMA",
  "67229513 - A.N. SS DE LA GOMERA",
  "67229522 - A.N. ARRECIFE",
  "67229527 - A.N. PUERTO DEL ROSARIO",
  "67232255 - ARNOMENDI",
  "67232991 - DEST NAVAL ALBORAN",
  "67239514 - A.N. HIERRO",
  "67242991 - MARDIZ-DNA",
  "67417013 - SECOMCGMAD",
  "67417037 - CGMAD",
  "67427015 - CGMAD-ESTADO MAYOR"
],
	
  funciones: [
  "10110 - ADMINISTRACION",
  "11130 - OFICIAL INTERCAMBIO PILOTOS",
  "11235 - SUBDIRECTOR",
  "60000 - ALMIRANTE",
  "60001 - ADMINISTRADOR",
  "60003 - ALMIRANTE/GENERAL DIRECTOR",
  "60010 - ALMIRANTE DIRECTOR",
  "60011 - ALMIRANTE SUBDIRECTOR",
  "60015 - ALMIRANTE JEFE",
  "60024 - ASESORIA JURIDICA",
  "60025 - AYUDANTE",
  "60035 - AYUDANTE INSTRUCTOR",
  "60040 - AYUDANTE MAYOR",
  "60041 - AYUDANTE NAVAL",
  "60044 - AYUDANTE PERSONAL",
  "60045 - AYUDANTE SECRETARIO",
  "60046 - CIA FUSILES. PLM",
  "60050 - CAPITAN DE PUERTO",
  "60051 - CIA PN. PLM",
  "60053 - CECOM",
  "60055 - COMANDANTE",
  "60059 - COMANDANCIA",
  "60060 - COMANDANTE DE BATALLON",
  "60063 - CONTRAINTELIGENCIA",
  "60073 - COMANDANTE CIA DOTACION",
  "60075 - COMANDANTE DE ESCUADRILLA",
  "60090 - COMANDANTE DIRECTOR",
  "60096 - COMANDANTE GENERAL DE INFANTERIA DE MARINA",
  "60100 - CONDUCTOR",
  "60105 - CONTRAMAESTRE DE CARGO",
  "60110 - CONTROLADOR",
  "60112 - CONTROL TRAFICO MARITIMO",
  "60114 - COMANDANTE ESTOL",
  "60117 - COMPONENTE ESTOL",
  "60118 - JEFATURA",
  "60119 - JEFATURA DE ESTUDIOS",
  "60120 - CORONEL DIRECTOR",
  "60121 - DELEGADO",
  "60124 - DIRECCION",
  "60125 - DIRECTOR",
  "60127 - DESTACAMENTOS",
  "60128 - DETALL",
  "60130 - DOTACION",
  "60134 - ESTAFETA",
  "60139 - ESCOLTA AJEMA",
  "60143 - GABINETE TECNICO",
  "60145 - GENERAL DIRECTOR",
  "60146 - GRUPO APOYO TECNICO",
  "60160 - INSTRUCTOR",
  "60164 - JEFE GRUPO APOYO TECNICO",
  "60165 - INTENDENTE",
  "60167 - JEFE",
  "60168 - JEFE CECOM",
  "60175 - JEFE DE APROVISIONAMIENTO",
  "60210 - JEFE DE CONTROL DE BUQUE",
  "60215 - JEFE DE DETALL",
  "60218 - JEFE DE DETALL DE ALUMNOS",
  "60235 - JEFE DE ESTACION",
  "60240 - JEFE DE ESTUDIOS",
  "60245 - JEFE DE GABINETE",
  "60246 - JEFE DE GESTION ECONOMICA",
  "60270 - JEFE DE MANTENIMIENTO",
  "60275 - JEFE DE MAQUINAS",
  "60290 - JEFE DE OPERACIONES",
  "60295 - JEFE DE ORDENES",
  "60310 - JEFE DE PARQUE",
  "60320 - JEFE DE PERSONAL",
  "60321 - JEFE DE SEA Y APROVISIONAMIENTO",
  "60322 - JEFE SEA",
  "60325 - JEFE DE SECCION",
  "60328 - JEFE DE SECCION CIS",
  "60329 - JEFE DE SECCION DE ADMINISTRACION",
  "60330 - JEFE DE SECRETARIA",
  "60331 - JEFE DE SECCION DE INTELIGENCIA",
  "60332 - JEFE DE SECCION DE LOGISTICA",
  "60333 - JEFE DE SECCION DE OPERACIONES",
  "60335 - JEFE DE SEGURIDAD",
  "60336 - JEFE DE SECCION DE DOCTRINA",
  "60338 - JEFE DE SECCION DE ORIENTACION PROFESIONAL",
  "60339 - JEFE DE SECCION DE PLANES DE RECURSOS HUMANOS",
  "60340 - JEFE DE SEGURIDAD DE VUELO",
  "60350 - JEFE DE SIMULACION",
  "60355 - JEFE DE SISTEMA DE COMBATE",
  "60366 - JEFE DE LA SEPEC",
  "60370 - JEFE DEL ESTADO MAYOR",
  "60375 - JEFE DEL ESTADO MAYOR DE LA ARMADA",
  "60377 - JEFE DEL OAJ",
  "60378 - JEFE CONTRAINTELIGENCIA",
  "60380 - JEFE DEL SERVICIO APROVISIONAMIENTO",
  "60382 - JEFE DEL SERVICIO ARMAS",
  "60384 - JEFE DEL SERVICIO HIDROGRAFIA",
  "60385 - JEFE DEL SERVICIO CONTROL BUQUE",
  "60388 - JEFE DEL SERVICIO MANTENIMIENTO",
  "60390 - JEFE DEL SERVICIO MAQUINAS",
  "60391 - JEFE DEL SERVICIO OPERACIONES",
  "60395 - JEFE DEL SERVICIO SISTEMA DE COMBATE",
  "60396 - JEFE DEL SERVICIO VUELO",
  "60397 - JEFE DE LOS SERVICIOS GENERALES",
  "60401 - LABORATORIO RADIAC",
  "60403 - MANTENIMIENTO",
  "60404 - MANTENIMIENTO INSTALACIONES",
  "60407 - MANDO EMBARCACIONES ENP",
  "60408 - MOTORISTA LCM",
  "60410 - OFICIAL DE CARGA DE COMBATE",
  "60435 - OFICIAL DE ORDENES",
  "60442 - OFICINA",
  "60445 - OPERADOR",
  "60453 - OPERADOR DE SISTEMAS",
  "60454 - PABELLON AJEMA",
  "60455 - PAÑOL CONDESTABLE",
  "60459 - PN PN. EQ PN",
  "60460 - PATRON",
  "60461 - PLM",
  "60465 - PILOTO",
  "60470 - PRACTICO",
  "60475 - PRACTICO MAYOR",
  "60477 - PLM GRUPO E.O.D - 8",
  "60479 - PRESIDENTE",
  "60480 - PROFESOR",
  "60482 - REGISTRO",
  "60486 - SERAL TEAR",
  "60487 - SEPEC",
  "60488 - SEA",
  "60489 - SECRETARIA",
  "60490 - SECRETARIO",
  "60500 - SECRETARIO TECNICO",
  "60501 - SERVICIOS RELIGIOSOS",
  "60510 - SEGUNDO COMANDANTE",
  "60511 - SEGUNDO COMANDANTE Y JEFE PLM",
  "60515 - SEGUNDO JEFE",
  "60520 - SERVICIO APROVISIONAMIENTO",
  "60522 - SERVICIO ARMAS",
  "60524 - SERVICIO CONTROL DEL BUQUE. CONTRAMAESTRE DE CARGO",
  "60525 - SERVICIO CONTROL DEL BUQUE",
  "60528 - SERVICIO HIDROGRAFIA",
  "60529 - SERVICIO DE BUCEO",
  "60530 - SERVICIO MAQUINAS",
  "60531 - SERVICIO OPERACIONES",
  "60532 - SERVICIO SANIDAD",
  "60533 - SERVICIO DE MANTENIMIENTO",
  "60535 - SERVICIO SISTEMA DE COMBATE",
  "60536 - SERVICIO VUELO",
  "60537 - SERVICIOS GENERALES",
  "60539 - SERVICIOS",
  "60540 - SUBDIRECTOR",
  "60541 - SUBDIRECTOR. JEFE DE ESTUDIOS",
  "60546 - SUBOFICIAL DE CARGA DE COMBATE",
  "60550 - SUBOFICIAL DE CARGO",
  "60555 - SUBOFICIAL MAYOR",
  "60680 - SECCION DE APROVISIONAMIENTO",
  "60682 - SECCION ATENCIONES AL PERSONAL",
  "60683 - SECCION COMUNICACION E INFO",
  "60685 - SECCION CIS",
  "60687 - SECCION DE INTELIGENCIA",
  "60688 - SECCION DE OPERACIONES",
  "60691 - SECCION DE COORDINACION Y CONTROL",
  "60692 - SECCION DE DOCTRINA",
  "60693 - SECCION DE EDUCACION FISICA Y DEPORTES",
  "60694 - SECCION DE ESCUELAS Y CENTROS",
  "60695 - SECCION DE HOJAS DE SERVICIO",
  "60696 - SECCION DE IDIOMAS",
  "60697 - SECCION DE MARINERIA Y TROPA",
  "60699 - SECCION DE LOGISTICA",
  "60701 - SECCION DE MOTIVACION",
  "60707 - SECCION FUSILES. EQ FUEGO",
  "60708 - SECCION FUSILES. PLM",
  "60709 - SECCION PLM Y SERVICIOS. PLM",
  "60710 - SECCION PLM Y SERVICIOS. PN COM",
  "60711 - SECCION PLM Y SERVICIOS. PN TP-AUTO",
  "60712 - SECCION PN. EQ PN",
  "60714 - SECCION SERVICIOS. PLM",
  "60715 - SECCION SERVICIOS. PN APTO",
  "60716 - SECCION SERVICIOS. SERVICIOS GENERALES",
  "60717 - SECCION TP-AUTO. PLM",
  "60718 - SECCION TP-AUTO. PN MANTO",
  "60719 - SECCION TP-AUTO. PN VEH-LIGEROS",
  "60720 - SECCION TP-AUTO. PN VEH-PESADOS",
  "60721 - SECCION SANIDAD",
  "60722 - SECCION SEGURIDAD",
  "60723 - SECCION SERVICIOS",
  "60726 - SECCION DE OFICIALES",
  "60727 - SECCION DE ORIENTACION PROFESIONAL",
  "60728 - SECCION DE PERSONAL",
  "60729 - SECCION DE PERSONAL CIVIL",
  "60730 - SECCION DE PLANES DE RECURSOS HUMANOS",
  "60732 - SECCION DE SEGUIMIENTO CUERPOS COMUNES",
  "60733 - SECCION DE SUBOFICIALES",
  "60734 - SECCION ECONOMICA",
  "60736 - SECCION MOTIVACION Y RETENCION",
  "60737 - SECCION RECURSOS E INSTANCIAS",
  "60743 - SECCION TECNICA",
  "60744 - SECRETARIA GETEAR",
  "60749 - SECRETARIA PERMANENTE",
  "60750 - ADMINISTRACION",
  "60752 - S.A.R.",
  "60757 - ADQUISICION TECNICA",
  "60800 - UNIDAD MUSICA. BANDA CORNETAS Y TAMBORES",
  "60801 - UNIDAD MUSICA. MUSICA",
  "60807 - UNIDAD OPERATIVA",
  "60809 - UNIDAD CINOLOGICA",
  "60813 - CIA SEGURIDAD",
  "60814 - ESCOLTA",
  "62000 - AYUDANTIA MAYOR",
  "62002 - AYUDANTIA MAYOR. DETALL",
  "62003 - AYUDANTIA MAYOR. JEFE DEL DETALL",
  "62004 - AYUDANTIA MAYOR. JEFE SEGURIDAD",
  "62005 - AYUDANTIA MAYOR. JEFE SERVICIO MANTENIMIENTO",
  "62008 - AYUDANTIA MAYOR. SECRETARIA",
  "62009 - AYUDANTIA MAYOR. SEGURIDAD",
  "62010 - AYUDANTIA MAYOR. SERVICIO DE APROVISIONAMIENTO",
  "62011 - AYUDANTIA MAYOR. SERVICIO DE MANTENIMIENTO",
  "62012 - AYUDANTIA MAYOR. TP-AUTO",
  "62020 - AYUDANTIA MAYOR. ARMAS",
  "62025 - AYUDANTIA MAYOR. SEA Y APROVISIONAMIENTO",
  "62100 - AYUDAS A LA ENSEÑANZA",
  "63001 - CECOM. CIFRA",
  "63003 - CECOM. MANTENIMIENTO",
  "63100 - CENTRO DE DOCUMENTACION",
  "63101 - CENTRO INSTRUCCION SEGURIDAD INTERIOR",
  "63126 - EM. G-1",
  "63127 - EM. G-2",
  "63128 - EM. G-3",
  "63129 - EM. G-4",
  "63132 - EM. SECRETARIA",
  "63293 - JEFE DE LA SECCION DE COMUNICACIONES",
  "63295 - JEFE DE LA SECCION DE INFRAESTRUCTURA",
  "63299 - JEFE DE LA SECCION DE PLANES DE RECURSOS",
  "63300 - JEFE DE LA SECCION DE PLANES ESTRATEGICOS",
  "63306 - JEFE DE LA SECCION PERSONAL",
  "63314 - SECCION DE COMUNICACIONES",
  "63317 - SECCION DE INFRAESTRUCTURA",
  "63320 - SECCION DE PLANES DE RECURSOS",
  "63322 - SECCION DE PLANES ESTRATEGICOS",
  "63326 - SECCION DE SEGURIDAD NAVAL",
  "63329 - SECCION ARMA AEREA",
  "63337 - SEGUNDA JEFATURA BRIMAR",
  "63338 - SEGUNDO JEFE DE LA BRIMAR",
  "63339 - SEGUNDO JEFE DEL ESTADO MAYOR DE LA ARMADA",
  "63340 - SUBREGISTRO PRINCIPAL OTAN-ARMADA",
  "63342 - AYUDANTIA MAYOR. SEGURIDAD NAVAL",
  "63343 - COMANDANCIA NAVAL",
  "63346 - TREN NAVAL",
  "63347 - TREN NAVAL. PAÑOL CONTRAMAESTRE",
  "63348 - AYUDANTIA MAYOR. BRIGADA MARINERIA",
  "63350 - AYUDANTIA MAYOR. PUERTO MANIOBRA",
  "63351 - AYUDANTIA MAYOR. SERVICIOS GENERALES",
  "63354 - CECOM. SACOMAR",
  "63355 - CECOM. TELEFONOS",
  "63356 - CESAEROB. SISTEMA HELIOS",
  "63360 - DEPARTAMENTO GUERRA ANFIBIA",
  "63363 - GABINETE CRIPTO",
  "63365 - GENERAL SUBDIRECTOR",
  "63369 - JEFE DE LA SECCION DE INTELIGENCIA",
  "63371 - JEFE DE LA SECCION DE OPERACIONES",
  "63373 - JEFE SECCION DE RELACIONES EXTERIORES",
  "63374 - JEFE DEL ORGANO AUXILIAR DE DIRECCION",
  "63378 - JEFE SECCION DE PRESUPUESTO Y PROGRAMACION",
  "63379 - JEFE SECCION DE RETRIBUCIONES",
  "63380 - JEFE SECCION DE CONTABILIDAD",
  "63381 - JEFE SECCION DE CONTRATACION",
  "63384 - JEFE SECCION DE TESORERIA",
  "63386 - MOVIMIENTO",
  "63387 - OAD",
  "63391 - OAD. SECCION TECNICA",
  "63392 - OAD. SECRETARIA",
  "63397 - PROFESOR. DIRECTOR DPTO CONSTRUCCION Y MATERIALES",
  "63398 - PROFESOR. DIRECTOR DPTO FISICA Y MATEMATICAS",
  "63399 - PROFESOR. DIRECTOR DPTO GUERRA ANFIBIA",
  "63400 - PROFESOR. DIRECTOR DPTO SISTEMAS NAVALES COMBATE",
  "63406 - PROFESOR. DPTO CONSTRUCCION Y MATERIALES",
  "63407 - PROFESOR. DPTO FISICA Y MATEMATICAS",
  "63408 - PROFESOR. DPTO GUERRA ANFIBIA",
  "63409 - PROFESOR. DPTO MANIOBRA Y NAVEGACION",
  "63410 - PROFESOR. DPTO SISTEMAS NAVALES COMBATE",
  "63414 - PROFESOR. JEFATURA ESTUDIOS. CAE",
  "63415 - PROFESOR. SECRETARIO TECNICO",
  "63416 - REGISTRO GENERAL",
  "63417 - SEA Y APROVISIONAMIENTO",
  "63418 - SECCION DE CONTABILIDAD",
  "63419 - SECCION DE PRESUPUESTO Y PROGRAMACION",
  "63422 - SECCION DE CONTRATACION",
  "63427 - SECCION DE INTELIGENCIA. COMINT",
  "63428 - SECCION DE INTELIGENCIA. COMINT. ANALISIS TRAFICO",
  "63430 - SECCION DE INTELIGENCIA. COMINT. OPERADOR SIRGA",
  "63431 - SECCION DE INTELIGENCIA. ELINT",
  "63432 - SECCION DE INTELIGENCIA. IMINT",
  "63444 - SECCION DE RETRIBUCIONES",
  "63450 - SECCION DE TESORERIA",
  "63451 - SEGURIDAD",
  "63453 - SUBDIRECTOR INVESTIGACION Y DOCTORADO",
  "63459 - BIBLIOTECA",
  "63460 - CENTRO DE DATOS",
  "63462 - DOTACION DE LCM",
  "63464 - EQUIPO NAVAL DE PLAYA",
  "63466 - INTENDENCIA",
  "63467 - INTENDENCIA. JEFE DE LA SECCION DE TESORERIA",
  "63469 - INTENDENCIA. JEFE DE LA SECCION IRS",
  "63476 - JEFE DE LA SECCION DE MOTIVACION",
  "63477 - JEFE DE LA SECCION DE ORGANIZACION Y PERSONAL",
  "63483 - PATRON DE LCM",
  "63487 - PILOTO. JEFE DE SEGURIDAD DE VUELO",
  "63490 - PUNTO DE CONTROL OTAN",
  "63493 - SECCION DE ORGANIZACION Y PERSONAL",
  "63494 - SEGURIDAD DE VUELO",
  "63496 - SIMULACION",
  "63497 - TACCO-NAVEGANTE",
  "63498 - TALLER SUPERVIVENCIA",
  "63500 - DEPARTAMENTO DE ARMAS",
  "63501 - DEPARTAMENTO DE ENERGIA Y PROPULSION",
  "63503 - DEPARTAMENTO DE IDIOMAS",
  "63504 - DEPARTAMENTO DE INSTRUCCION Y ADIESTRAMIENTO",
  "63509 - VICEPRESIDENTE",
  "63516 - ALMIRANTE SUBDIRECTOR DE MANTENIMIENTO",
  "63517 - ANALISIS VIBRACIONES",
  "63521 - ARMAS",
  "63522 - AVIONICA. CALIBRACION",
  "63525 - AYUDANTIA MAYOR. CUARTEL MARINERIA",
  "63526 - AYUDANTIA MAYOR. PRACTICO",
  "63527 - AYUDANTIA MAYOR. SERVICIO MANTENIMIENTO",
  "63529 - BIBLIOTECARIO",
  "63531 - CAMARA DE OFICIALES",
  "63532 - CAPITANIA DE PUERTO",
  "63534 - COMBUSTIBLES",
  "63535 - COMEDOR DE SUBOFICIALES",
  "63536 - COMUNICACIONES EXTERIORES",
  "63537 - CONFIGURACION DOCUMENTACION",
  "63538 - CONSOLAS TACTICAS",
  "63539 - CONTRAINCENDIOS",
  "63540 - CONTROL PROPULSION",
  "63543 - CUARTEL DE MARINERIA",
  "63548 - ENFERMERIA",
  "63552 - GABINETE DE ESTUDIOS",
  "63553 - GESTION CALIDAD",
  "63554 - GIROSCOPICA",
  "63555 - GRUPO DE APOYO",
  "63556 - GUERRA ELECTRONICA",
  "63557 - INFORMACION AERONAUTICA",
  "63558 - INFORMATICA",
  "63559 - INSPECCION CASCO Y MAQUINAS",
  "63560 - INSPECCION EL",
  "63561 - INSTALACIONES NAVALES",
  "63562 - JAP",
  "63563 - JAP. JEFE SECCION MATERIAL Y CARGOS",
  "63564 - JAP. JEFE SERVICIO VESTUARIOS Y FACTORIA",
  "63565 - JAP. SECCION MATERIAL Y CARGOS",
  "63566 - JAP. SERVICIO COMBUSTIBLES",
  "63567 - JAP. SERVICIO REPUESTOS Y PERTRECHOS",
  "63568 - JAP. SERVICIO VESTUARIOS Y FACTORIA",
  "63569 - JEFATURA AERODROMO",
  "63570 - JEFE AREA EL/ER",
  "63571 - JEFE AREA PROPULSION Y CASCO",
  "63572 - JEFE CONTROL ECONOMICO",
  "63573 - JEFE SECCION ADIESTRAMIENTO",
  "63574 - JEFE SECCION ECONOMICA",
  "63575 - JEFE SERVICIOS AEREOS",
  "63576 - JEFE DETALL PERSONAL LABORAL",
  "63577 - JEFE GABINETE DE ESTUDIOS",
  "63578 - JEFE ORGANO DE APOYO A INSTALACIONES",
  "63579 - JEFE PARQUE AUTO Nº5",
  "63580 - JEFE SECCION DE SEGURIDAD NAVAL",
  "63581 - JEFE SERVICIO DE APOYO",
  "63582 - JEFE JAP",
  "63583 - JEFE JIN",
  "63586 - JEFE PLANEAMIENTO Y CONTROL",
  "63587 - JEFE PRODUCCION",
  "63588 - JEFE SECCION PROYECTOS Y OBRAS",
  "63589 - JEFE SECCION APOYO LOGISTICO INTEGRADO",
  "63590 - JEFE DE LA SECCION DE MATERIAL Y CARGOS",
  "63592 - JEFE SERVICIO COMBUSTIBLES",
  "63593 - JEFE SERVICIO MUNICIONAMIENTO",
  "63594 - JEFE SERVICIO REPUESTOS Y PERTRECHOS",
  "63595 - JEFE SERVICIO SUBSISTENCIAS",
  "63596 - JEFE SERVICIO TRANSPORTES",
  "63597 - JEFE SERVICIO VESTUARIOS",
  "63598 - JEFE TALLER ARMAS",
  "63599 - JEFE TALLER CASCO",
  "63600 - JEFE TALLER D/T",
  "63601 - JEFE TALLER EL",
  "63602 - JEFE TALLER ER",
  "63603 - JEFE TALLER MAQUINARIA",
  "63604 - JEFE TALLER TURBINAS",
  "63605 - JEFE UNIDAD DE CONTRATACION",
  "63606 - JIN. COORDINADOR LOGISTICO",
  "63607 - JIN. JEFE SECCION MANTENIMIENTO",
  "63608 - JIN. RAMOS INDUSTRIALES",
  "63609 - JIN. SECCION MANTENIMIENTO",
  "63610 - JIN. SECRETARIA",
  "63612 - MANTENIMIENTO INFRAESTRUCTURA",
  "63613 - MINI-MICROSOLDADURA",
  "63617 - OAD. JEFE SECCION ESTUDIOS Y PROGRAMAS",
  "63618 - OAJ",
  "63620 - OAJ. SECRETARIA",
  "63621 - OBRAS/PRESUPUESTOS",
  "63622 - OFICINA TECNICA",
  "63623 - ORGANO APOYO INSTALACIONES",
  "63625 - PAÑOL ARMAS",
  "63626 - PARQUE AUTOS Nº5",
  "63627 - PLANEAMIENTO Y CONTROL",
  "63629 - POLVORINES",
  "63630 - PRODUCCION",
  "63632 - RADAR E IFF",
  "63641 - SECCION CONTROL ECONOMICO MATERIAL",
  "63642 - SECCION ADIESTRAMIENTO",
  "63644 - SECCION MANTENIMIENTO",
  "63645 - SECCION OBRAS CIVILES",
  "63647 - SECCION MATERIAL Y CARGOS",
  "63648 - SEGOP",
  "63649 - SEGUIMIENTO OBRAS A BORDO",
  "63650 - SERVICIO COMBUSTIBLES",
  "63651 - SERVICIO APOYO",
  "63652 - SERVICIO MUNICIONAMIENTO",
  "63653 - SERVICIO REPUESTOS Y PERTRECHOS",
  "63654 - SERVICIO SUBSISTENCIAS",
  "63655 - SERVICIO TRANSPORTES",
  "63657 - SERVICIOS ELECTRICOS",
  "63658 - SERVICIOS ELECTRONICOS",
  "63659 - SERVICIOS MECANICOS",
  "63660 - SIMULADOR TACTICO SAT",
  "63661 - SIMULADORES PLATAFORMA",
  "63678 - TALLER ARMAS",
  "63679 - TALLER ARMAS/DT",
  "63680 - TALLER ARMAS/ANTENAS",
  "63681 - TALLER BALSAS",
  "63682 - TALLER CASCO",
  "63683 - TALLER D/T",
  "63684 - TALLER EL",
  "63685 - TALLER ER",
  "63686 - TALLER FRIO",
  "63687 - TALLER JARCIAS",
  "63688 - TALLER MAQUINARIA",
  "63689 - TALLER TACTAS Y SONAR",
  "63690 - TALLER TURBINAS",
  "63691 - TELETIPOS",
  "63692 - TRANSITO AEREO",
  "63693 - TRANSPORTES",
  "63694 - UNIDAD DE CONTRATACION",
  "63695 - VEHICULOS ESPECIALES",
  "63697 - APROVISIONAMIENTO",
  "63706 - AYUDANTIA MAYOR. CASI",
  "63708 - CENTRO METROLOGIA Y CAM",
  "63709 - COMISION NAVAL DE REGATAS",
  "63711 - ESCUELAS",
  "63713 - GRUPO SOSTENIMIENTO F-100",
  "63714 - ICO",
  "63715 - ICO. JEFE CONTROL ECONOMICO Y MATERIAL",
  "63716 - IMAGEN Y SONIDO",
  "63717 - INTENDENCIA. SECCION IRS",
  "63719 - JAP. EOSA",
  "63720 - JAP. JEFE EOSA",
  "63722 - JAP. JEFE SERVICIO REPUESTOS Y PERTRECHOS",
  "63723 - JAP. JEFE SERVICIO SUBSISTENCIA",
  "63724 - JAP. JEFE SERVICIO VESTUARIO",
  "63725 - JAP. SECCION CONTROL ECONOMICO Y MATERIAL",
  "63726 - JAP. SECRETARIA",
  "63727 - JAP. SERVICIO SUBSISTENCIAS",
  "63728 - JAP. SERVICIO VESTUARIOS",
  "63729 - JEFE CENTRO METROLOGIA Y CAM",
  "63730 - JIN. DIQUE",
  "63731 - JIN. GRUPO MANTENIMIENTO SUBMARINOS",
  "63733 - JEFE ICO",
  "63734 - JEFE SECCION INA",
  "63735 - JIN",
  "63736 - JIN. CONTROL CONFIGURACION",
  "63737 - JIN. CONTROL ECONOMICO Y MATERIAL",
  "63738 - JIN. JEFE RAMO ARMAS",
  "63739 - JIN. JEFE RAMO EL/ER",
  "63740 - JIN. JEFE RAMO CASCO Y MAQUINAS",
  "63741 - JIN. JEFE RAMO EL/ER Y ARMAS",
  "63743 - JIN. JEFE VARADERO",
  "63744 - JIN. LABORATORIO",
  "63745 - JIN. RAMO ARMAS",
  "63746 - JIN. RAMO ARMAS Y MISILES",
  "63747 - JIN. RAMO CASCO",
  "63748 - JIN. RAMO EL/ER",
  "63749 - JIN. RAMO MAQUINAS",
  "63750 - JIN. RAMO CASCO Y MAQUINAS",
  "63751 - JIN. SECCION CONTROL ECONOMICO Y MATERIAL",
  "63752 - JIN. SECCION TECNICA",
  "63754 - JIN. TALLER MISILES Y TORPEDOS",
  "63755 - JIN. VARADERO",
  "63756 - JINCART. RAMO ARMAS",
  "63757 - OAJ. SANIDAD",
  "63758 - OAJ. SECCION OPP",
  "63760 - PROFESOR. DIRECTOR DEPARTAMENTO ASTRONOMIA",
  "63761 - PROFESOR. DIRECTOR DEPARTAMENTO GEOFISICA",
  "63762 - PROFESOR. DIRECTOR DEPARTAMENTO HORA",
  "63763 - PROFESOR. DIRECTOR DEPARTAMENTO EFEMERIDES",
  "63764 - PROFESOR. DEPARTAMENTO ASTRONOMIA",
  "63765 - PROFESOR. DEPARTAMENTO EFEMERIDES",
  "63766 - PROFESOR. DEPARTAMENTO GEOFISICA",
  "63767 - PROFESOR. DEPARTAMENTO HORA",
  "63768 - PROFESOR. DEPARTAMENTO INFORMATICA",
  "63769 - SECCION APOYO",
  "63771 - SECCION RECLUTAMIENTO",
  "63773 - SECCION INA",
  "63776 - SISTEMA MULTIMEDIA",
  "63777 - TALLER MISILES",
  "63778 - TALLER TORPEDOS Y MINAS",
  "63780 - AYUDANTIA MAYOR. MANTENIMIENTO",
  "63782 - CARTOGRAFIA",
  "63783 - CASI",
  "63785 - COMUNICACIONES",
  "63786 - CONSERVADOR",
  "63789 - DIRECTOR GERENTE",
  "63790 - EM. JEFE DE LA SECCION DE LOGISTICA",
  "63791 - EM. JEFE DE LA SECCION DE OPERACIONES",
  "63798 - GEODESIA",
  "63799 - HIDROGRAFIA",
  "63800 - INDUSTRIAL",
  "63801 - INSTRUMENTOS NAUTICOS",
  "63803 - PROFESOR. DEPARTAMENTO CONOCIMIENTO CNM",
  "63804 - JAP. SECCION COMBUSTIBLES",
  "63805 - JAP. SECCION MANTENIMIENTO",
  "63806 - JEFATURA DE ESTUDIOS. DETALL",
  "63807 - JEFATURA DE ESTUDIOS. SECRETARIA TECNICA",
  "63808 - JEFE DE ESCUADRILLA",
  "63811 - JIN. GPIM",
  "63812 - JIN. JEFE GPIM",
  "63813 - JIN. JEFE RAMO CASCO",
  "63814 - NAVEGACION",
  "63815 - NUCLEO DE LANCHAS",
  "63817 - OCEANOGRAFIA",
  "63820 - ORP",
  "63822 - PROFESOR. DEPARTAMENTO HIDROGRAFIA",
  "63832 - SECRETARIA TECNICA",
  "63838 - SIG",
  "63841 - BAJO",
  "63842 - BOMBARDINO",
  "63843 - CLARINETE",
  "63844 - FLAUTA",
  "63845 - FLISCORNO",
  "63846 - OBOE/CORNO",
  "63847 - PERCUSION",
  "63849 - SAXO ALTO",
  "63851 - SAXO TENOR",
  "63852 - TROMBON",
  "63853 - TROMPA",
  "63854 - TROMPETA",
  "63856 - PROFESOR. DPTO LOGISTICA",
  "63857 - PROFESOR. DPTO LOGISTICA. AUMAME",
  "63858 - PROFESOR. DPTO OPERACIONES",
  "63859 - SECCION DE NORMALIZACION",
  "63860 - FAGOT",
  "63900 - CENTRO DE SISTEMAS DE INFORMACIÓN",
  "63901 - CENTRO DE SISTEMAS DE INFORMACIÓN-MANDO Y CONTROL",
  "63903 - SECRETARIA-DETALL",
  "63904 - CECOM MANTENIMIENTO/TELEFONOS",
  "63905 - CECOM COE-AR",
  "63906 - CECOM-BRASS",
  "63907 - GRUPO DE APOYO AL SOSTENIMIENTO BAM",
  "64101 - JEFE SECCION AYUDAS ECONOMICAS",
  "64103 - JEFE SECCION COMUNICACION E INFO",
  "64104 - JEFE SECCION COORDINACION Y CONTROL",
  "64105 - JEFE SECCION DE EDUCACION FISICA Y DEPORTES",
  "64106 - JEFE SECCION DE ESCUELAS Y CENTROS",
  "64107 - JEFE SECCION DE HOJAS DE SERVICIO",
  "64109 - JEFE SECCION DE MARINERIA Y TROPA",
  "64110 - JEFE SECCION DE OFICIALES",
  "64111 - JEFE SECCION DE PERSONAL CIVIL",
  "64113 - JEFE SECCION DE SUBOFICIALES",
  "64114 - JIN. JEFATURA",
  "64117 - JEFE SECCION RECURSOS E INSTANCIAS",
  "64118 - JEFE SECCION TECNICA",
  "64299 - AYUDANTIA MAYOR. REGISTRO",
  "64301 - AYUDANTIA MAYOR. PAÑOL ARMAS",
  "64302 - AYUDANTIA MAYOR. PAÑOL IM",
  "64304 - AYUDANTIA MAYOR. PUERTO/PANTALANES",
  "64305 - CEMEDEM",
  "64306 - DEPARTAMENTO CIENCIAS Y TECNICAS NAVEGACION",
  "64310 - JEFATURA SEA",
  "64311 - JEFE CEMEDEM",
  "64313 - PROFESOR. DPTO CIENCIAS Y TECNICAS NAVEGACION",
  "64314 - PROFESOR. DPTO IDIOMAS",
  "65002 - PROFESOR. DIRECTOR DPTO ARMAS",
  "65004 - PROFESOR. DIRECTOR DPTO ENERGIA Y PROPULSION",
  "65005 - PROFESOR. DIRECTOR DPTO INSTRUCCION Y ADIESTRAMIENTO",
  "65007 - PROFESOR. DIRECTOR DPTO TACTICA",
  "65009 - PROFESOR. DPTO ARMAS",
  "65013 - PROFESOR. DPTO ARMAS. SECCION ARMAS SUBMARINAS",
  "65014 - PROFESOR. DPTO ARMAS. SECCION ARTILLERIA Y MISILES",
  "65017 - PROFESOR. DPTO ENERGIA Y PROPULSION",
  "65020 - PROFESOR. DPTO ENERGIA Y PROPULSION. SECCION ELECTRICIDAD",
  "65021 - PROFESOR. DPTO ENERGIA Y PROPULSION. SECCION MECANICA",
  "65022 - PROFESOR. DPTO HUMANISTICO CIENTIFICO",
  "65023 - PROFESOR. DPTO INSTRUCCION Y ADIESTRAMIENTO",
  "65028 - PROFESOR. DPTO TACTICA",
  "65029 - PROFESOR. JEFATURA DE ESTUDIOS",
  "65030 - SERVICIO DE OPERACIONES. DOTACION DE VUELO",
  "65031 - SERVICIO DE MANTENIMIENTO. DOTACION DE VUELO",
  "65034 - GRUPO DE GUERRA ANTISUBMARINA",
  "65035 - GRUPO DE GUERRA DE SUPERFICIE",
  "65036 - GRUPO DE GUERRA ANFIBIA",
  "65037 - CALIDAD. OFICINA TECNICA",
  "65038 - CALIDAD",
  "65039 - CALIBRACION",
  "65047 - RED AREA LOCAL",
  "65058 - UVICOA",
  "65063 - GRUPO BUQUES SUPERFICIE",
  "65065 - SECCION SUBMARINOS",
  "65071 - INTENDENCIA. U. EJ. PRESUPUSTARIA",
  "65072 - INTENDENCIA. JEFE U. EJ. PRESUPUESTARIA",
  "65073 - SECCION APOYO UCOS",
  "65074 - JEFE SECCION APOYO UCOS",
  "65075 - JEFE SC. APOYO RECLUTAMIENTO",
  "65076 - AGRUMAD",
  "65077 - TERNOR",
  "65078 - TERLEV",
  "65079 - TERSUR",
  "65080 - USCAN",
  "65081 - U. SEG. B.N. ROTA",
  "65082 - UNIDAD DE SERVICIOS",
  "65083 - POLICIA NAVAL",
  "65084 - SERVICIO DE CARGO",
  "65086 - JEFE DEL SERVICIO DE SEGURIDAD",
  "65087 - SERVICIO DE SEGURIDAD",
  "65088 - I.C.O. GRUPO S-80",
  "65093 - JEFE RAMO TECNICO DE PLATAFORMAS NAVALES",
  "65094 - JEFE RAMO TECNICO DE SISTEMAS",
  "65095 - JEFE RAMO TECNICO DE ARMAS Y MUNICIONES",
  "65096 - JEFE DE LA SECCION DE EVALUACION Y COSTES",
  "65097 - JEFE PROGRAMA FRAGATA F-100",
  "65098 - JEFE PROGRAMA SUBMARINO S-80",
  "65099 - JEFE PROGRAMA BUQUE DE PROYECCION ESTRATEGICA",
  "65100 - JEFE PROGRAMA BUQUES ESPECIALES",
  "65102 - JEFE SECCION ARQUITECTURA NAVAL",
  "65107 - JEFE SECCION DE DETECCION ELECTROMAGNETICA",
  "65109 - JEFE SECCION DE ARMAS SUBMARINAS",
  "65110 - JEFE SECCION DE ARTILLERIA",
  "65119 - SECCION DE ELECTRICIDAD",
  "65131 - JEFE ABASTECIMIENTO Y CONTROL INVENTARIO",
  "65135 - SERVICIO DE VESTUARIO",
  "65136 - JEFE SERVICIO ECONOMICO-ADMINISTRATIVO",
  "65138 - RESIDENCIAS",
  "65148 - COMANDANCIA MILITAR DE MARINA",
  "65149 - JEFE SECTOR NAVAL",
  "65150 - PROFESOR. SECRETARIO",
  "65151 - PROFESOR. DTOR. DPTO. CONOC TECNICOS-HUMANISTICOS",
  "65152 - PROFESOR. JEFE DEL SEA Y APROVISIONAMIENTO",
  "65153 - SUBDING",
  "65154 - SUBDING. RTPN",
  "65155 - SUBDING. RTS",
  "65156 - SUBDING. RTAM",
  "65157 - SUBDIRECTOR DE INGENIERIA",
  "65173 - PROGRAMAS",
  "65178 - DIC",
  "65182 - ACRD",
  "65186 - ESTADO MAYOR",
  "65188 - COMPAÑIA DE CUARTEL GENERAL",
  "65193 - CELULA METOC",
  "65194 - JEFE SECCION RECLUTAMIENTO",
  "65197 - JEFE SECCION DE RECOMPENSAS",
  "65198 - SECCION DE RECOMPENSAS",
  "65200 - JEFE TALLER MOTORES",
  "65201 - JEFE TALLER ALA-FIJA",
  "65202 - JEFE OFICINA TECNICA CALIDAD/CALIBRACION",
  "65203 - JEFE TALLER ESTRUCTURAS DE HELICOPTEROS",
  "65204 - ELECTRICIDAD Y ELECTRONICA",
  "65205 - ESTRUCTURAS DE HELICOPTEROS",
  "65206 - ESTRUCTURAS DE HELICOPTEROS. MOTORES",
  "65207 - MOTORES",
  "65209 - SUBDIRECION GESTION ECONOMICA Y CONTRATACION",
  "65210 - ELECTRICIDAD Y ELECTRONICA. CALIBRACION",
  "65211 - ELECTRICIDAD Y ELECTRONICA. MOTORES",
  "65212 - ESTRUCTURAS DE HELICOPTEROS. MOTORES ALA FIJA",
  "65213 - ESTRUCTURAS DE HELICOPTEROS. ELECTRICIDAD Y ELECTRONICA",
  "65214 - SUBOFICIAL MAYOR DE LA ARMADA",
  "65215 - JEFE SECCION ECONOMICA EN EL EXTRANJERO",
  "65216 - SECCION TESORERIA - CAJERO PAGADOR",
  "65217 - SECCION RETRIBUCIONES - CAJERO PAGADOR",
  "65218 - SECCION ECONOMICA EN EL EXTRANJERO - CAJERO PAGADOR",
  "65219 - SECCION ECONOMICA EN EL EXTRANJERO",
  "65220 - JEFE DE SECCION DE DOCTRINA Y ASESORAMIENTO",
  "65221 - SECCION DE DOCTRINA Y ASESORAMIENTO",
  "65222 - SECCION DE HORA",
  "65223 - JEFE SECCION DE RESERVISTAS",
  "65224 - SECCION DE RESERVISTAS",
  "65227 - JEFE SECCION IDENTIFICACION NAVAL E ICA",
  "65228 - SECCION IDENTIFICACION NAVAL E ICA",
  "65230 - INTERVENCION DE ARMAS",
  "65231 - PERSONAL",
  "65236 - JEFATURA DE ESTUDIOS. COORDINACION",
  "65243 - JEFE SECCION DE ARMA AEREA",
  "65244 - JEFE SECCION DE SUBMARINOS",
  "65251 - SECRETARIA GENERAL",
  "65261 - JEFATURA DE MANTENIMIENTO",
  "65272 - JEFE DEL SERVICIO DE PUBLICACIONES",
  "65273 - PUBLICACIONES",
  "65281 - PROFESOR. DPTO CONTROLADORES",
  "65282 - DPTO CONTROLADORES",
  "65285 - JEFE SEC. ASOCIADOS",
  "65286 - JEFE SEC. BENEFICIARIOS",
  "65287 - PROFESOR.DIRECTOR TECNICO",
  "65288 - PROFESOR/ADMINISTRADOR",
  "65290 - SUPERVISOR DIQUE/PATRON LCM",
  "65291 - O.A.A.",
  "65292 - O.F.A.P.",
  "65293 - JEFE SECCION ACCION SOCIAL",
  "65294 - JEFE SECCION CENTROS SOCIALES",
  "65295 - SECCION ACCION SOCIAL",
  "65296 - SECCION CENTROS SOCIALES",
  "65297 - SECCION AYUDAS ECONOMICAS",
  "65300 - ASESOR DE AJEMA",
  "65301 - JEFE OF. PROG. SEG. SUBMARINO",
  "65303 - OFICINA PROG. SEG. SUBMARINO",
  "65318 - JEFE DE LA SECCION DE RECURSOS",
  "65319 - SECCION DE RECURSOS",
  "65321 - SECCION DE PERSONAL/ORGANIZACION/N1",
  "65322 - SECCION DE INTELIGENCIA/N2",
  "65323 - SECCION DE OPERACIONES/N3",
  "65324 - SECCION DE LOGISTICA/N4",
  "65325 - SECCION DE PLANES/N5",
  "65326 - SECCION CIS/N6",
  "65327 - SECCION DE EJERCICIOS/N7",
  "65328 - SECCION DE CIMIC/N9",
  "65329 - SECCION DE RECURSOS/N1-N4",
  "65330 - SECCION DE OPERACIONES/N2-N3-N7",
  "65332 - JEFE DE LA SECCION DE INTELIGENCIA/N2",
  "65333 - JEFE DE LA SECCION DE OPERACIONES/N3",
  "65334 - JEFE DE LA SECCION DE LOGISTICA/N4",
  "65335 - JEFE DE LA SECCION DE PLANES/N5",
  "65336 - JEFE DE LA SECCION DE CIS/N6",
  "65337 - JEFE DE LA SECCION DE EJERCICIOS/N7",
  "65338 - JEFE DE LA SECCION CIMIC/N9",
  "65339 - JEFE DE LA SECCION DE RECURSOS/N1-N4",
  "65340 - JEFE DE LA SECCION DE OPERACIONES/N2-N3-N7",
  "65341 - EQUIPO CONTROL DE PLAGAS",
  "65342 - OFICINA DE COMUNICACION SOCIAL",
  "65343 - JEFATURA DE ORDENES",
  "65344 - JEFE DEL EVADIZ",
  "65345 - EVADIZ",
  "65346 - JEFE DEL CIA",
  "65347 - CIA",
  "65348 - SEGOFLOT",
  "65350 - CSA - SECCION PRL/SEGOP ARMADA",
  "65351 - JEFE DEL EVACART",
  "65352 - EVACART",
  "65353 - SECCION DE OPERACIONES/N2-N3",
  "65355 - CIA - JEFE CASI",
  "65356 - CIA - CASI",
  "65360 - SECCION DE RECURSOS/N1-N4. CELULA M-T",
  "65503 - GENERAL COMANDANTE",
  "65504 - REASPER",
  "65505 - JEFE REASPER",
  "65515 - JEFE AREA DE INTEGRACION Y RECLUTAMIENTO",
  "65516 - JEFE OFAP",
  "65603 - SUBDIRECCION. JEFATURA DE ESTUDIOS",
  "65700 - DIRECTOR DE COMUNICACION DE LA ARMADA Y JEFE LA OCS",
  "65701 - JEFE DE LA SECCION DE PRENSA",
  "65703 - EM. G-1. DETALL",
  "65704 - EM. G-6",
  "65712 - GRUPO DE INFANTERIA DE MARINA",
  "65713 - GRUPO DE ANALISIS DE OPERACIONES",
  "65714 - PREVENCION RIESGOS LABORALES",
  "65715 - COORDINADOR MEDIO AMBIENTE",
  "65716 - MEDIO AMBIENTE",
  "65726 - E.M. SECRETARIO",
  "65727 - COMANDANTE DEL CBA Y DIRECTOR ESCUELA BUCEO",
  "65728 - ALMIRANTE/GENERAL JEFE",
  "65733 - SECCION DE PERSONAL/N1",
  "65734 - JEFE DE LA SECCION DE PERSONAL/N1",
  "65735 - CESADAR",
  "65736 - COMANDANTE DE LA FLOAN, DIRECTOR DE LA EDAN Y JEFE AERODROMO",
  "65737 - COMANDANTE DEL INSHIDRO Y DIRECTOR ESHIDRO",
  "65738 - COORDINACION",
  "65739 - SISTEMAS",
  "65740 - SISTEMAS FFG/PDA",
  "65741 - PCA-TRAINER",
  "65742 - PROFESOR. JEFE DE SECCION",
  "65747 - SUBDELEGADO PAHUAR",
  "65755 - DIRECTOR GERENTE RLA Y ALA",
  "65758 - ADMINISTRADOR RLA",
  "65760 - ADMINISTRACION RLA",
  "65766 - SERVICIOS GENERALES ALA",
  "65767 - SERVICIOS GENERALES RLA",
  "65772 - PROFESOR-CIA",
  "65773 - ARCHIVO CENTRAL CGA",
  "65774 - ARCHIVO CENTRAL CGA.ADMINISTRACION",
  "65775 - ARCHIVO CENTRAL CGA.DIRECTOR",
  "65776 - ARCHIVO CENTRAL CGA.INFORMATICA-REPROGRAFIA",
  "65777 - ARCHIVO CENTRAL CGA.SECRETARIO",
  "65778 - IHCN.DEPARTAMENTO DE CULTURA",
  "65779 - IHCN.JEFE DEPARTAMENTO BIBLIOTECAS Y BIBLIOTECA CENTRAL",
  "65780 - IHCN.JEFE DEPARTAMENTO CULTURA",
  "65781 - IHCN.JEFE DEPARTAMENTO HISTORIA",
  "65782 - IHCN.JEFE DEPARTAMENTO PATRIMONIO NAVAL SUMERGIDO",
  "65783 - IHCN.SUBDIRECTOR",
  "65784 - JEFE SECCION DIFUSION",
  "65785 - MUSEO NAVAL.ADMINISTRACION MUSEOS",
  "65786 - MUSEO NAVAL.JEFE AREA PERIFERICOS Y SISTEMA INFORMATICO MILE",
  "65787 - MUSEO NAVAL.RESTAURACION",
  "65788 - MUSEO NAVAL.SUBDIRECTOR",
  "65789 - SECCION PATRIMONIO HISTORICO MUEBLE",
  "65790 - SUBSISTEMA ARCHIVISTICO.ADMINISTRACION",
  "65791 - SUBSISTEMA ARCHIVISTICO.SUBDIRECTOR",
  "65792 - PROGRAMAS INTERNACIONALES",
  "65797 - ISEMER",
  "65798 - AREA TECNICA",
  "65799 - MUSEO NAVAL. ARCHIVO",
  "65800 - ARCHIVO CENTRAL CGA. AREA TECNICA",
  "65802 - SERVICIOS GENERALES ALA",
  "65803 - SEGURIDAD Y VIGILANCIA",
  "65806 - COMANDANTE UNIDAD EMBARCACIONES",
  "65807 - COMPONENTE UNIDAD EMBARCACIONES",
  "65808 - COMANDANTE UAS",
  "65809 - UAS",
  "65810 - JEFE OCEPIT",
  "65811 - JEFE EQUIPO DE INSPECCION Y CERTIFICACION",
  "65812 - EQUIPO DE INSPECCION Y CERTIFICACION",
  "65817 - JEFE CP-13",
  "65818 - JEFE CP-51",
  "65819 - JEFE SECCION PROTECCION MEDIOAMBIENTAL",
  "65820 - DOTACION REMOLCADOR",
  "65821 - PISTAS",
  "65822 - S.A.T.A.",
  "65825 - ASESOR",
  "65838 - JEFE SECCION COORDINACION PALI",
  "65841 - OF. COORD. US NAVY",
  "65842 - OAJ-ORP",
  "65843 - FORMACION SUBOFICIAL ALUMNO",
  "65844 - FORMACION SUBOF SGTO ALUMNO",
  "65845 - FORMACION OFICIAL ALUMNO",
  "65846 - FORMACION OFICIAL ALFEREZ",
  "65848 - AYUDANTIA MAYOR. JEFE SECCION MANTENIMIENTO",
  "65849 - AYUDANTIA MAYOR. SECCION MANTENIMIENTO",
  "65850 - AYUDANTIA MAYOR. TREN NAVAL",
  "65851 - JEFATURA DE ORDENES. SECRETARIA",
  "65852 - JEFATURA DE ORDENES. COMANDANCIA",
  "65853 - JEFATURA DE ORDENES. CECOM. PUNTO DE CONTROL OTAN",
  "65854 - JEFE SERVICIO DE APOYO AL BUCEO",
  "65855 - SERVICIO DE APOYO AL BUCEO",
  "65856 - AYUDANTIA MAYOR. RESIDENCIAS",
  "65858 - ICO JEFE GRUPO S-80",
  "65859 - ICO OPERACIONES Y ARMAS. GRUPO S-80",
  "65860 - ICO SISTEMA DE COMBATE. GRUPO S-80",
  "65861 - ICO CONTROL PLATAFORMA Y PROPULSION. GRUPO S-80",
  "65862 - SAXOFON",
  "65863 - JEFE SECCION TRAMITACION EXPEDIENTES",
  "65864 - SECCION TRAMITACION EXPEDIENTES",
  "65865 - PROGRAMA CERTIFICACION TECNICA DE SUBMARINOS",
  "65873 - SECCION RELACIONES EXTERIORES",
  "65877 - SECCIÓN ESPECIAL DE PERFECCIONAMIENTO",
  "65878 - SECCIÓN DE ESCUELAS Y CENTROS E INSTALACIONES",
  "65879 - JEFE DEPARTAMENTO CENTRAL DE IDIOMAS",
  "65880 - DEPARTAMENTO CENTRAL DE IDIOMAS",
  "65881 - AYUDANTE IMPRESIÓN",
  "65883 - ADMINISTRADOR ALA",
  "65884 - ADMINISTRADOR ALA OFICIALES/SUBOFICIALES",
  "65885 - ADMINISTRADOR ALA MARINERIA Y TROPA",
  "65886 - ADMINISTRADOR RLA OFICIALES",
  "65887 - ADMINISTRADOR RLA SUBOFICIALES",
  "65888 - ADMINISTRADOR RLA OFICIALES/SUBOFICIALES",
  "65889 - ADMINISTRACION ALA",
  "65893 - CIA DOTACION",
  "65894 - GALERIA DE TIRO",
  "65895 - OFICINA DE SEGURIDAD",
  "65896 - ORGANO AUXILIAR",
  "65897 - SALA HISTORICA",
  "65898 - SERVICIO DE APOYO INFORMATICO",
  "65899 - SECCION DE INFRAESTRUCTURAS",
  "65900 - SECCION DE SERVICIOS",
  "65901 - ADQUISICIONES",
  "65904 - NOMINAS",
  "65905 - RACIONAMIENTO",
  "65906 - SERTEAR",
  "65907 - TESORERIA, CONTRATACION Y CONTABILIDAD",
  "65908 - EM. JEFE DE LA SECCION DE ORGANIZACION Y PERSONAL",
  "65909 - EM. JEFE DE LA SECCION DE INTELIGENCIA",
  "65910 - EM. JEFE DE LA SECCION CIS",
  "65911 - EM. JEFATURA",
  "65912 - BATERIA COORDINACION Y CONTROL DE APOYO DE FUEGOS",
  "65913 - BATERIA MISILES ANTIAEREOS LIGEROS",
  "65914 - BATERIA DE OBUSES",
  "65915 - BATERIA DE PLANA MAYOR Y SERVICIOS",
  "65916 - COMANDANTE GRUPO",
  "65917 - COMANDANTE BIA CCAF",
  "65918 - COMANDANTE BIA MAAL",
  "65919 - COMANDANTE BIA PLM Y SERVICIOS",
  "65920 - COMANDANTE PRIMERA BIA OBUSES",
  "65921 - COMANDANTE SEGUNDA BIA OBUSES",
  "65922 - COMANDANTE TERCERA BIA OBUSES",
  "65923 - PLANA MAYOR S-1/S-4",
  "65924 - PLANA MAYOR S-2/S-3",
  "65925 - SEGUNDO COMANDANTE Y JEFE PLANA MAYOR",
  "65926 - COMANDANTE COMPAÑIA DE ARMAS",
  "65928 - COMANDANTE COMPAÑIA PLANA MAYOR Y SERVICIOS",
  "65929 - COMPAÑIA DE ARMAS",
  "65930 - COMPAÑIA DE FUSILES",
  "65931 - COMPAÑIA PLANA MAYOR Y SERVICIOS",
  "65932 - PLANA MAYOR JEFE S3",
  "65933 - PLANA MAYOR S1",
  "65934 - PLANA MAYOR S2",
  "65935 - PLANA MAYOR S3",
  "65936 - PLANA MAYOR S4",
  "65937 - COMANDANTE COMPAÑÍA DE CARROS",
  "65939 - COMPAÑÍA DE CARROS",
  "65940 - COMPAÑÍA MECANIZADA DE FUSILES",
  "65941 - COMANDANTE COMPAÑIA CONTRA-CARRO",
  "65942 - COMANDANTE COMPAÑIA DE EMBARCACIONES",
  "65943 - COMANDANTE COMPAÑIA DE VEHÍCULOS DE ASALTO ANFIBIO",
  "65944 - COMANDANTE COMPAÑIA DE ZAPADORES",
  "65945 - COMPAÑIA CONTRA-CARRO",
  "65946 - COMPAÑIA DE EMBARCACIONES",
  "65947 - COMPAÑIA DE PLANA MAYOR Y SERVICIOS. JEFE SEDEX",
  "65948 - COMPAÑIA DE VEHICULOS DE ASALTO ANFIBIO",
  "65949 - COMPAÑIA DE ZAPADORES",
  "65950 - COMPAÑIA PLANA MAYOR Y SERVICIOS. SEDEX",
  "65951 - COMTE. COMPAÑIA DE COMUNICACIONES Y SISTEMAS DE INFORMACION",
  "65952 - COMTE. COMPAÑÍA DE ADQUISICION Y RECONOCIMIENTO",
  "65953 - COMANDANTE COMPAÑIA DE INTELIGENCIA Y VIGILANCIA",
  "65954 - COMANDANTE COMPAÑIA DE CUARTEL GENERAL",
  "65955 - COMPAÑIA DE ADQUISICION DE BLANCOS Y RECONOCIMIENTO",
  "65956 - COMPAÑIA DE COMUNICACIONES Y SISTEMAS DE INFORMACION",
  "65957 - COMPAÑIA DE INTELIGENCIA Y VIGILANCIA",
  "65958 - COMANDANTE COMPAÑIA APROVISIONAMIENTO DE COMBATE",
  "65959 - COMANDANTE COMPAÑIA DE TRANSPORTE",
  "65960 - COMANDANTE COMPAÑIA OMP",
  "65961 - COMTE COMPAÑIA PLANA MAYOR Y SERVICIOS Y PLANA MAYOR S-1/S-2",
  "65962 - COMANDANTE COMPAÑIA SANIDAD",
  "65963 - COMPAÑIA APROVISIONAMIENTO DE COMBATE",
  "65964 - COMPAÑIA DE SANIDAD",
  "65965 - COMPAÑIA DE TRANSPORTE",
  "65966 - COMPAÑIA OMP",
  "65967 - JEFE SERVICIO DE APROVISIONAMIENTO DE BASE",
  "65968 - JEFE UNIDAD DE APROVISIONAMIENTO",
  "65969 - JEFE UNIDAD DE MANTENIMIENTO DE SEGUNDO ESCALON",
  "65970 - PLANA MAYOR S-3/S-4",
  "65971 - SERVICO DE APROVISIONAMIENTO DE BASE",
  "65972 - UNIDAD DE APROVISIONAMIENTO",
  "65973 - UNIDAD DE MANTENIMIENTO DE SEGUNDO ESCALON",
  "65974 - COMTE COMPAÑÍA PLANA MAYOR Y SERVICIOS Y PLANA MAYOR S-1/S-4",
  "65975 - ANALISTA Y OPERADOR DE INTELIGENCIA ACUSTICA",
  "65976 - ANALISTA Y OPERADOR DE INTELIGENCIA DE COMUNICACIONES",
  "65977 - ANALISTA Y OPERADOR DE INTELIGENCIA ELECTRONICA",
  "65979 - JEFE OFICINA TECNICA",
  "65980 - LINGÜISTA Y OPERADOR DE INTELIGENCIA DE COMUNICACIONES",
  "65981 - OFICINA TECNICA Y ANALISTA  DE INTELIGENCIA DE IMAGENES",
  "65983 - OPERADOR Y ANALISTA DE INTELIGENCIA ACUSTICA",
  "65984 - OPERADOR Y ANALISTA DE INTELIGENCIA DE COMUNICACIONES",
  "65985 - OPERADOR Y ANALISTA DE INTELIGENCIA ELECTRONICA",
  "65986 - JEFE DE SECCION DE APOYO",
  "65987 - CENTRO REFERENCIA EOD",
  "65988 - OFICINA DE COMANDANCIA",
  "65989 - SECCION DE ARMAS Y GUERRA ELECTRONICA",
  "65990 - JEFE DE LA SECCION DE ARMAS Y GUERRA ELECTRONICA",
  "65991 - SECCION DE PREVENCION DE LA ARMADA",
  "65992 - JEFE DE LA SECCION DE PREVENCION DE LA ARMADA",
  "65993 - SECCION DE PLANES DE DEFINICION DE CAPACIDADES",
  "65994 - JEFE DE LA SECCION DE PLANES DE DEFINICION DE CAPACIDADES",
  "65997 - SUBOFICIAL MAYOR SATEX",
  "65998 - JEFE SERVICIO DE PREVENCIÓN",
  "65999 - SERVICIO DE PREVENCIÓN",
  "66002 - SECRETARÍA AYUDANTE MAYOR",
  "66003 - JEFE INTERNADO",
  "66004 - COMANDANTE 1/A COMPAÑÍA FUSILES",
  "66005 - COMANDANTE 2/A COMPAÑÍA FUSILES",
  "66006 - COMANDANTE 3/A COMPAÑÍA FUSILES",
  "66007 - COMANDANTE 5/A COMPAÑÍA FUSILES",
  "66008 - COMANDANTE 6/A COMPAÑÍA FUSILES",
  "66009 - COMANDANTE 7/A COMPAÑÍA FUSILES",
  "66010 - COMANDANTE 9/A COMPAÑÍA MECANIZADA DE FUSILES",
  "66011 - COMANDANTE 10/A COMPAÑÍA MECANIZADA DE FUSILES",
  "66012 - DIRECTOR ADJUNTO",
  "66013 - SERVICIO GRAL. PROTECCION MATERIAS CLASIFICADAS",
  "66014 - JEFE SECRETARIA TECNICA",
  "66015 - JEFE GRUPO CIBERDEFENSA",
  "66016 - COORDINACION SEGINFO SIT",
  "66017 - JEFE CENTRO OPERACIONES SEGURIDAD",
  "66018 - CENTRO OPERACIONES SEGURIDAD",
  "66019 - JEFE EQUIPO INSPECCION Y ANALISIS",
  "66020 - EQUIPO INSPECCION Y ANALISIS",
  "66023 - SERVICIOS GENERALES-INSTALACIONES",
  "66024 - SERVICIOS GENERALES-DETALL",
  "66025 - SERVICIOS GENERALES-CECOM",
  "66026 - SERVICIOS GENERALES-APROVISIONAMIENTO",
  "66027 - ÁREA PATRIMONIO",
  "66028 - DOTACION Y MANTENIMIENTO DE EMBARCACIONES",
  "66029 - TUBA",
  "66030 - JEFE SECCION DE RESIDENCIAS",
  "66032 - JEFE DE INFRAESTRUCTURA",
  "66033 - GRUPO APOYO DOTACIONES",
  "66035 - MANTENIMIENTO BRASS",
  "66036 - OPERADOR BRASS",
  "66044 - OFICINA PRL/SEGOP, MEDIOAMBIENTE Y SEGURIDAD",
  "66054 - JEFE DEL SERVICIO DE NORMALIZACION",
  "66055 - SERVICIO ENERGIA Y PROPULSION",
  "66056 - JEFE DE SERVICIO ENERGIA Y PROPULSION",
  "66057 - JEFE DE CARGO Y DETALL",
  "66058 - COORDINADOR ACRD",
  "66060 - SECCION DE LOGISTICA E INTERVENCION DE ARMAS",
  "66061 - CAMARA HIPERBARICA",
  "66064 - COMANDANTE NAVAL Y CONSERVADOR MUSEO TORRE DEL ORO",
  "66065 - OFICINA ECONÓMICA",
  "66066 - SECRETARIO DEL CONSEJO SUPERIOR DE LA ARMADA",
  "66072 - SECRETARIO C.N.R.",
  "66074 - COORDINADOR DE COMANDANCIAS NAVALES",
  "66075 - SECCION DE OPERACIONES/N3/CONDUCCION",
  "66076 - SECCION DE OPERACIONES/N2/CEM",
  "66077 - SECCION DE OPERACIONES/N3/NCAGS",
  "66079 - SECCION DE OPERACIONES/N3/CAMPAÑAS",
  "66080 - SECCION DE OPERACIONES/N3/GESTION",
  "66081 - SERVICIO DE PREVENCION",
  "66082 - SECCION DE RECURSOS/N1",
  "66083 - SECCION DE RECURSOS/N4",
  "66084 - SECCION DE RECURSOS/CONTROL ECONOMICO",
  "66086 - COVAM",
  "66087 - PROFESOR.DPTO GESTION ECONOMICA",
  "66088 - PROFESOR.DPTO ESTRATEGIA",
  "66089 - PROFESOR.DPTO ORGANIZACIÓN",
  "66090 - PROFESOR.SECRETARIO ESTUDIOS",
  "66091 - PROFESOR.DEPARTAMENTO CIENCIAS",
  "66092 - PROFESOR.DEPARTAMENTO MANTENIMIENTO AERONAVES",
  "66093 - OFICINA DE PROTOCOLO",
  "66096 - PROFESOR. DEPARTAMENTO SI Y MEDIO AMBIENTE",
  "66097 - PROFESOR. DEPARTAMENTO TCI",
  "66099 - PROFESOR. DPTO OPERACIONES Y SISTEMAS. SECCION DE GE",
  "66100 - PROFESOR. DPTO OPERACIONES Y SISTEMAS. SECCION DE ST",
  "66101 - PROFESOR. DPTO OPERACIONES Y SISTEMAS. SECCION DE SON",
  "66102 - PROFESOR. DPTO OPERACIONES Y SISTEMAS. SECCION DE DT",
  "66103 - JEFATURA DE ESTUDIOS. DPTO INSTRUCCIÓN Y ADIESTRAMIENTO",
  "66104 - AYUDANTIA MAYOR. INFORMATICA",
  "66105 - AYUDANTIA MAYOR. ENFERMERIA",
  "66107 - PROFESOR. DPTO ADMINISTRACION Y ALOJAMIENTO Y RESTAURACION",
  "66108 - AYUDANTIA MAYOR. JEFE DE MANTENIMIENTO. BRIGADA MARINERIA",
  "66109 - SUBOFICIAL MAYOR. JEFATURA DE ESTUDIOS. BRIGADA MARINERIA",
  "66111 - JEFATURA DE ESTUDIOS. CAE. INFORMATICA",
  "66112 - JEFATURA DE ESTUDIOS. DPTO MANIOBRA Y NAVEGACION. SIMULADOR",
  "66114 - JEFE CENTRO DE DATOS GUERRA DE MINAS-SECCIÓN PLANES",
  "66115 - ASESOR DIRECTOR.PROFESOR",
  "66116 - PROFESOR. JEFE OAD",
  "66117 - PROFESOR. DPTO MATEMATICAS, FISICA Y CIENCIAS Y TA",
  "66118 - PROFESOR. DPTO CIENCIAS SOCIALES E IDIOMAS",
  "66119 - PROFESOR. DPTO TACTICA Y SISTEMAS DE ARMAS DE CG",
  "66120 - PROFESOR. DPTO TACTICA Y SISTEMAS DE ARMAS DE IM",
  "66121 - PROFESOR. DPTO LOGISTICA,ECONOMIA,ADMINISTRACION,C.JURIDICAS",
  "66122 - DPTO. TACTICA Y SISTEMAS DE ARMAS DE CG. SIMULADOR",
  "66123 - DPTO. TACTICA Y SISTEMAS DE ARMAS DE IM. SIMULADOR",
  "66124 - JEFATURA ESTUDIOS. CAE",
  "66125 - DPTO. TACTICA Y SISTEMAS DE ARMAS DE CG. PC OTAN",
  "66126 - AYUDANTIA MAYOR. NUCLEO DE LANCHAS",
  "66127 - AYUDANTIA MAYOR. NUCLEO VELEROS",
  "66130 - JEFE SECCION GESTION INFORMACION Y CONOCIMIENTO",
  "66132 - SECCION GESTION INFORMACION Y CONOCIMIENTO",
  "66135 - REGIDOR ALA OFICIALES",
  "66136 - ADMINISTRADOR UNICO",
  "66137 - REGIDOR RLA",
  "66138 - REGIDOR ALA SUBOFICIALES",
  "66139 - RECEPCION Y CONSERJERIA",
  "66141 - SECCIÓN CONTROL DE LA ORGANIZACIÓN",
  "66143 - SEGUNDO COMANDANTE CGMAD",
  "66144 - COMANDANTE DEL CGMAD",
  "66145 - ALMIRANTE SECRETARIO GENERAL DEL ESTADO MAYOR DE LA ARMADA",
  "66147 - GRUPO DE APOYO AL SOSTENIMIENTO SUBMARINOS",
  "66148 - ALMIRANTE DE ACCIÓN MARÍTIMA",
  "66149 - SUBOFICIAL MAYOR DE LA FUERZA DE ACCIÓN MARÍTIMA",
  "66150 - SUBOFICIAL MAYOR DE LA FUERZA DE PROTECCIÓN",
  "66151 - JEFE DE LA OFICINA DE SEGURIDAD FÍSICA DE LA ARMADA",
  "66152 - JEFE DE LA SECRETARIA DEL EM Y AYUDANTE MAYOR DEL CG",
  "66153 - OFICINA DE SEGURIDAD FISICA DE LA ARMADA",
  "66154 - SECRETARIA DEL ESTADO MAYOR",
  "66155 - SUBOFICIAL MAYOR UNIDAD DE PROTECCION FRENTE AL ACOSO",
  "66156 - SUBOFICIAL MAYOR E.E. ANTONIO DE ESCAÑO",
  "66159 - PROFESOR. DPTO OPERACIONES Y SISTEMAS.",
  "66160 - DIRECTOR DE GESTION ECONOMICA DE LA JAL",
  "66161 - UNIDAD DE PROTECCION FRENTE AL ACOSO",
  "66162 - JEFE DE LA UNIDAD DE PROTECCION FRENTE AL ACOSO",
  "66164 - SUBOFICIAL MAYOR DEL CGMAD",
  "66165 - GRUPO DE MANDO/N0",
  "66166 - SERVICIO DE PERTRECHOS",
  "66167 - DIRECTOR DEL MUSEO NAVAL",
  "66175 - SUBOFICIAL MAYOR DEL OAP EN CARTAGENA",
  "66176 - COMANDANTE DEL MANDO NAVAL DE CANARIAS",
  "66177 - COMANDANTE GRUPO ANFIBIO Y DE PROYECCIÓN DE LA FLOTA",
  "66178 - JEFE SECCION COORDINACION APOYO LOGISTICO INTEGRADO",
  "66179 - ALMIRANTE JEFE DE SERVICIOS GENERALES Y ASISTENCIA TÉCNICA",
  "66180 - SUBOFICIAL MAYOR DE LA FLOTA",
  "66181 - SUBOFICIAL MAYOR DE LA 41ª ESCUADRILLA DE ESCOLTAS",
  "66182 - SUBOFICIAL MAYOR DEL MANDO NAVAL DE CANARIAS",
  "66183 - SUBOFICIAL MAYOR DE LA FUERZA DE INFANTERIA DE MARINA",
  "66184 - SUBOFICIAL MAYOR DE LA ESCUELA DE INFANTERIA DE MARINA",
  "66185 - SUBOFICIAL MAYOR DEL ARSENAL DE FERROL",
  "66186 - SUBOFICIAL MAYOR DEL ARSENAL DE LA CARRACA",
  "66187 - ALMIRANTE DE LA FLOTA",
  "66189 - SUBOFICIAL MAYOR DE LA SUBDIGPER",
  "66190 - SECCION DE COORDINACIÓN",
  "66192 - JEFE DE LA SECCIÓN DE CONTROL DE LA ORGANIZACIÓN",
  "66193 - JEFE SECCION DE ABASTECIMIENTO Y TRANSPORTE",
  "66194 - SECCION DE APOYO AL ANALISIS DEL SOSTENIMIENTO",
  "66195 - SECCION DE COORDINACION DEL APOYO LOGISTICO INTEGRADO",
  "66197 - JEFE DE LA SECCION DE PREPARACION",
  "66198 - SECCION DE PREPARACION",
  "66199 - JEFE SECCION DE ORGANIZACION Y ORP",
  "66200 - SECCION DE ORGANIZACION Y ORP",
  "66201 - SECCION DE ORGANIZACION Y ORP, PUNTO DE CONTROL OTAN",
  "66202 - JEFE SECCION DE COORDINACION",
  "66203 - JEFE DEL SERVICIO DE PERTRECHOS",
  "66206 - JEFE GRUPO DE APOYO AL SOSTENIMIENTO INFANTERÍA DE MARINA",
  "66207 - SUBOFICIAL MAYOR DEL OAP EN LAS PALMAS",
  "66208 - SUBOFICIAL MAYOR DE LA FUERZA DE MEDIDAS CONTRAMINAS",
  "66209 - SUBOFICIAL MAYOR DE LA DIRECCIÓN DE ENSEÑANZA NAVAL",
  "66210 - SUBOFICIAL MAYOR DE LA AGRUMAD",
  "66213 - SEGURIDAD INTERIOR DEL CUARTEL GENERAL DE LA ARMADA",
  "66214 - JEFE SECCIÓN GESTIÓN Y COORDINACIÓN ECONÓMICA",
  "66215 - GRUPO DE APOYO AL SOSTENIMIENTO INFANTERIA DE MARINA",
  "66216 - JAT-SERVICIO DE MUNICIONAMIENTO",
  "66217 - MEDIO AMBIENTE Y SEGURIDAD",
  "66218 - INSTRUCTOR EDUCACIÓN FÍSICA",
  "66219 - MONITOR EDUCACIÓN FÍSICA",
  "66221 - OFICINA GESTION INFORMACION Y CONOCIMIENTO",
  "66223 - 2ª JEFATURA ARDIZ-SECRETARÍA-INTERVENCION ARMAS",
  "66224 - SUBOFICIAL MAYOR DE LA ESCUELA NAVAL MILITAR",
  "66225 - SUBOFICIAL MAYOR DE LA E.E. DE LA ESTACION NAVAL DE LA GRAÑA",
  "66227 - JEFE AREA DE ABASTECIMIENTO OFICINA APOYO COMUN NH-90",
  "66228 - REGIDOR COLEGIO MAYOR UNIVERSITARIO",
  "66230 - CENTRO DE INTELIGENCIA ARTIFICIAL DE LA ARMADA",
  "66231 - JEFE SECCION TECNOLOGIAS INFORMACION Y TELECOMUNICACIONES",
  "66232 - SECCION TECNOLOGIAS INFORMACION Y TELECOMUNICACIONES",
  "66233 - JEFE SECCION DE TECNICAS DE APOYO A LA DECISION",
  "66234 - SECCION DE TECNICAS DE APOYO A LA DECISION",
  "66236 - JEFE DE LA SECCION DE PROGRAMAS Y CICLO DE VIDA",
  "66237 - SECCION DE PROGRAMAS Y CICLO DE VIDA",
  "66238 - JEFE DE LA SECCION DE PLANES DE PREPARACION DE LA FUERZA",
  "66239 - SECCION DE PLANES DE PREPARACION DE LA FUERZA",
  "66240 - JEFE DE LA SECRETARIA PARTICULAR DEL SEGUNDO AJEMA",
  "66241 - SECRETARIA PARTICULAR DEL SEGUNDO AJEMA",
  "66242 - SUBOFICIAL MAYOR DEL ESTADO MAYOR DE LA ARMADA",
  "66243 - PARQUE DE AUTOMOVILES NUMERO 2",
  "66244 - OFICINA DE CERTIFICACION DE SUBMARINOS (OCTSUB)",
  "66245 - JEFE SECCION PLANIFICACION DEL SOSTENIMIENTO",
  "66246 - JEFE DEL AREA DE MEDIO AMBIENTE",
  "66248 - JEFE DE SECCION PERSONAL. GRUPO DE APOYO A DOTACIONES",
  "66249 - SECCION DE PERSONAL. GRUPO DE APOYO A DOTACIONES",
  "66250 - JMAN-JEFE MANTENIMIENTO RAMO DE SISTEMAS",
  "66251 - JMAN-JEFE DE LA SECCION DE COORDINACION Y PLANES",
  "66252 - JMAN-JEFE RAMO DE PLATAFORMAS",
  "66253 - COMANDANTE DE LA 31 ESCUADRILLA DE SUPERFICIE",
  "66254 - SUBOFICIAL MAYOR DE 31 ESCUADRILLA DE SUPERFICIE",
  "66255 - COMANDANTE DE LA 41 ESCUADRILLA DE ESCOLTAS",
  "66256 - ALMIRANTE/JEFE DE LA DIVISION DE PLANES DEL EMA",
  "66257 - ALMIRANTE/JEFE DE LA DIVISION DE LOGISTICA DEL EMA",
  "66262 - JEFE DEL SERVICIO DE GESTION PORTUARIA",
  "66263 - JEFE SECCION TECNICA DE APLICACIONES LOGISTICAS",
  "66268 - SECCION GIC - JEFE OFICINA DE INNOVACION",
  "66269 - SECCION GIC - JEFE CENTRO GESTION DATO ARMADA",
  "66270 - SECCION GIC - CENTRO GESTION DATO ARMADA",
  "66271 - SECCION GIC - OFICINA DE INNOVACION",
  "66272 - JEFATURA DE MANTENIMIENTO - RAMO DE PLATAFORMAS",
  "66273 - REGIDOR RLA SUBOFICIALES",
  "66275 - JEFE DEL ARSENAL DE LAS PALMAS",
  "66276 - SUBOFICIAL MAYOR DEL ARSENAL DE LAS PALMAS",
  "66279 - JEFE DE RAMO DE PLATAFORMAS NAVALES",
  "66280 - RAMO DE PLATAFORMAS NAVALES",
  "66281 - RAMO DE PLATAFORMAS NAVALES. GRUPO INSPECCION OBRAS",
  "66282 - RAMO DE SISTEMAS Y ARMAS",
  "66283 - JEFE GRUPO DE APOYO AL SOSTENIMIENTO BAM",
  "66284 - RAMO DE SISTEMAS Y ARMAS. GRUPO INSPECCION OBRAS",
  "66285 - SECCION TECNICA-COORDINACION Y PLANES",
  "66286 - JEFE DE LA SECCION TECNICA-COORDINACION Y PLANES",
  "66287 - JEFE DE APROVISIONAMIENTO Y TRANSPORTE",
  "66288 - SERVICIO REPUESTOS Y PERTRECHOS, MATERIALES Y CARGOS",
  "66289 - JEFE SERVICIO REPUESTOS Y PERTRECHOS, MATERIALES Y CARGOS",
  "66290 - PARQUE DE AUTOMOVILES",
  "66293 - SERVICIO DE SUBSISTENCIAS Y VESTUARIO",
  "66295 - SERVICIO DE COMBUSTIBLE Y MUNICIONAMIENTO",
  "66297 - SECCION DE PROYECTOS Y OBRAS",
  "66298 - SECCION DE PROTECCION MEDIOAMBIENTAL Y EFICIENCIA ENERGETICA",
  "66299 - SECCION DE MANTENIMIENTO Y PATRIMONIO",
  "66300 - SUBOFICIAL MAYOR DEL TERCIO NORTE",
  "66301 - SUBOFICIAL MAYOR DEL TERCIO SUR",
  "66302 - SUBOFICIAL MAYOR DEL TERCIO DE LEVANTE",
  "66303 - SUBOFICIAL MAYOR DE LA FUERZA DE GUERRA NAVAL ESPECIAL",
  "66304 - SUBOFICIAL MAYOR DE LA UNIDAD DE SEGURIDAD DE CANARIAS",
  "66305 - SUBOFICIAL MAYOR DE LA JECIS",
  "66306 - SUBOFICIAL MAYOR DE LA FLOTILLA DE SUBMARINOS",
  "66307 - SUBOFICIAL MAYOR DEL OAP EN FERROL",
  "66308 - SUBOFICIAL MAYOR DEL OAP EN SAN FERNANDO",
  "66309 - SUBOFICIAL MAYOR DEL OAP EN ROTA",
  "66310 - SUBOFICIAL MAYOR DE LA ESCUELA DE SUBOFICIALES DE LA ARMADA",
  "66311 - SUBOFICIAL MAYOR DE LA ESCUELA DE SUBMARINOS",
  "66312 - SUBOFICIAL MAYOR DE LA JEFATURA DE APOYO LOGÍSTICO",
  "66313 - SUBOFICIAL MAYOR DE LA BASE NAVAL DE ROTA",
  "66314 - SUBOFICIAL MAYOR DEL ARSENAL DE CARTAGENA",
  "66315 - SUBOFICIAL MAYOR DEL INSTITUTO HIDROGRAFICO DE LA MARINA",
  "66316 - SUBOFICIAL MAYOR DE MARCART",
  "66317 - SUBOFICIAL MAYOR DEL CENTRO DE BUCEO DE LA ARMADA",
  "66318 - SUBOFICIAL MAYOR DE MARDIZ",
  "66319 - SUBOFICIAL MAYOR DE MARFER",
  "66321 - SUBOFICIAL MAYOR DEL GRUPO DE APOYO DE SERVICIOS DE COMBATE",
  "66322 - SUBOFICIAL MAYOR DEL TERCIO DE ARMADA",
  "66323 - SUBOFICIAL MAYOR DE LA FLOTILLA DE AERONAVES",
  "66325 - SUBOFICIAL MAYOR DEL CENTRO DE INSTRUCCIÓN Y ADIESTRAMIENTO",
  "66326 - SUBOFICIAL MAYOR DEL CEVACO",
  "66327 - SUBOFICIAL MAYOR DEL EVACART",
  "66330 - SUBOFICIAL MAYOR DE LA DIASPER",
  "66331 - JEFE RAMO SISTEMAS Y ARMAS",
  "66332 - SECCION GESTION Y COORDINACION ECONOMICA",
  "66333 - OFICIAL EN PRACTICAS",
  "66334 - JEFE SECCIÓN DE APOYO A PROGRAMAS DE SOSTENIMIENTO",
  "66335 - EMA - SECRETARÍA GENERAL DEL ESTADO MAYOR DE LA ARMADA",
  "66336 - EMA - DIVISIÓN DE LOGISTICA",
  "66337 - EMA - DIVISIÓN DE PLANES",
  "66339 - JEFE DE LA SECCION DE PLATAFORMA",
  "66340 - SECCION DE BUQUES",
  "66341 - JEFE DE LA SECCION DE BUQUES",
  "66342 - PROFESOR. DPTO LOGISTICA. DIRECTOR DE LA ECAR",
  "66343 - SECCIÓN DE ABASTECIMIENTO",
  "66344 - CONDUCTOR-ESCOLTA",
  "66345 - UNADEST. SERVICIO DE MANTENIMIENTO",
  "66346 - UNAEMB. SERVICIO DE MANTENIMIENTO",
  "66347 - UNAEMB. SERVICIO DE OPERACIONES",
  "66348 - JEFATURA. DETALL",
  "66349 - JEFE DE LA OFICINA TÉCNICA DE APOYO AL CICLO DE VIDA S-80",
  "66350 - MECANICO DE LCM",
  "66351 - PROFESOR. SECRETARIO OAD",
  "66353 - COORDINADOR ÓRGANO DE ASESORAMIENTO Y APOYO PRL DEL ALFLOT",
  "66356 - SECCION DE SISTEMAS TACTICOS Y DE COMBATE",
  "66357 - ÓRGANO AUXILIAR DE LA PROGRAMACIÓN Y APOYO ECONÓMICO",
  "66358 - SECCION DE AERONAVES",
  "66359 - SECCION DE TRANSPORTES Y GESTION PORTUARIA",
  "66360 - JEFE ÓRGANO AUXILIAR DE LA PROGRAMACIÓN Y APOYO ECONÓMICO",
  "66361 - GRUPO APOYO SOSTENIMIENTO SISTEMA DE COMBATE",
  "66362 - JEFE GRUPO APOYO SOSTENIMIENTO SISTEMA DE COMBATE",
  "66364 - GRUPO APOYO SOSTENIMIENTO SISTEMA DE COMBATE - JEFE ARMAS",
  "66366 - CAPITANIA DE PUERTO. DOTACIÓN REMOLCADOR",
  "66367 - JEFE SECCION DE REPUESTOS Y PERTRECHOS, MATERIALES Y CARGOS",
  "66368 - SERVICIO DE ABASTECIMIENTO Y TRANSPORTE",
  "66370 - JEFE SERVICIO BUCEO",
  "66371 - JEFE PLANES, PATRIMONIO Y M/A",
  "66372 - JEFE PROYECTOS, OBRAS Y NSIP",
  "66373 - JEFE SUPERVISION PROYECTOS",
  "66374 - JEFE AREA DE PLANES Y PROGRAMACION",
  "66375 - JEFE AREA NSIP",
  "66376 - JEFE AREA PROYECTOS Y OBRAS",
  "66377 - JEFE AREA SUPERVISION DE PROYECTOS",
  "66378 - JEFE AREA SEGURIDAD INSTALACIONES TIERRA",
  "66379 - AREA PROYECTOS Y OBRAS",
  "66380 - AREA PLANES Y PROGRAMACION",
  "66381 - AREA MEDIOAMBIENTE",
  "66382 - AREA SUPERVISION",
  "66383 - SERVICIO DE MATERIAL Y CARGOS",
  "66384 - SUBDIRECTOR DE GESTIÓN ECONÓMICA",
  "66385 - COMPANIA POLICIA NAVAL",
  "66386 - OFICINA DE SEGURIDAD FISICA DELEGADA",
  "66388 - SECCION DE UNIDADES DE INFANTERIA DE MARINA",
  "66389 - JEFE DE LA SECCION DE UNIDADES DE INFANTERIA DE MARINA",
  "66390 - OFICINA TECNICA DE APOYO AL CICLO DE VIDA S-80",
  "66391 - JEFE DE LA UNIDAD  DE GESTION ECONOMICA Y PRESUPUESTARIA",
  "66392 - JEFE OFICINA TECNICA DE APOYO A INFRAESTRUCTURAS NH-90/F-110",
  "66393 - SECCION DE COORDINACION Y PLANES",
  "66395 - JEFE SECCION DE APOYO AL ANALISIS DEL SOSTENIMIENTO",
  "66396 - JEFE DEL SERVICIO DE REPUESTOS",
  "66397 - ALMACEN DE REPUESTOS AERONAVALES DE ROTA",
  "66400 - OAJ. SECRETARIO",
  "66401 - JEFE SECCIÓN EJECUCIÓN PRESUPUESTARIA",
  "66403 - JEFE SECCION DE INGENIERIA",
  "66404 - SECCION DE INGENIERIA",
  "66405 - JEFE SECCION DE CONSTRUCCIONES",
  "66406 - SECCION DE CONSTRUCCIONES",
  "66407 - PILOTO. JEFE DE SERVICIO",
  "66408 - OFICINA TECNICA DE APOYO AL CICLO DE VIDA S-80 SECRETARÍA",
  "66409 - SECCIÓN DE METROLOGÍA Y CALIBRACIÓN",
  "66410 - JEFE NI FHC",
  "66411 - JEFE DE PROYECTOS Y TRABAJOS",
  "66412 - OCEPIT",
  "66413 - JEFE DE SEGURIDAD Y JEFE DEL DETALL",
  "66414 - SERVICIOS GENERALES Y SEGURIDAD",
  "66415 - GABINETE DE ESTUDIOS-NEGOCIADO GIC",
  "66416 - ÓRGANO ASESORAMIENTO PRL",
  "66417 - GABINETE DE ESTUDIOS-OFICINA DE PROCESOS",
  "66418 - SECCION PLANIFICACION DEL SOSTENIMIENTO",
  "66419 - SECCION DE APOYO A PROGRAMAS DE SOSTENIMIENTO",
  "66421 - JEFE OFICINA DE SEGUIMIENTO Y COORDINACION DE PROGRAMAS",
  "66422 - JEFE DE LA SECC. DE INGENIERIA Y CERTIFICACION DE AERONAVES",
  "66423 - SECRETARIO OAD",
  "66424 - SUBDING OSCP SISAE",
  "66425 - SUBDING OSCP",
  "66426 - SUBDING OCTSUB",
  "66430 - STAL",
  "66432 - JEFE STAL",
  "66433 - GENERAL SUBDIRECTOR DE APROVISIONAMIENTO Y TRANSPORTES",
  "66434 - JEFE SECCIÓN ABASTECIMIENTO",
  "66435 - JEFE SECCIÓN TRANSPORTES Y GESTIÓN PORTUARIA",
  "66436 - JEFE SECCIÓN MATERIAL Y CARGOS",
  "66437 - JEFE SECCIÓN REPUESTOS Y PERTRECHOS",
  "66438 - JEFE SERVICIO VESTUARIOS Y SUBSISTENCIAS",
  "66439 - JEFE ÁREA CATALOGACIÓN",
  "66440 - JEFE ÁREA MATERIAL Y CARGOS",
  "66441 - SECCIÓN REPUESTOS Y PERTRECHOS",
  "66442 - SERVICIO VESTUARIOS Y SUBSISTENCIAS",
  "66444 - SERVICIO REPUESTOS",
  "66445 - SERVICIO GESTIÓN PORTUARIA",
  "66448 - JEFE DE LA SECCION DE AERONAVES",
  "66449 - JEFE DE LA SECCION DE SUBMARINOS",
  "66450 - JEFE DE LA SECCION DE SISTEMAS TACTICOS Y COMBATE",
  "66451 - JEFE DE LA SECCION DE METROLOGIA Y CALIBRACION",
  "66452 - SECCION DE PLATAFORMAS",
  "66453 - SECCION DE BUQUES. SECRETARIA",
  "66454 - SUBDING OSCP S-80",
  "66457 - SERVICIO APROVISIONAMIENTO. BUCEO",
  "66458 - SERVICIO OPERACIONES. BUCEO",
  "66459 - SERVICIO ENERGIA Y PROPULSION. BUCEO",
  "66460 - SERVICIO CONTROL DEL BUQUE. BUCEO",
  "66461 - JEFE OFICINA DE CERTIFICACION TECNICA DE SUBMARINOS",
  "66463 - ARCHIVO",
  "66465 - JEFE DEL SERVICIO DE BUCEO",
  "66466 - PROFESOR. DIRECTOR DPTO. CONTROL DEL BUQUE",
  "66467 - PROFESOR. DIRECTOR DPTO. SISTEMAS DE COMBATE",
  "66468 - PROFESOR. DIRECTOR DPTO. SERVICIO DE ENERGÍA Y PROPULSIÓN",
  "66469 - JEFE OFICINA TRANSFORMACIÓN Y SEGUIMIENTO PROYECTO TAJAMAR",
  "66470 - OFICINA TRANSFORMACIÓN Y SEGUIMIENTO PROYECTO TAJAMAR",
  "66471 - PROGRAMA FRAGATA F-110",
  "66472 - DIRECTOR DEL IHCN",
  "66473 - SECRETARIO DEL IHCN",
  "66474 - JEFE DE LA SECCIÓN DE SERVICIOS GENERALES",
  "66475 - SUBDIRECTOR DEL DEPARTAMENTO DE ARCHIVOS NAVALES",
  "66476 - DIRECTOR DEL ARCHIVO GENERAL DEL CGA",
  "66477 - DIRECTOR DEL DEPARTAMENTO DE ESTUDIOS E INVESTIGACIÓN (DEI)",
  "66479 - DEI. JEFE DEL AREA DE PATRIMONIO ARQUEOLÓGICO SUBACUÁTICO",
  "66480 - IHCN. SUBDIRECTOR DEL DEPARTAMENTO DE BIBLIOTECAS NAVALES",
  "66481 - MUSEO NAVAL. COORDINADOR DE MUSEOS FILIALES",
  "66482 - IHCN. JEFE DE LA SECCIÓN DE COMUNICACIÓN",
  "66483 - IHCN. JEFE DE LA SECCIÓN ECONÓMICA",
  "66484 - MUSEO NAVAL. SECCIÓN PATRIMONIO HISTÓRICO MUEBLE",
  "66485 - IHCN. SECCION DE COMUNICACION",
  "66486 - SUBOFICIAL MAYOR DEL IHCN",
  "66487 - DEPARTAMENTO DE ARCHIVOS NAVALES. ADMINISTRACIÓN",
  "66488 - ARCHIVO GENERAL DEL CGA.ADMINISTRACIÓN",
  "66489 - ARCHIVO GENERAL DEL CGA.INFORMATICA-REPROGRAFIA",
  "66490 - ARCHIVO GENERAL DEL CGA. ÁREA TÉCNICA",
  "66491 - MUSEO NAVAL. SECRETARÍA",
  "66492 - ARCHIVO GENERAL DEL CGA",
  "66494 - SECCION GESTION ECONOMICA Y TESORERIA",
  "66495 - JEFE DE SECCIÓN DE APOYO TÉCNICO",
  "66496 - SECCIÓN DE APOYO TÉCNICO.",
  "66497 - JEFE DE SECCIÓN DE GESTIÓN ECONÓMICA Y TESORERÍA",
  "66498 - JEFE ÁREA GESTION ECONOMICA",
  "66499 - SECCIÓN DE GESTIÓN ECONÓMICA Y TESORERÍA",
  "66500 - JEFE ÁREA DE TESORERIA",
  "66501 - SEGURIDAD INTERNA",
  "66505 - GRUPO DE ACCIÓN CONJUNTA",
  "66506 - SECCIÓN INSTALACIONES Y SISTEMAS",
  "66507 - SECCIÓN EFICIENCIA ENERGÉTICA Y MEDIOAMBIENTE",
  "66509 - DEI.JEFE ÁREA HISTORIA NAVAL",
  "66510 - DEI.JEFE ÁREA PUBLICACIONES, CULTURA Y PATRIMONIO INMATERIAL",
  "66511 - PILOTO INTERCAMBIO US NAVY",
  "66512 - GIC-CIA2",
  "66515 - OFICIAL ASESOR MCOE",
  "66516 - JEFE DEL CEVENTA",
  "66517 - DEPARTAMENTO DE GESTIÓN",
  "66518 - DEPARTAMENTO DE GESTIÓN DEL SOSTENIMIENTO",
  "66519 - DEPARTAMENTO DE GESTIÓN DEL APROVISIONAMIENTO",
  "66520 - DEPARTAMENTO DE INGENIERÍA DE SOSTENIMIENTO",
  "66521 - DEPARTAMENTO DE ANÁLISIS Y APOYO A LA DECISIÓN",
  "66522 - SERVICIO VETERINARIO",
  "66523 - SERVICIO VETERINARIO-CONTROL PLAGAS",
  "66524 - JEFE DE INGENIERÍA, CONSTRUCCIONES Y OBRAS",
  "66525 - CONSTRUCCIONES",
  "66526 - SECCIÓN INGENIERIA-PROPULSIÓN Y SERVICIOS",
  "66527 - SECCIÓN INGENIERÍA-SISTEMA DE COMBATE Y ARMAS",
  "66528 - SECCIÓN INGENIERÍA-APOYO LOGÍSTICO INTEGRADO",
  "66529 - SECCIÓN INGENIERÍA-ARQ. NAVAL, CASCO, ESTRUCTURAS",
  "66530 - JEFE CENTRO METROLOGÍA Y CALIBRACIÓN MAGNÉTICA",
  "66531 - SECCIÓN INGENIERÍA-ELECTRICIDAD, SICP, SISTEMA AIP",
  "66532 - CENTRO METROLOGÍA Y CALIBRACIÓN MAGNÉTICA",
  "66533 - JEFE SECCION OPP",
  "66534 - JEFE SECCION PRL",
  "66535 - JEFE SECCION PLANIFICACION Y EVALUACION DE RIESGOS",
  "66536 - OAJ. INTERVENCION PERIFERICA DE ARMAS",
  "66537 - PRL - SECCION DE COORDINACION DE ACTIVIDADES EMPRESARIALES",
  "66538 - PRL - SECCION PLANIFICACION Y EVALUACION DE RIESGOS",
  "66539 - JEFE DE OFICINA DE CERTIFICACION TECNICA DE SUBMARINOS",
  "66540 - JEFE INTEGRACION, RECLUTAMIENTO Y COORDINACION",
  "66541 - INTEGRACION, RECLUTAMIENTO Y COORDINACION",
  "66544 - JEFE O.A.A.",
  "66545 - OFICINA DE SOSTENIMIENTO COMUN DEL NH90/H-135",
  "66547 - CAPITANIA DE PUERTO. OFICINA PRACTICOS",
  "66548 - CAPITANIA DE PUERTO. TREN NAVAL",
  "66549 - PARQUE DE AUTOMOVILES NUM. 4",
  "66550 - JEFE SERVICIO DE ABASTECIMIENTO TRANSPORTE",
  "66551 - JEFE SECCION PROTECCION M/A Y EFICIENCIA ENERGETICA",
  "66552 - JMAN-JEFE DE MANTENIMIENTO",
  "66554 - JMAN-JEFE RAMO ARMAS",
  "66555 - JMAN-JEFE RAMO SISTEMAS",
  "66556 - JMAN-SECCIÓN COORDINACIÓN Y PLANES",
  "66557 - JMAN-JEFE DEL GAS SUB",
  "66558 - JMAN-JEFE GAS BAM",
  "66559 - JMAN-GAS SUB",
  "66560 - JMAN-RAMO DE ARMAS",
  "66561 - JMAN-SUBOFICIAL MAYOR JMANCART",
  "66562 - JMAN-RAMO DE SISTEMAS",
  "66563 - JMAN-GAS BAM",
  "66564 - JMAN-CESADAR CENTRAL",
  "66565 - PILOTO-PROFESOR",
  "66566 - COORDINADOR OTAIN",
  "66567 - OFEN ARMADA MESPA",
  "66568 - JEFE SECCION ALISTAMIENTO LOGISTICO",
  "66569 - J. OO JEF. OPE. EOB",
  "66570 - J. OO JEF. SECTIS EOB",
  "66571 - J. OO JEF. SAB. EOB",
  "66572 - J. OO SAB. EOB",
  "66573 - AYUMAR. EMBARC.",
  "66574 - J. OO SECTIS",
  "66575 - J. OO SAB.",
  "66576 - J. OO CECOM",
  "66577 - J. OO EMBARC.",
  "6000A - ALUMNO"
  ],
  
  
  
  //empleos: ["Marinero", "Cabo", "Cabo 1º", "Sargento", "Suboficial", "Oficial"],

  empleos: [
  "--- OFICIALES GENERALES ---",
  "AG - Almirante General",
  "A - Almirante",
  "VA - Vicealmirante",
  "CA - Contralmirante",

  "--- OFICIALES ---",
  "CN - Capitán de Navío","COR - Coronel",
  "CF - Capitán de Fragata","TCOL - Teniente Coronel",
  "CC - Capitán de Corbeta","CTE - Comandante",
  "TN - Teniente de Navío","CAP - Capitán",
  "AN - Alférez de Navío",
  "TTE - Teniente",
  "AF - Alférez",

  "--- SUBOFICIALES ---",
  "SBMY - Suboficial Mayor",
  "STTE - Subteniente",
  "BG - rigada",
  "SGT1 - Sargento Primero",
  "SDO - Sargento",
  "SGTO.AL - Sargento Alumno",

  "--- TROPA Y MARINERÍA ---",
  "CBMY - Cabo Mayor",
  "CB1 - Cabo Primero",
  "CBO - Cabo",
  "MRO - Marinero", 
  
  "--- Empleo específico / Cuerpo Especial ---",
  "CEMP - Empleo específico / Cuerpo Especial"
],


  situacion: ["H - Honorífico", "B - Situación B / Reserva"],

    
  //cuerpos: ["General", "Infantería de Marina", "Ingenieros", "Sanidad", "Intervención"],
  
  
  
  cuerpos: [
  // Cuerpo General
  "CGA - Cuerpo General de la Armada",

  // Infantería de Marina
  "IM - Cuerpo de Infantería de Marina",

  // Ingenieros
  "ING - Cuerpo de Ingenieros de la Armada",

  // Intendencia
  "CINA - Cuerpo de Intendencia de la Armada",
  
  // Complemento
  "CCP - Cuerpo de Complemento",

  // Sanidad
  //"Cuerpo Militar de Sanidad (Armada)",

  // Intervención
  //"Cuerpo Militar de Intervención (Armada)",

  // Jurídico
  //"Cuerpo Jurídico Militar (Armada)",

  // Músicas Militares
  //"Cuerpo de Músicas Militares (Armada)",

  // Tropa y Marinería
  //"Tropa y Marinería de la Armada"
],
  
  
//  escalas: ["Tropa y Marinería", "Suboficiales", "Oficiales", "Complemento"],
  
  escalas: ["ESB - Escala Superior de Oficiales","EOF - Escala de Oficiales","ESB-Escala de Suboficiales","MC - Militar de Complemento","ETO - Escala de Tropa y Marinería", "EMR - Escala de Marinería","ETR - Escala de Tropa"],

 
  provincias: {
  "MADRID": ["MADRID","SANTORCAZ","TORREJON DE ARDOZ","VALDILECHA"],
  "CADIZ": ["SAN FERNANDO","ROTA","PUERTO REAL","CHICLANA DE LA FRONTERA","CADIZ","BARBATE","ALGECIRAS","TARIFA"],
  "A CORUÑA": ["FERROL","SANTIAGO DE COMPOSTELA","A CORUÑA"],
  "MURCIA": ["CARTAGENA","MURCIA"],
  "PALMAS, LAS": ["PALMAS DE G.C., LAS","ARRECIFE","PUERTO DEL ROSARIO"],
  "CIUDAD REAL": ["VISO DEL MARQUES"],
  "SEVILLA": ["SEVILLA"],
  "ALICANTE": ["GUARDAMAR DEL SEGURA","ALICANTE"],
  "PONTEVEDRA": ["MARIN","PONTEVEDRA","VIGO","TUY"],
  "ILLES BALEARS": ["PALMA","SOLLER","MAHON","EIVISSA"],
  "BARCELONA": ["BARCELONA"],
  "CEUTA": ["CEUTA"],
  "HUELVA": ["HUELVA","AYAMONTE"],
  "MELILLA": ["MELILLA"],
  "GIPUZKOA": ["HONDARRIBIA","SAN SEBASTIAN"],
  "BIZKAIA": ["BILBAO"],
  "CANTABRIA": ["SANTANDER"],
  "ASTURIAS": ["GIJON"],
  "MALAGA": ["MALAGA"],
  "ALMERIA": ["ALMERIA"],
  "VALENCIA": ["VALENCIA"],
  "TARRAGONA": ["TARRAGONA"],
  "GIRONA": ["ROSES"],
  "STA CRUZ TENERIFE": ["SANTA CRUZ DE TENERIFE","S/C DE LA PALMA","SAN SEBASTIAN DE LA GOMERA","VALVERDE DEL HIERRO"]
}

	

};

function ptLoadFilters() {
  try {
    const raw = localStorage.getItem(LS_KEY_PUESTOS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function ptSaveFilters(obj) {
  try {
    localStorage.setItem(LS_KEY_PUESTOS, JSON.stringify(obj || {}));
  } catch {}
}

function ptEl(id) { return document.getElementById(id); }

function ptFillSelect(id, items, placeholder) {
  const s = ptEl(id);
  if (!s) return;
  s.innerHTML = "";
  s.add(new Option(placeholder || "-- Seleccionar --", ""));
  (items || []).forEach(v => s.add(new Option(v, v)));
}

function ptBind(id, filters) {
  const el = ptEl(id);
  if (!el) return;

  // restore
  if (filters && Object.prototype.hasOwnProperty.call(filters, id)) {
    el.value = filters[id];
  }

  const handler = () => {
    const f = ptLoadFilters();
    f[id] = el.value;
    ptSaveFilters(f);
    puestosRenderResultados();
  };

  el.addEventListener("change", handler);
  if (el.tagName.toLowerCase() === "input" || el.tagName.toLowerCase() === "textarea") {
    el.addEventListener("input", handler);
  }
}

function ptOnProvinciaChange() {
  const prov = ptEl("ptProvincia") ? ptEl("ptProvincia").value : "";
  const loc = ptEl("ptLocalidad");
  if (!loc) return;

  loc.innerHTML = "";
  loc.add(new Option("-- Seleccionar --", ""));
  if (!prov) {
    loc.disabled = true;
    const f = ptLoadFilters();
    f["ptLocalidad"] = "";
    ptSaveFilters(f);
    puestosRenderResultados();
    return;
  }

  (PT_CATALOG.provincias[prov] || []).forEach(v => loc.add(new Option(v, v)));
  loc.disabled = false;

  // restore locality if exists
  const f = ptLoadFilters();
  if (f["ptLocalidad"]) loc.value = f["ptLocalidad"];
  puestosRenderResultados();
}

function puestosInit() {
  // Avoid re-init loops
  const root = ptEl("sectionPuestos");
  if (!root) return;

  const filters = ptLoadFilters();

  ptFillSelect("ptUnidad", PT_CATALOG.unidadesArmada, "-- Seleccionar Unidad / Sección --");
  ptFillSelect("ptFuncion", PT_CATALOG.funciones, "-- Seleccionar Función --");
  ptFillSelect("ptEmpleo", PT_CATALOG.empleos, "-- Seleccionar Empleo --");
  ptFillSelect("ptSituacion", PT_CATALOG.situacion, "-- Seleccionar Situación --");
  ptFillSelect("ptCuerpo", PT_CATALOG.cuerpos, "-- Seleccionar Cuerpo --");
  ptFillSelect("ptEscala", PT_CATALOG.escalas, "-- Seleccionar Escala --");

  // provincias
  ptFillSelect("ptProvincia", Object.keys(PT_CATALOG.provincias), "-- Seleccionar Provincia --");

  // localidades placeholder
  const loc = ptEl("ptLocalidad");
  if (loc) {
    loc.innerHTML = "";
    loc.add(new Option("-- Seleccionar Localidad --", ""));
    loc.disabled = true;
  }

  // bind persistence to all fields
  [
    "ptUnidad","ptFuncion","ptEmpleo","ptSituacion","ptCuerpo","ptEscala","ptProvincia","ptLocalidad","ptExpAdquirir",
    "ptCSCE","ptD","ptT4","ptT5","ptT7","ptT8","ptT9","ptCDE",
    "ptEcomReq","ptEt2Req","ptIdiomaReq","ptCursosReq","ptAptitudesReq","ptCompetenciasReq","ptExperienciaReq",
    "ptEcomPref","ptEt2Pref","ptIdiomaPref","ptCursosPref","ptAptitudesPref","ptCompetenciasPref","ptExperienciaPref"
  ].forEach(id => ptBind(id, filters));

  // rehydrate localidad based on provincia restored
  ptOnProvinciaChange();

  // initial render
  puestosRenderResultados();
}

function puestosCollectFiltros() {
  const ids = [
    "ptUnidad","ptFuncion","ptEmpleo","ptCuerpo","ptEscala","ptProvincia","ptLocalidad","ptExpAdquirir",
    "ptCSCE","ptD","ptT4","ptT5","ptT7","ptT8","ptT9","ptCDE",
    "ptEcomReq","ptEt2Req","ptIdiomaReq","ptCursosReq","ptAptitudesReq","ptCompetenciasReq","ptExperienciaReq",
    "ptEcomPref","ptEt2Pref","ptIdiomaPref","ptCursosPref","ptAptitudesPref","ptCompetenciasPref","ptExperienciaPref"
  ];
  const out = {};
  ids.forEach(id => {
    const el = ptEl(id);
    if (!el) return;
    const v = (el.value || "").trim();
    if (v) out[id] = v;
  });
  return out;
}

function puestosRenderResultados() {
  const pre = ptEl("ptResultados");
  if (!pre) return;
  pre.textContent = JSON.stringify(puestosCollectFiltros(), null, 2);
}

function puestosBuscar() {
  puestosRenderResultados();
  // demo: el backend/tabla real se conectará más adelante
  alert("Búsqueda aplicada (demo).");
}

function puestosLimpiar() {
  // reset filters storage
  ptSaveFilters({});
  // reset UI
  [
    "ptUnidad","ptFuncion","ptEmpleo","ptCuerpo","ptEscala","ptProvincia","ptLocalidad","ptExpAdquirir",
    "ptCSCE","ptD","ptT4","ptT5","ptT7","ptT8","ptT9","ptCDE",
    "ptEcomReq","ptEt2Req","ptIdiomaReq","ptCursosReq","ptAptitudesReq","ptCompetenciasReq","ptExperienciaReq",
    "ptEcomPref","ptEt2Pref","ptIdiomaPref","ptCursosPref","ptAptitudesPref","ptCompetenciasPref","ptExperienciaPref"
  ].forEach(id => {
    const el = ptEl(id);
    if (!el) return;
    el.value = "";
  });
  puestosInit();
  puestosRenderResultados();
}

function toggleSeccion(id) {
  const body = document.getElementById(id);
  const icon = document.getElementById(id + "_icon");
  if (!body) return;

  const isClosed = body.classList.contains("closed");

  body.classList.toggle("closed");

  if (icon) {
    icon.textContent = isClosed ? "▲" : "▼";
  }
}


/* =========================
   HEADER: Usuario + acciones
   ========================= */

function getUsuarioSesion() {
  const nombre = (localStorage.getItem('usuarioNombre') || sessionStorage.getItem('usuarioNombre') || '').trim();
  const perfil = (localStorage.getItem('usuarioPerfil') || sessionStorage.getItem('usuarioPerfil') || '').trim();
  return { nombre, perfil };
}

function renderUsuarioHeader() {
  const el = document.getElementById('userLine');
  if (!el) return;

  const { nombre, perfil } = getUsuarioSesion();

  if (nombre) {
    el.innerHTML = `Usuario: <b>${escapeHtml(nombre)}</b>${perfil ? ` &nbsp;|&nbsp; Perfil: ${escapeHtml(perfil)}` : ''}`;
  } else {
    el.innerHTML = `Usuario: <b>No autenticado</b>`;
  }
}

function exportJSON() {
  try {
    const payload = {
      exportedAt: new Date().toISOString(),
      storage: {}
    };

    if (typeof LS_KEY !== 'undefined') payload.storage[LS_KEY] = safeParse(localStorage.getItem(LS_KEY));
    if (typeof LS_KEY_PUESTOS !== 'undefined') payload.storage[LS_KEY_PUESTOS] = safeParse(localStorage.getItem(LS_KEY_PUESTOS));
    if (typeof LS_KEY_PERSONAL !== 'undefined') payload.storage[LS_KEY_PERSONAL] = safeParse(localStorage.getItem(LS_KEY_PERSONAL));

    // usuario (si existe)
    payload.usuario = getUsuarioSesion();

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `armada_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  } catch (e) {
    console.error(e);
    alert('No se pudo exportar el JSON. Revisa la consola para más detalle.');
  }
}

function importJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.onchange = async () => {
    const file = input.files && input.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const storage = data && data.storage ? data.storage : null;
      if (storage && typeof storage === 'object') {
        Object.keys(storage).forEach((k) => {
          const v = storage[k];
          if (v === null || typeof v === 'undefined') {
            localStorage.removeItem(k);
          } else {
            localStorage.setItem(k, JSON.stringify(v));
          }
        });
      }

      // opcional: restaurar usuario
      if (data && data.usuario) {
        if (data.usuario.nombre) localStorage.setItem('usuarioNombre', String(data.usuario.nombre));
        if (data.usuario.perfil) localStorage.setItem('usuarioPerfil', String(data.usuario.perfil));
      }

      alert('Importación completada. Se recargará la página.');
      location.reload();
    } catch (e) {
      console.error(e);
      alert('El fichero no es un JSON válido o no tiene el formato esperado.');
    }
  };
  input.click();
}

function factoryReset() {
  const ok = confirm('Esto borrará los datos guardados en el navegador (localStorage) para esta aplicación. ¿Continuar?');
  if (!ok) return;

  try {
    if (typeof LS_KEY !== 'undefined') localStorage.removeItem(LS_KEY);
    if (typeof LS_KEY_PUESTOS !== 'undefined') localStorage.removeItem(LS_KEY_PUESTOS);
    if (typeof LS_KEY_PERSONAL !== 'undefined') localStorage.removeItem(LS_KEY_PERSONAL);

    // (opcional) también limpiar sesión de usuario
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioPerfil');
    sessionStorage.removeItem('usuarioNombre');
    sessionStorage.removeItem('usuarioPerfil');

    alert('Datos borrados. Se recargará la página.');
    location.reload();
  } catch (e) {
    console.error(e);
    alert('No se pudo hacer el reset. Revisa la consola.');
  }
}

function doLogout() {
  try {
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioPerfil');
    sessionStorage.removeItem('usuarioNombre');
    sessionStorage.removeItem('usuarioPerfil');
  } catch (e) {
    console.warn(e);
  }
  // vuelve al login relativo (misma carpeta)
  window.location.href = 'login.html';
}

/* ======= utils ======= */
function safeParse(str) {
  if (!str) return null;
  try { return JSON.parse(str); } catch { return str; }
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
