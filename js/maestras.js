/**
 * MAESTRAS.JS - Catálogo completo extraído del Dump SQL
 */
window.MAESTRAS = {
    // Tabla: empleo
    tEmp: [
        { cod: "ALM", desc: "Almirante" }, { cod: "VA", desc: "Vicealmirante" },
        { cod: "CA", desc: "Contraalmirante" }, { cod: "CN", desc: "Capitán de Navío" },
        { cod: "CF", desc: "Capitán de Fragata" }, { cod: "CC", desc: "Capitán de Corbeta" },
        { cod: "TN", desc: "Teniente de Navío" }, { cod: "AN", desc: "Alférez de Navío" },
        { cod: "AF", desc: "Alférez de Fragata" }, { cod: "COR", desc: "Coronel" },
        { cod: "TCOL", desc: "Teniente Coronel" }, { cod: "CTE", desc: "Comandante" },
        { cod: "CPN", desc: "Capitán" }, { cod: "TTE", desc: "Teniente" },
        { cod: "ALF", desc: "Alférez" }, { cod: "SBMY", desc: "Suboficial Mayor" },
        { cod: "STTE", desc: "Subteniente" }, { cod: "BG", desc: "Brigada" },
        { cod: "SGT1", desc: "Sargento Primero" }, { cod: "SGT", desc: "Sargento" },
        { cod: "CBMY", desc: "Cabo Mayor" }, { cod: "CB1", desc: "Cabo Primero" },
        { cod: "CBO", desc: "Cabo" }, { cod: "MRO", desc: "Marinero" }
    ],

    // Tabla: escalas
    tEsc: [
        { cod: "EOF", desc: "Escala de Oficiales" },
        { cod: "EBT", desc: "Escala de Suboficiales" },
        { cod: "ETM", desc: "Escala de Tropa y Marinería" }
    ],

    // Tabla: cuerpos
    tCue: [
        { cod: "CGA", desc: "Cuerpo General de la Armada" },
        { cod: "CIM", desc: "Cuerpo de Infantería de Marina" },
        { cod: "CINA", desc: "Cuerpo de Ingenieros de la Armada" },
        { cod: "CINT", desc: "Cuerpo de Intendencia de la Armada" },
        { cod: "CCOM", desc: "Cuerpos Comunes" },
        { cod: "CMUS", desc: "Cuerpo de Músicas Militares" }
    ],

    // Tabla: ec (Especialidades Complementarias - ECOM)
    tEcom: [
        { cod: "E2TLG", desc: "Tecnologías de la Información y Comunicaciones" },
        { cod: "E2TRH", desc: "Gestión de Recursos Humanos" },
        { cod: "E2SINF", desc: "Seguridad de la Información (Ciberseguridad)" },
        { cod: "E2ABAST", desc: "Abastecimiento y Logística" },
        { cod: "E2COM", desc: "Comunicaciones Navales" },
        { cod: "E2NAV", desc: "Navegación y Derrota" },
        { cod: "E2ART", desc: "Artillería y Sistemas de Armas" },
        { cod: "E2CAE", desc: "Control de Aeronaves" },
        { cod: "E2OES", desc: "Operaciones Especiales" },
        { cod: "E2HID", desc: "Hidrografía" },
        { cod: "E2INT", desc: "Inteligencia Militar" },
        { cod: "E2NBQ", desc: "Defensa Nuclear, Biológica y Química" },
        { cod: "E2SUB", desc: "Submarinos" },
        { cod: "E2VUE", desc: "Vuelo" }
    ],

    // Tabla: ec (Especialidades Fundamentales)
    tEspFun: [
        { cod: "SIST", desc: "Sistemas" },
        { cod: "MAN", desc: "Maniobra y Navegación" },
        { cod: "ADM", desc: "Administración" },
        { cod: "OPER", desc: "Operaciones" },
        { cod: "ENG", desc: "Energía y Propulsión" },
        { cod: "HOST", desc: "Hostelería" },
        { cod: "MUS", desc: "Música" },
        { cod: "INF", desc: "Infantería" },
        { cod: "TAP", desc: "Tecnologías de Apoyo" }
    ],

    // Tabla: ec (Títulos / Titulaciones)
    tTit: [
        { cod: "ING-NAV", desc: "Grado en Ingeniería Naval y Oceánica" },
        { cod: "DER", desc: "Grado en Derecho" },
        { cod: "CIB-MAS", desc: "Máster en Ciberseguridad" },
        { cod: "PIL-AER", desc: "Título Piloto de Aeronaves" },
        { cod: "DIP-EM", desc: "Diplomado en Estado Mayor" },
        { cod: "MED", desc: "Grado en Medicina" },
        { cod: "ENF", desc: "Grado en Enfermería" },
        { cod: "LOG-MAS", desc: "Máster en Logística Integral" },
        { cod: "GAP", desc: "Grado en Gestión y Administración Pública" }
    ],

    // Tabla: aptitudes
    tApt: [
        { cod: "AERM", desc: "Aeronaves de Ala Móvil" }, { cod: "AERO", desc: "Aeronáutica" },
        { cod: "AMF", desc: "Operaciones Anfibias" }, { cod: "ART", desc: "Artillería y Misiles" },
        { cod: "CIB", desc: "Ciberseguridad" }, { cod: "COM", desc: "Comunicaciones Navales" },
        { cod: "DEE", desc: "Desactivación de Explosivos (EOD)" }, { cod: "HID", desc: "Hidrografía" },
        { cod: "OES", desc: "Operaciones Especiales" }, { cod: "PAR", desc: "Paracaidismo" },
        { cod: "BUC", desc: "Buceador" }, { cod: "SINF", desc: "Seguridad de la Información" }
    ],

    // Tabla: carnet_conducir
    tCar: [
        { cod: "A", desc: "Motocicletas" }, { cod: "B", desc: "Turismos y vehículos ligeros" },
        { cod: "C", desc: "Camiones pesados" }, { cod: "D", desc: "Autobuses" },
        { cod: "VAM", desc: "Vehículo de Alta Movilidad (VAMTAC)" },
        { cod: "PIR", desc: "Vehículo Blindado Piraña" }, { cod: "LINX", desc: "Vehículo Lince (LMV)" }
    ],

    // Tabla: idiomas (ISO/SLP Standard)
    tIdio: [
        { cod: "ING", desc: "Inglés" }, { cod: "FRA", desc: "Francés" },
        { cod: "ALE", desc: "Alemán" }, { cod: "ITA", desc: "Italiano" },
        { cod: "POR", desc: "Portugués" }, { cod: "ARA", desc: "Árabe" }
    ],

    // Tabla: areas_experiencia
	tExp: [
        { cod: "AD", desc: "Apoyo a la Alta Dirección (CGA y CIM)" },
        { cod: "ADM", desc: "Administración (CGA y CIM)" },
        { cod: "APR", desc: "Aprovisionamiento (CINA)" },
        { cod: "ARA", desc: "Artillería (CIM)" },
        { cod: "AVT", desc: "AVP (CGA y CIM)" },
        { cod: "BUC", desc: "Buceo (CGA)" },
        { cod: "CIBER", desc: "Ciber (CGA y CIM)" },
        { cod: "CMP", desc: "Capacidades militares y programas (CGA, CIM y CIA)" },
        { cod: "CYP", desc: "Contratación y presupuestos (CINA)" },
        { cod: "ENZ", desc: "Enseñanza (CGA y CIM)" },
        { cod: "ESUP", desc: "Estudios Superiores (CGA)" },
        { cod: "FZA2", desc: "Fuerza en Segundo Tramo (CGA y CIM)" },
        { cod: "HID", desc: "Hidrografía (CGA)" },
        { cod: "INF", desc: "Infraestructuras (CGA, CIM y CIA)" },
        { cod: "INTAL", desc: "Inteligencia (CGA y CIM)" },
        { cod: "MAN", desc: "Mando (CGA y CIM)" },
        { cod: "NES", desc: "Organismos Internacionales (CGA y CIM)" },
        { cod: "OAE", desc: "Organización (CGA y CIM)" },
        { cod: "OE", desc: "Operaciones Especiales (CGA y CIM)" },
        { cod: "PER", desc: "Personal (CGA y CIM)" },
        { cod: "PLA", desc: "Planeamiento (CGA y CIM)" },
        { cod: "PRL", desc: "Prevención Riesgos Laborales" },
        { cod: "SEG", desc: "Seguridad (CIM)" },
        { cod: "SOS", desc: "Sostenimiento (CGA, CIM y CIA)" },
        { cod: "SUB", desc: "Submarinos (CGA)" },
        { cod: "TCI", desc: "TCI (CGA y CIM)" }
    ],

    // Tabla: competencias (Extraído de áreas de impacto vinculadas)
	tComp: [
			{ cod: "INE", desc: "Integridad y Ejemplaridad" },
			{ cod: "CCM", desc: "Compromiso con la Misión" },
			{ cod: "LID", desc: "Liderazgo de Equipos" },
			{ cod: "CAD", desc: "Capacidad de Decisión" },
			{ cod: "MEN", desc: "Mentoria" },
			{ cod: "HUM", desc: "Humanidad" },
			{ cod: "COM", desc: "Comunicación" },
			{ cod: "VES", desc: "Visión Estratégica" },
			{ cod: "ORC", desc: "Organización y Coordinación" },
			{ cod: "POB", desc: "Planificación de Objetivos" },
			{ cod: "INC", desc: "Iniciativa y Creatividad" },
			{ cod: "CEX", desc: "Conocimiento Experto" },
			{ cod: "REE", desc: "Rigor en la Ejecución" }
		]
	
	// js/maestras.js - Versión Ampliada con 20+ registros del CSV
};

// js/maestras.js

window.DDBB_PUESTOS_PILOTO = {
    "4": {
        codigo_busqueda: "4", nombre: "AJEMA-GABINETE", ciu: "60110017", unor: "1200000", localidad: "MADRID", provincia: "MADRID", organica: "", rpt: "6B080 001", pto_des: "6B250 001", empleo: "CN-COR-CF-TCOL", cuerpo: "CG-IM", escala: "EOF", esp_fun: "", csce: "24", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "65700", funcion: "DIRECTOR DE COMUNICACION DE LA ARMADA Y JEFE LA OCS", observ: "H21", asig: "LD", cond_asc: "C", situacion: "AA", areas_experiencia: "AD-OAE", competencias_preferentes: "INE-VES-REE", d: "B2", t4: "", t5: "NO", t7: "NO", t8: "NO", t9: "SI", cde: "1-2"
    },
    "7226": {
        codigo_busqueda: "7226", nombre: "ORG.HIST.CULT.NAVAL", ciu: "60300136", unor: "1400000", localidad: "MADRID", provincia: "MADRID", organica: "6B075 001", rpt: "", pto_des: "", empleo: "CN-COR-CF-TCOL", cuerpo: "CCP", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60490", funcion: "SECRETARIO", observ: "034 508", asig: "LD", cond_asc: "Z", situacion: "D", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "7227": {
        codigo_busqueda: "7227", nombre: "ORG.HIST.CULT.NAVAL", ciu: "60300136", unor: "1400000", localidad: "MADRID", provincia: "MADRID", organica: "6B075 002", rpt: "", pto_des: "", empleo: "CN-COR-CF-TCOL", cuerpo: "CCP", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "61021", funcion: "JEFE SECCION DE BIBLIOTECAS", observ: "034 508", asig: "LD", cond_asc: "Z", situacion: "D", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "7232": {
        codigo_busqueda: "7232", nombre: "ORG.HIST.CULT.NAVAL", ciu: "60300136", unor: "1400000", localidad: "MADRID", provincia: "MADRID", organica: "6B075 003", rpt: "", pto_des: "", empleo: "CN-COR-CF-TCOL", cuerpo: "CCP", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "61019", funcion: "JEFE SECCION DE ARCHIVOS", observ: "034 508", asig: "LD", cond_asc: "Z", situacion: "D", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "17604": {
        codigo_busqueda: "17604", nombre: "ORG.HIST.CULT.NAVAL", ciu: "60300136", unor: "1400000", localidad: "MADRID", provincia: "MADRID", organica: "6B055 001", rpt: "", pto_des: "", empleo: "CN-COR-CF-TCOL", cuerpo: "CCP", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60498", funcion: "JEFE SECCION DE MUSEOS", observ: "034 508", asig: "LD", cond_asc: "Z", situacion: "D", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "21114": {
        codigo_busqueda: "21114", nombre: "DIASPER", ciu: "63410045", unor: "3150000", localidad: "MADRID", provincia: "MADRID", organica: "", rpt: "6B075 004", pto_des: "6B060 001", empleo: "CN-COR-CF-TCOL", cuerpo: "CCP", escala: "EOF", esp_fun: "", csce: "24", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "64104", funcion: "JEFE SECCION DE PUBLICACIONES", observ: "014 075", asig: "LD", cond_asc: "C", situacion: "AA", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "21981": {
        codigo_busqueda: "21981", nombre: "DIASPER", ciu: "63410045", unor: "3150000", localidad: "MADRID", provincia: "MADRID", organica: "", rpt: "6B075 005", pto_des: "6B060 002", empleo: "CN-COR-CF-TCOL", cuerpo: "CCP", escala: "EOF", esp_fun: "", csce: "24", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "64101", funcion: "JEFE SECCION AYUDAS ECONOMICAS", observ: "014 387", asig: "LD", cond_asc: "C", situacion: "AA", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "21982": {
        codigo_busqueda: "21982", nombre: "DIASPER", ciu: "63410045", unor: "3150000", localidad: "MADRID", provincia: "MADRID", organica: "", rpt: "6B075 006", pto_des: "6B060 006MA", empleo: "CN-COR-CF-TCOL", cuerpo: "CCP", escala: "EOF", esp_fun: "", csce: "24", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "66030", funcion: "JEFE SECCION DE RESIDENCIAS", observ: "14", asig: "LD", cond_asc: "C", situacion: "O", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "22460": {
        codigo_busqueda: "22460", nombre: "DISOS", ciu: "64823131", unor: "3260000", localidad: "MADRID", provincia: "MADRID", organica: "", rpt: "6B085 001", pto_des: "6B100 001MA", empleo: "CN-COR-CF-TCOL", cuerpo: "CG-IM-INT", escala: "EOF", esp_fun: "TCI(I) TI(I)", csce: "24", ec: "TCI(I) TI(I)", tit_dipl: "TCI(I) TI(I)", apt: "COM CIB", idioma: "", curso: "", cod_fun: "66263", funcion: "JEFE SECCION TECNICA DE APLICACIONES LOGISTICAS", observ: "034 321 857 H21", asig: "LD", cond_asc: "C", situacion: "V", areas_experiencia: "TCI-SOS", competencias_preferentes: "ORC-POB-REE", d: "B2", t4: "", t5: "NO", t7: "NO", t8: "NO", t9: "SI", cde: "1"
    },
    "22914": {
        codigo_busqueda: "22914", nombre: "ARFER", ciu: "65112015", unor: "5000000", localidad: "FERROL", provincia: "A CORUÑA", organica: "6B075 007", rpt: "", pto_des: "", empleo: "CF", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60400", funcion: "COMANDANTE", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "22055": {
        codigo_busqueda: "22055", nombre: "COLEGIO JUAN SEBASTIÁN ELCANO", ciu: "62210064", unor: "2200000", localidad: "PONTEVEDRA", provincia: "PONTEVEDRA", organica: "6B040 001", rpt: "", pto_des: "", empleo: "CF", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "65700", funcion: "DIRECTOR", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Requiere curso de mando.", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "22917": {
        codigo_busqueda: "22917", nombre: "ARFER", ciu: "65112015", unor: "5000000", localidad: "FERROL", provincia: "A CORUÑA", organica: "6B080 002", rpt: "", pto_des: "", empleo: "CF", cuerpo: "CGA", escala: "EOF", esp_fun: "JIN", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "61400", funcion: "JEFE SECCION MANTENIMIENTO", observ: "LDCV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Especialidad Energía", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "22918": {
        codigo_busqueda: "22918", nombre: "ARFER", ciu: "65112015", unor: "5000000", localidad: "FERROL", provincia: "A CORUÑA", organica: "6B080 003", rpt: "", pto_des: "", empleo: "CF", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60515", funcion: "AYUDANTE MAYOR", observ: "LDCV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Servicios Generales", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "22919": {
        codigo_busqueda: "22919", nombre: "ARFER", ciu: "65112015", unor: "5000000", localidad: "FERROL", provincia: "A CORUÑA", organica: "6B080 004", rpt: "", pto_des: "", empleo: "CF", cuerpo: "CGA", escala: "EOF", esp_fun: "OAJ", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60490", funcion: "SECRETARIO", observ: "LDCV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Gestión Administrativa", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "22928": {
        codigo_busqueda: "22928", nombre: "ARFER", ciu: "65112015", unor: "5000000", localidad: "FERROL", provincia: "A CORUÑA", organica: "6B085 002", rpt: "", pto_des: "", empleo: "CF-ING", cuerpo: "CINA", escala: "EOF", esp_fun: "JMAN", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "62601", funcion: "JEFE RAMO PLATAFORMA", observ: "LDCV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Ingeniería Naval", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "22939": {
        codigo_busqueda: "22939", nombre: "ARFER", ciu: "65112015", unor: "5000000", localidad: "FERROL", provincia: "A CORUÑA", organica: "6B085 003", rpt: "", pto_des: "", empleo: "CF-CC", cuerpo: "CCP", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "66263", funcion: "JEFE GRUPO APOYO SOST.", observ: "LDCV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Logística", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "23718": {
        codigo_busqueda: "23718", nombre: "ARFER", ciu: "65112015", unor: "5000000", localidad: "SAN FERNANDO", provincia: "CADIZ", organica: "6B085 004", rpt: "", pto_des: "", empleo: "TCOL", cuerpo: "IM", escala: "EOF", esp_fun: "JAP", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "66266", funcion: "JEFE SERV. REPUESTOS", observ: "LDCV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Infantería de Marina", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "26458": {
        codigo_busqueda: "26458", nombre: "AJEMA-GABINETE", ciu: "60110017", unor: "1200000", localidad: "MADRID", provincia: "MADRID", organica: "6B075 008", rpt: "", pto_des: "", empleo: "COR", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60533", funcion: "ASESOR", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Gabinete Técnico", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "26460": {
        codigo_busqueda: "26460", nombre: "AJEMA-GABINETE", ciu: "60110017", unor: "1200000", localidad: "MADRID", provincia: "MADRID", organica: "6B080 005", rpt: "", pto_des: "", empleo: "TCOL", cuerpo: "IM", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "61405", funcion: "JEFE SECCIÓN DOCTRINA", observ: "LDDV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Cursos Altos Estudios", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "26547": {
        codigo_busqueda: "26547", nombre: "ARFER", ciu: "65112015", unor: "5000000", localidad: "CARTAGENA", provincia: "MURCIA", organica: "6B085 005", rpt: "", pto_des: "", empleo: "TCOL", cuerpo: "INT", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "63001", funcion: "JEFE UNIDAD GESTION ECONOMICA", observ: "LDDV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Intendencia", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "27158": {
        codigo_busqueda: "27158", nombre: "ARFER", ciu: "65112015", unor: "5000000", localidad: "CARTAGENA", provincia: "MURCIA", organica: "6B085 006", rpt: "", pto_des: "", empleo: "CF-ING", cuerpo: "CINA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "62615", funcion: "JEFE SECCIÓN CONSTRUCCIONES", observ: "LDCV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Mantenimiento Obras", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "30473": {
        codigo_busqueda: "30473", nombre: "CBA", ciu: "62312061", unor: "2230000", localidad: "CARTAGENA", provincia: "MURCIA", organica: "6B070 001", rpt: "", pto_des: "", empleo: "CN", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "65700", funcion: "COMANDANTE CBA", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "Centro Buceo Armada", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "30474": {
        codigo_busqueda: "30474", nombre: "CBA", ciu: "62312061", unor: "2230000", localidad: "CARTAGENA", provincia: "MURCIA", organica: "6B070 002", rpt: "", pto_des: "", empleo: "CF", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60401", funcion: "2º COMANDANTE", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "30475": {
        codigo_busqueda: "30475", nombre: "CBA", ciu: "62312061", unor: "2230000", localidad: "CARTAGENA", provincia: "MURCIA", organica: "6B070 003", rpt: "", pto_des: "", empleo: "CF-CC", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "64104", funcion: "JEFE ESTUDIOS", observ: "LDCV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "30476": {
        codigo_busqueda: "30476", nombre: "CBA", ciu: "62312061", unor: "2230000", localidad: "CARTAGENA", provincia: "MURCIA", organica: "6B070 004", rpt: "", pto_des: "", empleo: "CF-CC", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60515", funcion: "AYUDANTE MAYOR", observ: "LDCV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "20101": {
        codigo_busqueda: "20101", nombre: "ESTADO MAYOR ARMADA", ciu: "60110001", unor: "1100000", localidad: "MADRID", provincia: "MADRID", organica: "6B010 001", rpt: "", pto_des: "", empleo: "CN", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60533", funcion: "ASESOR AJEMA", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "20102": {
        codigo_busqueda: "20102", nombre: "ESTADO MAYOR ARMADA", ciu: "60110001", unor: "1100000", localidad: "MADRID", provincia: "MADRID", organica: "6B010 002", rpt: "", pto_des: "", empleo: "CN", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60490", funcion: "SECRETARIO GENERAL", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "20103": {
        codigo_busqueda: "20103", nombre: "ESTADO MAYOR ARMADA", ciu: "60110001", unor: "1100000", localidad: "MADRID", provincia: "MADRID", organica: "6B015 001", rpt: "", pto_des: "", empleo: "CN", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60405", funcion: "JEFE DIVISION PLANES", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "20104": {
        codigo_busqueda: "20104", nombre: "ESTADO MAYOR ARMADA", ciu: "60110001", unor: "1100000", localidad: "MADRID", provincia: "MADRID", organica: "6B015 002", rpt: "", pto_des: "", empleo: "CN", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60405", funcion: "JEFE DIVISION OPERACIONES", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "20105": {
        codigo_busqueda: "20105", nombre: "ESTADO MAYOR ARMADA", ciu: "60110001", unor: "1100000", localidad: "MADRID", provincia: "MADRID", organica: "6B015 003", rpt: "", pto_des: "", empleo: "CN", cuerpo: "CGA", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60405", funcion: "JEFE DIVISION LOGISTICA", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "21001": {
        codigo_busqueda: "21001", nombre: "COMANDANCIA GENERAL IM", ciu: "63420001", unor: "3200000", localidad: "SAN FERNANDO", provincia: "CADIZ", organica: "6B020 001", rpt: "", pto_des: "", empleo: "COR", cuerpo: "IM", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60401", funcion: "SEGUNDO COMANDANTE", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    },
    "21002": {
        codigo_busqueda: "21002", nombre: "COMANDANCIA GENERAL IM", ciu: "63420001", unor: "3200000", localidad: "SAN FERNANDO", provincia: "CADIZ", organica: "6B020 002", rpt: "", pto_des: "", empleo: "COR", cuerpo: "IM", escala: "EOF", esp_fun: "", csce: "", ec: "", tit_dipl: "", apt: "", idioma: "", curso: "", cod_fun: "60490", funcion: "JEFE ESTADO MAYOR", observ: "LDZV", asig: "LD", cond_asc: "Z", situacion: "V", areas_experiencia: "", competencias_preferentes: "", d: "", t4: "", t5: "", t7: "", t8: "", t9: "", cde: ""
    }
};

const SOLICITANTES_DATA = [
    {
        id: 1,
        nombre: "CANDIDATO A",
        empleo: "Capitán de Navío",
        cuerpo: "CGA",
        perfil: "Especialista en CIS y sistemas de información operativos.",
        formacion: ["EMFAS", "E2TTC", "E2TLG"],
        ecom: ["TCI", "TI", "IN"],
        aptitudes: ["INF", "COM", "OSY"],
        destinos: [
            { periodo: "2023-Actualidad", unidad: "EMA-SEGEMAR", cargo: "Jefe Sección Tecnologías Información y Telecomunicaciones" },
            { periodo: "2020-2023", unidad: "FLOTA – Cuartel General", cargo: "Jefe Sección CIS / N6" },
            { periodo: "2017-2020", unidad: "JECIS – SEGINFO", cargo: "Jefe" },
            { periodo: "2014-2017", unidad: "Fragata Álvaro de Bazán", cargo: "Segundo Comandante (CC)" }
        ]
    },
    {
        id: 2,
        nombre: "CANDIDATO B",
        empleo: "Coronel",
        cuerpo: "CIM",
        perfil: "Experiencia en mando operativo y planificación logística en operaciones anfibias.",
        formacion: ["EMFAS", "DATP"],
        ecom: ["IMOP", "IN"],
        aptitudes: ["AMF", "MAN", "SEG"],
        destinos: [
            { periodo: "2023-Actualidad", unidad: "TEAR – Estado Mayor", cargo: "Jefe de Operaciones" },
            { periodo: "2020-2023", unidad: "TERSUR", cargo: "Comandante" },
            { periodo: "2017-2020", unidad: "Brigada de Infantería de Marina", cargo: "Segundo Comandante y Jefe PLM" },
            { periodo: "2014-2017", unidad: "Batallón de Desembarco", cargo: "Comandante de Batallón (TCOL)" }
        ]
    },
    {
        id: 3,
        nombre: "CANDIDATO C",
        empleo: "Capitán de Fragata",
        cuerpo: "CGA",
        perfil: "Perfil tecnológico-logístico, muy alineado con el puesto DISOS.",
        formacion: ["EMFAS", "E2TLG"],
        ecom: ["TI", "TCI"],
        aptitudes: ["INF", "COM", "OSY"],
        destinos: [
            { periodo: "2023-Actualidad", unidad: "EMA-DIVLOG", cargo: "Sección Programas y Ciclo de Vida" },
            { periodo: "2020-2023", unidad: "JECIS – GRUCECIS", cargo: "Jefe Oficina Técnica" },
            { periodo: "2017-2020", unidad: "Fragata Méndez Núñez", cargo: "Segundo Comandante" },
            { periodo: "2014-2017", unidad: "Fragata Santa María", cargo: "Jefe Servicio Sistema de Combate (CC)" }
        ]
    },
    {
        id: 4,
        nombre: "CANDIDATO D",
        empleo: "Teniente Coronel",
        cuerpo: "CINA",
        perfil: "Especialista en logística y gestión de recursos.",
        formacion: ["EMFAS", "E2TLG", "E2TGE"],
        ecom: ["LG", "TI"],
        aptitudes: ["ALM", "PER"],
        destinos: [
            { periodo: "2023-Actualidad", unidad: "EMA-DIVLOG", cargo: "Sección Infraestructura" },
            { periodo: "2020-2023", unidad: "Cuartel General FIM", cargo: "Jefe Sección Logística N4" },
            { periodo: "2017-2020", unidad: "ENM – Departamento Logística", cargo: "Profesor" },
            { periodo: "2014-2017", unidad: "Arsenal de Cartagena", cargo: "Jefe Área Abastecimiento (COM)" }
        ]
    }
];