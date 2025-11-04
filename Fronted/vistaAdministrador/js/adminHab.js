// adminHab.js

// --- 1. Definición de la URL Base ---
// **IMPORTANTE:** Reemplaza esta URL con la dirección real de tu controlador de API.
const API_BASE_URL = 'http://localhost/ProyectoFinal/Backend/routes/api.php?url=habitacion'; 

// --- Funciones de CRUD Genéricas ---
async function crudOperation(url, method, data, successMsg, errorMsg) {
    try {
        const respuesta = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: ['POST', 'PUT', 'DELETE'].includes(method) ? JSON.stringify(data) : null
        });
        
        // Manejar errores de servidor (HTTP 4xx, 5xx)
        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            console.error("Error HTTP. Respuesta del servidor:", errorText);
            alert(errorMsg + `Error de servidor (${respuesta.status}). Revise la consola.`);
            return false;
        }

        // Se asume que el backend SIEMPRE devuelve JSON, incluso si es solo un mensaje.
        const resultado = await respuesta.json();

        if (resultado.success) {
            alert(successMsg);
            return true;
        } else {
            alert(errorMsg + (resultado.message || 'Error desconocido.'));
            return false;
        }
    } catch (error) {
        console.error("Error en la operación CRUD o en la red:", error);
        alert('Error de conexión o al procesar la solicitud.');
        return false;
    }
}

// ------------------------------------------------------------------
// --- Lógica de HABITACIONES (CRUD) ---
// ------------------------------------------------------------------

async function cargarHabitaciones() {
    const tbody = document.getElementById("cuerpo-tabla-habitaciones");
    // Colspan de 6: ID, Tipo, Descripción, Precio, Imagen, Acciones
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Cargando...</td></tr>'; 
    try {
        // Usa la variable API_BASE_URL
        const respuesta = await fetch(`${API_BASE_URL}`); 
        const habitaciones = await respuesta.json();

        tbody.innerHTML = '';
        if (!Array.isArray(habitaciones) || habitaciones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay tipos de habitación registrados.</td></tr>';
            return;
        }

        habitaciones.forEach(hab => {
            const imagenLink = hab.imagen ? `<a href="${hab.imagen}" target="_blank">Ver Imagen</a>` : 'N/A';
            const fila = `
                <tr>
                    <th scope="row">${hab.id_hab}</th>
                    <td>${hab.tipo_hab}</td>
                    <td>${hab.descripcion_hab.substring(0, 50)}...</td>
                    <td>$${hab.precio} USD</td>
                    <td>${imagenLink}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-warning editar-hab-btn shadow-none" data-id="${hab.id_hab}">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button type="button" class="btn btn-sm btn-danger eliminar-hab-btn shadow-none" data-id="${hab.id_hab}">
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
        tbody.innerHTML = '<tr><td colspan="6" class="text-danger text-center">Error al conectar con el servidor.</td></tr>';
    }
}

// **CORRECCIÓN 2:** Cambiado 'form-habitacion' por 'formulario-habitacion'
document.getElementById('formulario-habitacion').addEventListener('submit', async function(e) {
    e.preventDefault();
    // **CORRECCIÓN 3:** Ahora buscamos el ID por 'hab-id' (asumiendo que corregiste el HTML)
    const id = document.getElementById('hab-id').value; 
    
    // Obtener todos los datos del formulario, incluyendo campos ocultos.
    const data = Object.fromEntries(new FormData(e.target).entries()); 
    
    let url, method, successMsg, errorMsg;

    if (id) {
        url = `${API_BASE_URL}?url=habitacion&id=${id}&action=editar`;
        method = 'POST'; 
        successMsg = 'Tipo de habitación actualizado con éxito.';
        errorMsg = 'Error al actualizar la habitación: ';
    } else {
        url = `${API_BASE_URL}?url=habitacion&action=agregar`;
        method = 'POST';
        successMsg = 'Tipo de habitación agregado con éxito.';
        errorMsg = 'Error al agregar la habitación: ';
    }

    // Asegúrate de que modalHabitacion esté definida (se definirá más abajo en Inicialización)
    if (await crudOperation(url, method, data, successMsg, errorMsg)) {
        // Se asume que modalHabitacion está definida como new bootstrap.Modal(...)
        if (typeof modalHabitacion !== 'undefined') {
            modalHabitacion.hide();
        }
        cargarHabitaciones();
    }
});

function editarHabitacion(id) {
    fetch(`${API_BASE_URL}?url=habitacion&id=${id}`) 
        .then(res => res.json())
        .then(hab => {
            if (hab && hab.id_hab) {
                document.getElementById('habitacionModalLabel').textContent = 'Editar Tipo de Habitación';
                // **CORRECCIÓN 3:** Uso de los IDs estandarizados
                document.getElementById('hab-id').value = hab.id_hab; 
                document.getElementById('hab-tipo').value = hab.tipo_hab;
                document.getElementById('hab-desc').value = hab.descripcion_hab;
                document.getElementById('hab-precio').value = hab.precio;
                document.getElementById('hab-imagen').value = hab.imagen || '';
                
                // Se asume que modalHabitacion está definida (new bootstrap.Modal)
                if (typeof modalHabitacion !== 'undefined') {
                    modalHabitacion.show();
                }
            } else {
                alert('Error al cargar datos de la habitación.');
            }
        }).catch(err => {
            console.error(err);
            alert('Error al obtener datos del servidor.');
        });
}

async function eliminarHabitacion(id) {
    if (!confirm(`¿Está seguro de eliminar el tipo de habitación #${id}? Esto puede afectar reservas existentes.`)) return;
    const url = `${API_BASE_URL}?url=habitacion&id=${id}&action=eliminar`;
    const successMsg = 'Tipo de habitación eliminado correctamente.';
    const errorMsg = 'Error al eliminar la habitación: ';
    if (await crudOperation(url, 'POST', {}, successMsg, errorMsg)) {
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

// ------------------------------------------------------------------
// --- Inicialización General ---
// ------------------------------------------------------------------
let modalHabitacion; // Declarar la variable para el objeto modal

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar el objeto modal de Bootstrap
    modalHabitacion = new bootstrap.Modal(document.getElementById('modal-habitacion')); 
    
    cargarHabitaciones();

    // Limpieza de modales
    document.getElementById('modal-habitacion').addEventListener('hidden.bs.modal', function () {
        // **CORRECCIÓN 2:** Cambiado 'form-habitacion' por 'formulario-habitacion'
        document.getElementById('formulario-habitacion').reset();
        
        // **CORRECCIÓN 3:** Uso de 'hab-id'
        document.getElementById('hab-id').value = ''; 
        
        document.getElementById('habitacionModalLabel').textContent = 'Agregar Tipo de Habitación';
    });
});