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

// Llenar la tabla combinando celdas repetidas (thead con colspan, tbody con rowspan)
function llenarTabla(datos) {
    const tabla = document.getElementById('tabla-horario');
    tabla.innerHTML = '';

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    let referenciasHead = [];

    // Procesar la primera fila (encabezado) combinando columnas con colspan
    datos[0].forEach((titulo, i) => {
        const contenido = titulo.trim();

        if (referenciasHead.length > 0 && referenciasHead[referenciasHead.length - 1].textContent === contenido) {
            referenciasHead[referenciasHead.length - 1].colSpan++;
        } else {
            const th = document.createElement('th');
            th.textContent = contenido || '';
            trHead.appendChild(th);
            referenciasHead.push(th);
        }
    });

    thead.appendChild(trHead);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    let referenciasBody = Array.from({ length: datos[0].length }, () => null);

    // Procesar el cuerpo de la tabla combinando filas con rowspan
    datos.slice(1).forEach((fila) => {
        const tr = document.createElement('tr');

        fila.forEach((celda, j) => {
            let contenido = celda.trim();

            if (referenciasBody[j] && referenciasBody[j].textContent === contenido) {
                referenciasBody[j].rowSpan++;
            } else {
                const td = document.createElement('td');
                td.textContent = contenido;
                tr.appendChild(td);
                referenciasBody[j] = td;
            }
        });

        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    
    // 🔥 Aplicar colores después de llenar la tabla
    aplicarColores();
}

// Iniciar
window.onload = cargarHojas;
