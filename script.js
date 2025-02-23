let hojas = {};

// Cargar las hojas desde data.json
async function cargarHojas() {
    const response = await fetch('data.json');
    hojas = await response.json();

    const selector = document.getElementById('docentes');
    selector.innerHTML = '';

    for (const [nombre, _] of Object.entries(hojas)) {
        const option = document.createElement('option');
        option.value = nombre;
        option.textContent = nombre;
        selector.appendChild(option);
    }

    if (Object.keys(hojas).length > 0) {
        cargarDatos();
    }
}

// Cargar datos desde el CSV
async function cargarDatos() {
    const docente = document.getElementById('docentes').value;
    const csvUrl = hojas[docente];

    const response = await fetch(csvUrl);
    const csvText = await response.text();

    const datos = parseCSV(csvText);
    llenarTabla(datos);
}

// Parsear el CSV a matriz
function parseCSV(texto) {
    return texto.trim().split('\n').map(fila => fila.split(','));
}

// Llenar la tabla
function llenarTabla(datos) {
    const tabla = document.getElementById('tabla-horario');
    tabla.innerHTML = '';

    // Encabezados
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    datos[0].forEach(titulo => {
        const th = document.createElement('th');
        th.textContent = titulo || '';
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    // Cuerpo de la tabla
    const tbody = document.createElement('tbody');
    datos.slice(1).forEach(fila => {
        const tr = document.createElement('tr');
        fila.forEach(celda => {
            const td = document.createElement('td');
            td.textContent = celda.trim() || '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    tabla.appendChild(tbody);
}

// Iniciar
window.onload = cargarHojas;
