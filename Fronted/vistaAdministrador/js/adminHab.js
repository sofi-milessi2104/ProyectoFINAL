const API_BASE_URL = 'http://localhost/ProyectoFinal/Backend/routes/api.php?url=habitacion';

let modalHabitacion;

async function crudOperation(action, data = {}, successMsg, errorMsg) {
    try {
        // En este caso, para agregar/editar/eliminar, usamos JSON
        const respuesta = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...data })
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            console.error("Error HTTP:", errorText);
            alert(errorMsg + ` (HTTP ${respuesta.status})`);
            return false;
        }

        const resultado = await respuesta.json();
        console.log("Respuesta backend:", resultado);

        if (resultado.success) {
            alert(successMsg);
            return true;
        } else {
            alert(errorMsg + (resultado.message || 'Error desconocido.'));
            return false;
        }
    } catch (error) {
        console.error("Error en CRUD:", error);
        alert('Error de conexión con el servidor.');
        return false;
    }
}

// 1. FUNCIÓN CORREGIDA: Incluye 'disponible' y corrige colspan a 7.
async function cargarHabitaciones() {
    const tbody = document.getElementById("cuerpo-tabla-habitaciones");
    // Siete columnas: #, Tipo, Descripción, Precio, Imagen, Disponibles, Acciones
    const COLUMNS = 7; 
    tbody.innerHTML = `<tr><td colspan="${COLUMNS}" class="text-center">Cargando habitaciones...</td></tr>`; 

    try {
        const respuesta = await fetch(API_BASE_URL, { method: 'GET' });
        const data = await respuesta.json();
        console.log("Habitaciones obtenidas:", data);

        tbody.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${COLUMNS}" class="text-center">No hay tipos de habitación registrados.</td></tr>`; 
            return;
        }

        data.forEach(hab => {
            const fila = `
                <tr>
                    <th scope="row">${hab.id_hab}</th>
                    <td>${hab.tipo_hab}</td>
                    <td>${hab.descripcion_hab.substring(0, 50)}...</td>
                    <td>$${hab.precio}</td>
                    <td>${hab.imagen ? `<a href="${hab.imagen}" target="_blank">Ver</a>` : 'N/A'}</td>
                    <td>${hab.disponible}</td> <td>
                        <button class="btn btn-sm btn-warning editar-hab-btn" data-id="${hab.id_hab}">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger eliminar-hab-btn" data-id="${hab.id_hab}">
                            <i class="bi bi-trash-fill"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });

        agregarListenersHabitaciones();
    } catch (error) {
        console.error("Error al cargar habitaciones:", error);
        tbody.innerHTML = `<tr><td colspan="${COLUMNS}" class="text-danger text-center">Error al conectar con el servidor.</td></tr>`;
    }
}

// 2. FUNCIÓN CORREGIDA: Usa JSON para solicitar la edición y carga 'disponible'.
function editarHabitacion(id) {
    // Solicitud JSON para obtener los datos de una sola habitación
    const data = {
        action: 'obtener_uno', // Acción que debe manejar tu backend
        id_hab: id
    };

    fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) 
    })
    .then(async res => {
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
    })
    .then(hab => {
        console.log("JSON parseado:", hab);
        if (hab.success && hab.data) {
            const h = hab.data;
            document.getElementById('habitacionModalLabel').textContent = 'Editar Tipo de Habitación';
            document.getElementById('hab-id').value = h.id_hab;
            document.getElementById('hab-tipo').value = h.tipo_hab;
            document.getElementById('hab-desc').value = h.descripcion_hab;
            document.getElementById('hab-precio').value = h.precio;
            document.getElementById('hab-imagen').value = h.imagen || '';
            document.getElementById('hab-disponible').value = h.disponible; // <-- Carga el valor de 'disponible'

            modalHabitacion.show();
        } else {
            alert('No se pudieron cargar los datos de la habitación: ' + (hab.message || 'Respuesta del backend inesperada.'));
        }
    })
    .catch(err => {
        console.error("Error al obtener datos de la habitación:", err);
        alert('Error al obtener datos de la habitación.');
    });
}


document.getElementById('formulario-habitacion').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('hab-id').value;
    
    // Obtenemos los datos del formulario, incluyendo 'disponible'
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const action = id ? 'editar' : 'agregar';
    const successMsg = id ? 'Habitación actualizada correctamente.' : 'Habitación agregada correctamente.';
    const errorMsg = id ? 'Error al actualizar habitación: ' : 'Error al agregar habitación: ';

    // Verificar si se está editando y si se pasa un id
    if (action === 'editar' && !data.id_hab) {
        console.error("Error de edición: ID de habitación faltante.");
        alert("Error: ID de habitación para edición no encontrado.");
        return;
    }
    
    // Convertimos disponible a número para asegurar el tipo de dato
    data.disponible = parseInt(data.disponible); 

    if (await crudOperation(action, data, successMsg, errorMsg)) {
        modalHabitacion.hide();
        cargarHabitaciones();
    }
});

async function eliminarHabitacion(id) {
    if (!confirm(`¿Está seguro de eliminar la habitación #${id}?`)) return;
    if (await crudOperation('eliminar', { id_hab: id }, 'Habitación eliminada correctamente.', 'Error al eliminar habitación: ')) {
        cargarHabitaciones();
    }
}

function agregarListenersHabitaciones() {
    document.querySelectorAll('.editar-hab-btn').forEach(btn => {
        btn.onclick = () => editarHabitacion(btn.dataset.id);
    });
    document.querySelectorAll('.eliminar-hab-btn').forEach(btn => {
        btn.onclick = () => eliminarHabitacion(btn.dataset.id);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    modalHabitacion = new bootstrap.Modal(document.getElementById('modal-habitacion'));
    cargarHabitaciones();

    document.getElementById('modal-habitacion').addEventListener('hidden.bs.modal', function () {
        document.getElementById('formulario-habitacion').reset();
        document.getElementById('hab-id').value = '';
        document.getElementById('habitacionModalLabel').textContent = 'Agregar Tipo de Habitación';
    });
});