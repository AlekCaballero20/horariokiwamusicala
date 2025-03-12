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
    const tabla = document.getElementById('tabla-horario');
    tabla.innerHTML = '<tr><td colspan="100%">Cargando...</td></tr>';

    const docente = document.getElementById('docentes').value;
    const csvUrl = hojas[docente];

    const response = await fetch(csvUrl);
    const csvText = await response.text();

    const datos = parseCSV(csvText);
    llenarTabla(datos);
}

// Parsear el CSV a matriz
function parseCSV(texto) {
    let separador = texto.includes(";") ? ";" : ","; // Detecta si usa ; o ,
    return texto.trim().split("\n").map(fila => fila.split(separador));
}

// Llenar la tabla combinando celdas repetidas (thead con colspan, tbody con rowspan)
function llenarTabla(datos) {
    const tabla = document.getElementById('tabla-horario');
    tabla.innerHTML = '';

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    let referenciasHead = [];

    // Encabezados con colspan
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
    let referenciasBody = Array(datos[0].length).fill(null);

    // Procesar el cuerpo de la tabla combinando filas con rowspan
    datos.slice(1).forEach((fila, i) => {
        const tr = document.createElement('tr');

        fila.forEach((celda, j) => {
            let contenido = celda.trim();

            if (referenciasBody[j] && referenciasBody[j].textContent === contenido) {
                referenciasBody[j].rowSpan++;
            } else {
                if (referenciasBody[j]) {
                    referenciasBody[j] = null; // Reinicia la referencia si cambia el contenido
                }
                const td = document.createElement('td');
                td.textContent = contenido;
                tr.appendChild(td);
                referenciasBody[j] = td;
            }
        });

        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);
    aplicarColores();
}

function aplicarColores() {
    let celdas = document.querySelectorAll("#tabla-horario td");

    if (celdas.length === 0) return; // Si no hay celdas, salir

    celdas.forEach(celda => {
        let texto = celda.textContent.trim().toLowerCase();

        if (texto.includes("danzas")) {
            celda.style.backgroundColor = "#FFCDD2"; // Rojo claro
        } else if (texto.includes("teatro")) {
            celda.style.backgroundColor = "#C8E6C9"; // Verde claro
        } else if (texto.includes("dibujo")) {
            celda.style.backgroundColor = "#BBDEFB"; // Azul claro
        }
    });
}

// Iniciar
window.onload = cargarHojas;
