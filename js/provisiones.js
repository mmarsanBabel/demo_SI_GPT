/**
 * PROVISIONES.JS - Versión Final Optimizada
 */

// 1. LÓGICA DE ACORDEONES (Global)
window.toggleAcc = function(el) {
    const item = el.parentElement;
    item.classList.toggle('active');
};

const CONFIG_UI_PROV = {
    'group-esc-cue': [
        { id: 'tEmp', title: 'EMPLEOS ADMITIDOS', label: 'Empleo' },
        { id: 'tEsc', title: 'ESCALAS ADMITIDAS', label: 'Escala' },
        { id: 'tCue', title: 'CUERPOS ADMITIDOS', label: 'Cuerpo' }
    ],
    'group-conocimientos': [
        { id: 'tTit', title: 'TÍTULOS', label: 'Título' },
        { id: 'tApt', title: 'APTITUDES', label: 'Aptitud' },
        { id: 'tEcom', title: 'ECOM', label: 'Ecom' },
        { id: 'tEspFun', title: 'ESP. FUNDAMENTAL', label: 'Esp. Fundamental' },
        { id: 'tIdio', title: 'IDIOMAS', label: 'Idioma' },
        { id: 'tCar', title: 'CARNET', label: 'Carnet' }
    ],
    'group-expertis': [
        { id: 'tComp', title: 'COMPETENCIAS', label: 'Competencia' },
        { id: 'tExp', title: 'ÁREAS DE EXPERIENCIA', label: 'Área' }
    ]
};

// 2. INICIALIZACIÓN SEGURA
document.addEventListener('DOMContentLoaded', () => {
    // Si MAESTRAS no existe en window, intentamos buscarla como variable global
    if (!window.MAESTRAS && typeof MAESTRAS !== 'undefined') {
        window.MAESTRAS = MAESTRAS;
    }
    
    renderProvisiones();
});

function renderProvisiones() {
    Object.entries(CONFIG_UI_PROV).forEach(([containerId, tablas]) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = ""; // Limpiar para evitar duplicados

        tablas.forEach(t => {
            const isExp = t.id === 'tExp';
            const html = `
                <div class="section-title">
                    ${t.title} 
					<button type="button" class="btn-add" onclick="addRow('${t.id}', '${t.label}')">
						<i class="fas fa-plus"></i> AÑADIR
					</button>
                </div>
                <table class="rel-table" id="${t.id}">
                    <thead>
                        <tr>
                            <th>Seleccionar ${t.label} (Cód - Desc)</th>
                            <th style="width:140px">Tipo</th>
                            <th style="width:90px">${isExp ? 'Meses' : 'Pond.'}</th>
                            ${isExp ? '<th style="width:70px">Pts/M</th>' : ''}
                            <th style="width:50px"></th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>`;
            container.insertAdjacentHTML('beforeend', html);
        });
    });
}

// 3. GESTIÓN DE FILAS (Globales para que el HTML las vea)
window.addRow = function(tableId, label, codSel = "", tipoDef = "E") {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    const isExp = tableId === 'tExp';
    
    // Fallback: Si no hay maestras, usamos un array vacío para no romper el código
    const opciones = (window.MAESTRAS && window.MAESTRAS[tableId]) ? window.MAESTRAS[tableId] : [];

    let optionsHTML = `<option value="">-- Seleccione ${label} --</option>`;
    opciones.forEach(o => {
        const selected = o.cod === codSel ? 'selected' : '';
        optionsHTML += `<option value="${o.cod}" ${selected}>${o.cod} - ${o.desc}</option>`;
    });

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><select class="input-cell" onchange="validarTipoUno(this); updateAgg();">${optionsHTML}</select></td>
        <td>
            <select class="input-cell" onchange="validarTipoUno(this); updateAgg();">
                <option value="E" ${tipoDef === 'E' ? 'selected' : ''}>Exigible (E)</option>
                <option value="F" ${tipoDef === 'F' ? 'selected' : ''}>Preferente (F)</option>
                <option value="I" ${tipoDef === 'I' ? 'selected' : ''}>Indiferente (I)</option>
                <option value="1" ${tipoDef === '1' ? 'selected' : ''}>Anotación Obs (1)</option>
            </select>
        </td>
        <td><input type="number" step="0.01" class="input-cell" value="${isExp ? 24 : 1.0}" oninput="updateAgg()"></td>
        ${isExp ? '<td><input type="number" step="0.01" class="input-cell" value="0.10" oninput="updateAgg()"></td>' : ''}
		<td style="text-align:center">
			<button type="button" class="btn-delete" onclick="this.closest('tr').remove(); updateAgg();">
				<i class="fas fa-trash"></i> BORRAR
			</button>
		</td>
    `;
    tbody.appendChild(tr);
    updateAgg();
}

window.validarTipoUno = function(el) {
    const row = el.closest('tr');
    const selectCod = row.cells[0].querySelector('select');
    const selectTipo = row.cells[1].querySelector('select');

    if (selectTipo.value === "1" && selectCod.value !== "") {
        const textoCompleto = selectCod.selectedOptions[0].text;
        addObsRow(textoCompleto);
        row.remove();
        updateAgg();
    }
}

window.addObsRow = function(texto = "") {
    const tbody = document.querySelector("#tObs tbody");
    if (!tbody) return;
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" class="input-cell" value="${texto}" oninput="updateAgg()"></td>
        <td style="text-align:center">
            <button type="button" class="btn-delete" onclick="this.closest('tr').remove(); updateAgg();"><i class="fas fa-times"></i></button>
        </td>
    `;
    tbody.appendChild(tr);
    updateAgg();
}

window.updateAgg = function() {
    const ids = ['tEmp', 'tEsc', 'tCue', 'tTit', 'tApt', 'tEcom', 'tEspFun', 'tIdio', 'tCar', 'tComp', 'tExp'];
    
    // 1. Actualizar los resúmenes de las tablas normales (se mantiene igual)
    ids.forEach(id => {
        const filas = document.querySelectorAll(`#${id} tbody tr`);
        const res = Array.from(filas).map(f => {
            const c = f.cells[0].querySelector('select').value;
            const t = f.cells[1].querySelector('select').value;
            return c ? `${c} (${t})` : null;
        }).filter(x => x).join(' - ');
        
        const target = document.getElementById(`agg-${id}`);
        if (target) target.value = res;
    });

    // 2. CAMBIO AQUÍ: Resumen de Observaciones (Solo códigos)
    const obsRows = document.querySelectorAll("#tObs tbody tr");
    const codigosObs = Array.from(obsRows).map(f => {
        const textoCompleto = f.cells[0].querySelector('input').value;
        // Extraemos solo lo que hay antes del primer guion (el código)
        // Ejemplo: "ALF - Alférez" -> "ALF"
        return textoCompleto.split(' - ')[0].trim();
    }).filter(x => x !== ""); // Filtramos campos vacíos

    const targetObs = document.getElementById('agg-obs');
    if (targetObs) {
        targetObs.value = codigosObs.join(' - ');
    }
}

function seleccionarProvision(ciu, unor, funcion) {
    // Construimos la URL con los parámetros
    const urlEdicion = `mantenimiento_vacantes.html?ciu=${ciu}&unor=${encodeURIComponent(unor)}&funcion=${encodeURIComponent(funcion)}`;
    
    // IMPORTANTE: Accedemos al padre (parent) para cambiar el src del frame
    if (window.parent && window.parent.navegarA) {
        window.parent.navegarA(urlEdicion);
    } else {
        // Por si se abre sola, que navegue normalmente
        window.location.href = urlEdicion;
    }
}