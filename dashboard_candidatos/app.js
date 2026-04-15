	// Datos de ejemplo simulando la base de datos
//const candidatos = [
//    { nombre: "Candidato A (CF/CGA)", cae: 1.0, iit: 160, igc_base: 8.5, fac_val: 1.2, alineamiento: 1.05, file: "informe Tecnico IGC - Candidato A.pdf" },
//   { nombre: "Candidato B (CN/CGA)", cae: 0.9, iit: 145, igc_base: 8.0, fac_val: 1.1, alineamiento: 1.00, file: "informe Tecnico IGC - Candidato B.pdf" },
//    { nombre: "Candidato C (TCOL/IM)", cae: 0.9, iit: 110, igc_base: 9.0, fac_val: 1.2, alineamiento: 0.85, file: "informe Tecnico IGC - Candidato C.pdf" }
//    { nombre: "Candidato D (TCOL/CINA)", cae: 0.53, iit: 0,49, igc_base: 9.0, fac_val: 1.2, alineamiento: 0.85, file: "informe Tecnico IGC - Candidato D.pdf" }
//
//];

const candidatos = [
    { id: "Candidato A", perfil: "CN (CGA)", igc: 94.1, cae: 1.0, iit: 0.98, fan: 1.11, fproy: 1.16, fsin: 1.10, fesp: 1.05, file: "informe Tecnico IGC - Candidato A.pdf" },
    { id: "Candidato C", perfil: "CF (CGA)", igc: 86.6, cae: 0.85, iit: 0.93, fan: 1.11, fproy: 1.16, fsin: 1.10, fesp: 1.05, file: "informe Tecnico IGC - Candidato C.pdf" },
    { id: "Candidato D", perfil: "TCOL (CINA)", igc: 62.1, cae: 0.77, iit: 0.59, fan: 1.06, fproy: 1.01, fsin: 1.09, fesp: 1.00, file: "informe Tecnico IGC - Candidato D.pdf" },
    { id: "Candidato B", perfil: "COR (CIM)", igc: 54.7, cae: 0.85, iit: 0.22, fan: 1.03, fproy: 1.12, fsin: 1.03, fesp: 0.95, file: "informe Tecnico IGC - Candidato B.pdf" }
];

function renderizarDashboard() {
    const lista = document.getElementById('lista-candidatos');
    const alertas = document.getElementById('alertas-texto');
    lista.innerHTML = "";

    candidatos.forEach(c => {
        // APLICACIÓN DE LA FÓRMULA MAESTRA
        // IGC_Final = (Base * FAC * Alineamiento)
        const igc_final = (c.igc_base * c.fac_val * c.alineamiento).toFixed(2);
        
        // Nota Global (Ponderación: 20% CAE, 30% IIT (normalizado), 50% IGC)
        const nota_global = ((c.cae * 20) + ((c.iit/200)*30) + ((igc_final/12)*50)).toFixed(1);

        const colorNota = nota_global > 90 ? '#28a745' : '#ffc107';

        lista.innerHTML += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 15px; font-weight: bold;">${c.nombre}</td>
                <td style="padding: 15px;">${c.cae} <small>(Estructura)</small></td>
                <td style="padding: 15px;">${c.iit} <small>pts</small></td>
                <td style="padding: 15px;">${igc_final} <small>(FAC: ${c.fac_val})</small></td>
                <td style="padding: 15px; font-size: 1.2rem; font-weight: bold; color: ${colorNota};">${nota_global}</td>
                <td style="padding: 15px;">
                    <span style="padding: 4px 8px; border-radius: 4px; background: ${colorNota}22; color: ${colorNota}; font-size: 0.8rem; font-weight: bold;">
                        ${nota_global > 90 ? 'RECOMENDADO' : 'APTO'}
                    </span>
                </td>
            </tr>
        `;

        // Generar Alertas Semánticas dinámicas
        if (c.alineamiento < 0.9) {
            alertas.innerHTML += `<li style="margin-bottom: 8px;">⚠️ <b>${c.nombre}:</b> Brecha de autocrítica detectada (S1 vs S3).</li>`;
        }
    });
}

// Ejecutar al cargar
window.onload = renderizarDashboard;

async function generarPDFInforme() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const candidatoSet = candidatos[0]; // Ejemplo con el candidato con mayor nota

    // --- ENCABEZADO INSTITUCIONAL ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("ARMADA ESPAÑOLA - EVALUACIÓN DE IDONEIDAD", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Propuesta de Vacante: ID-4502 | Fecha: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });
    
    doc.line(20, 35, 190, 35); // Línea divisoria

    // --- DATOS DEL CANDIDATO ---
    doc.setFontSize(12);
    doc.text("1. DATOS DEL PROFESIONAL EVALUADO", 20, 45);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nombre: ${candidatoSet.nombre}`, 25, 52);
    doc.text(`Cuerpo/Escala: CGA / EOF`, 25, 57);

    // --- TABLA DE PUNTUACIONES ---
    doc.autoTable({
        startY: 65,
        head: [['Factor de Evaluación', 'Cálculo Aplicado', 'Puntuación']],
        body: [
            ['Ajuste Estructural (CAE)', 'Empleo, Cuerpo y Escala', candidatoSet.cae.toFixed(2)],
            ['Exp. Técnica (IIT)', 'Cursos + Curva del Olvido', `${candidatoSet.iit} pts`],
            ['Análisis de Comp. (FAC)', 'Secc 1 + Semántica', candidatoSet.fac_val.toFixed(2)],
            ['Nota de Competencias (IGC)', 'Evaluación 360° + Alineamiento', (candidatoSet.igc_base * candidatoSet.fac_val).toFixed(2)],
        ],
        theme: 'striped',
        headStyles: { fillStyle: [0, 68, 123] }
    });

    // --- CONCLUSIÓN SEMÁNTICA ---
    let finalY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text("2. RESUMEN EJECUTIVO Y ANÁLISIS DE RIESGOS", 20, finalY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const conclusion = `El candidato presenta una nota global sobresaliente. El Factor de Análisis de Competencias (FAC) de ${candidatoSet.fac_val} confirma una alineación total con los valores institucionales y el mando. La experiencia técnica acumulada (IIT) se encuentra plenamente vigente según la curva de recencia aplicada.`;
    
    const textLines = doc.splitTextToSize(conclusion, 170);
    doc.text(textLines, 20, finalY + 7);

    // --- FIRMAS ---
    doc.text("Firma del Responsable de Evaluación", 130, finalY + 50);
    doc.line(120, finalY + 45, 180, finalY + 45);

    // Guardar el archivo
    doc.save(`Informe_Idoneidad_${candidatoSet.nombre.replace(/ /g, "_")}.pdf`);
}

function selectCandidato(c, element) {
    // 1. Cambiar visibilidad de bloques
    document.getElementById('viewRanking').classList.add('hidden');
    document.getElementById('viewDetalle').classList.remove('hidden');

    // 2. Actualizar datos de texto
    document.getElementById('detName').innerText = c.id;
    document.getElementById('resRank').innerText = c.rank;
    document.getElementById('resIgc').innerText = c.igc;
    document.getElementById('linkIndividual').href = c.file;

    // 3. Actualizar tabla de auditoría
    document.getElementById('auditRows').innerHTML = `
        <tr>
            <td>${c.cae.toFixed(2)}</td><td>${c.iit.toFixed(2)}</td><td>${c.fan.toFixed(2)}</td>
            <td>${c.fproy.toFixed(2)}</td><td>${c.fsin.toFixed(2)}</td><td>${c.fesp.toFixed(2)}</td>
        </tr>`;
    
    document.getElementById('audDesc').innerText = c.igc > 85 
        ? "Perfil con alto índice de concordancia. Los vectores técnicos muestran una alineación óptima."
        : "Perfil por debajo del umbral de excelencia. Revisar brechas específicas.";

    // 4. Renderizar Radar Individual
    const ctxInd = document.getElementById('indRadar').getContext('2d');
    if(indRadar) indRadar.destroy();
    indRadar = new Chart(ctxInd, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Candidato', data: [c.cae, c.iit, c.fan, c.fproy, c.fsin, c.fesp], borderColor: '#e63946', backgroundColor: 'rgba(230, 57, 70, 0.2)', borderWidth: 4 },
                { label: 'Ideal', data: [1,1,1,1,1,1], borderColor: '#2d6a4f', borderDash: [5,5], fill: false }
            ]
        },
        options: { 
            maintainAspectRatio: false, 
            events: [], // Mantiene el clic para el PDF
            scales: { r: { min: 0, max: 1.2, ticks: { display: false } } } 
        }
    });
}

// Función para el botón "Volver"
function mostrarRanking() {
    document.getElementById('viewRanking').classList.remove('hidden');
    document.getElementById('viewDetalle').classList.add('hidden');
}