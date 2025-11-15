// Función para cerrar sesión del administrador
function cerrarSesionAdmin() {
    localStorage.removeItem('administrador');
    sessionStorage.removeItem('administrador');
    window.location.href = '../admin.html';
}

// Configurar botón de salir
document.addEventListener('DOMContentLoaded', () => {
    const btnSalir = document.getElementById('btnSalir');
    if (btnSalir) {
        btnSalir.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesionAdmin();
        });
    }
});

const API_BASE_URL = "../../Backend/routes/api.php";

let modalHabitacion;

async function crudOperation(action, data = {}, successMsg, errorMsg) {
    try {
        // Si el data es FormData (para imagen), no poner Content-Type
        let fetchOptions;
        if (data instanceof FormData) {
            data.append('action', action);
            fetchOptions = {
                method: 'POST',
                body: data
            };
        } else {
            data.action = action;
            fetchOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            };
        }

        const respuesta = await fetch(API_BASE_URL, fetchOptions);

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            console.error("Error HTTP:", respuesta.status, errorText);
            alert(errorMsg + `(HTTP ${respuesta.status})`);
            return false;
        }

        let resultado;
        try {
            resultado = await respuesta.json();
        } catch (parseError) {
            console.error("Error al parsear JSON:", parseError);
            alert(errorMsg + "(Error al procesar respuesta del servidor)");
            return false;
        }

        console.log("Respuesta backend:", resultado);

        if (resultado.success) {
            alert(successMsg);
            return true;
        } else {
            const mensaje = resultado.message || resultado.error || 'Error desconocido.';
            alert(errorMsg + mensaje);
            return false;
        }
    } catch (error) {
        console.error("Error en CRUD:", error);
        alert(errorMsg + error.message);
        return false;
    }
}

async function cargarHabitaciones() {
    const tbody = document.getElementById("cuerpo-tabla-habitaciones");
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
                    <td>${hab.imagen ? `<a href="${hab.imagen}" target="_blank">Ver imagen</a>` : 'N/A'}</td>
                    <td>${hab.disponible}</td>
                    <td>
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

function editarHabitacion(id) {
    const data = {
        action: 'obtener_uno',
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
            document.getElementById('hab-disponible').value = h.disponible;

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

    const id = document.getElementById('hab-id').value.trim();
    const formData = new FormData(e.target);

    // Si es edición, agregar el id
    if (id) {
        formData.append('id_hab', id);
    }

    // Asegurarse de que disponible sea número
    formData.set('disponible', parseInt(formData.get('disponible')) || 0);

    const action = id ? 'editar' : 'agregar';
    const successMsg = id ? 'Habitación actualizada correctamente.' : 'Habitación agregada correctamente.';
    const errorMsg = id ? 'Error al actualizar habitación: ' : 'Error al agregar habitación: ';

    if (await crudOperation(action, formData, successMsg, errorMsg)) {
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