// --- Variables Globales y Definición de Modal ---
const API_BASE_URL = 'http://localhost/ProyectoFinal/Backend/routes/api.php?url=servicio'; 
const servicioModalElement = document.getElementById('modal-servicio');
const servicioModal = new bootstrap.Modal(servicioModalElement);

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

        // Manejar respuesta vacía si el servidor no devuelve JSON (ej. DELETE exitoso)
        const resultado = respuesta.status !== 204 ? await respuesta.json() : { success: true };

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
// --- Lógica de SERVICIOS (CRUD) ---
// ------------------------------------------------------------------

async function cargarServicios() {
    const tbody = document.getElementById("cuerpo-tabla-servicios");
    // Colspan de 5: ID, Tipo, Descripción, Precio, Acciones (OJO: la tabla HTML tiene 5 columnas, no incluye Precio)
    // El HTML tiene 5 columnas: #, Tipo, Descripción, Imagen, Acciones. Ajustamos la carga a 5.
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>'; 
    try {
        // La URL de lectura de tu API es la que devuelve la lista completa, sin parámetros.
        const respuesta = await fetch(`${API_BASE_URL}`); 
        const servicios = await respuesta.json();

        tbody.innerHTML = '';
        if (!Array.isArray(servicios) || servicios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay servicios registrados.</td></tr>';
            return;
        }

        servicios.forEach(serv => {
            // Se asume que la API devuelve 'imagen_url' para mostrar la imagen (o al menos un indicador)
            const imagenColumna = serv.imagen ? `<i class="bi bi-image-fill text-success"></i>` : `<i class="bi bi-x-circle-fill text-danger"></i>`;
            
            const fila = `
                <tr>
                    <th scope="row">${serv.id_servicio}</th>
                    <td>${serv.tipo_servicio}</td>
                    <td>${serv.descripcion_servicio ? serv.descripcion_servicio.substring(0, 50) + '...' : ''}</td>
                    <td>${imagenColumna}</td> 
                    <td>
                        <button type="button" class="btn btn-sm btn-warning editar-serv-btn shadow-none" data-id="${serv.id_servicio}">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button type="button" class="btn btn-sm btn-danger eliminar-serv-btn shadow-none" data-id="${serv.id_servicio}">
                            <i class="bi bi-trash-fill"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
        agregarListenersServicios();
    } catch (error) {
        console.error("Error al cargar servicios:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Error al conectar con el servidor.</td></tr>';
    }
}

// El ID del formulario en el HTML es 'formulario-servicio', no 'form-servicio'.
document.getElementById('formulario-servicio').addEventListener('submit', async function(e) { 
    e.preventDefault();
    // OBTENEMOS LOS DATOS DEL FORMULARIO USANDO FormData
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // El ID real en el formulario es 'id_serv_oculto'
    const id = data.id_serv || ''; 
    
    // Ajuste de precio para el backend (si existe en el formulario)
    data.precio_servicio = data.precio_servicio || 0; 

    // Si el formulario contiene un campo 'file', necesitas enviarlo como FormData, 
    // pero tu función crudOperation está diseñada para JSON.
    // Para simplificar, asumiremos que solo se actualizan campos de texto/número.
    // **NOTA:** La subida de archivos requiere un manejo diferente (multipart/form-data).
    // Si necesitas subir archivos, la lógica de 'crudOperation' debe ser modificada.
    
    // Eliminamos la imagen si no es el campo correcto para la subida (sólo por coherencia con JSON)
    if(data.imagen_servicio && data.imagen_servicio instanceof File && data.imagen_servicio.name === "") {
        delete data.imagen_servicio; // No enviar si está vacío
    } else {
        // En un entorno de producción, aquí subirías la imagen a un servidor
        // y enviarías solo la URL o nombre del archivo en el JSON.
        // Por ahora, solo enviamos los campos de texto/número al backend (PHP o similar)
        delete data.imagen_servicio; 
    }
    
    let url, method, successMsg, errorMsg;

    if (id) {
        url = `${API_BASE_URL}?url=servicio&id=${id}&action=editar`;
        method = 'POST'; 
        successMsg = 'Servicio actualizado con éxito.';
        errorMsg = 'Error al actualizar el servicio: ';
    } else {
        url = `${API_BASE_URL}?url=servicio&action=agregar`;
        method = 'POST';
        successMsg = 'Servicio agregado con éxito.';
        errorMsg = 'Error al agregar el servicio: ';
    }
    
    if (await crudOperation(url, method, data, successMsg, errorMsg)) {
        servicioModal.hide(); // Usamos la variable global
        cargarServicios();
    }
});

function editarServicio(id) {
    // Para obtener un servicio individual
    fetch(`${API_BASE_URL}?url=servicio&id=${id}`) 
        .then(res => res.json())
        .then(serv => {
            if (serv && serv.id_servicio) {
                document.getElementById('modalLabel').textContent = 'Editar Servicio'; // ID correcto del título
                document.getElementById('id_serv_oculto').value = serv.id_servicio; // ID correcto del input oculto
                document.getElementById('tipo_servicio').value = serv.tipo_servicio; // ID correcto
                document.getElementById('descripcion_servicio').value = serv.descripcion_servicio; // ID correcto
                document.getElementById('serv-precio').value = serv.precio_servicio || 0; // ID correcto (asumiendo que se agregó al HTML)
                // document.getElementById('imagen_servicio').value = ''; // No precargar archivos
                servicioModal.show();
            } else {
                alert('Error al cargar datos del servicio.');
            }
        }).catch(err => {
            console.error(err);
            alert('Error al obtener datos del servidor.');
        });
}

async function eliminarServicio(id) {
    if (!confirm(`¿Está seguro de eliminar el servicio #${id}? Esto puede afectar reservas existentes.`)) return;
    const url = `${API_BASE_URL}?url=servicio&id=${id}&action=eliminar`;
    const successMsg = 'Servicio eliminado correctamente.';
    const errorMsg = 'Error al eliminar el servicio: ';
    // Se recomienda usar DELETE para eliminar, pero se mantiene POST para compatibilidad con la estructura de tu API.
    if (await crudOperation(url, 'POST', {}, successMsg, errorMsg)) { 
        cargarServicios();
    }
}

function agregarListenersServicios() {
    document.querySelectorAll('.editar-serv-btn').forEach(btn => {
        btn.onclick = () => editarServicio(btn.dataset.id);
    });
    document.querySelectorAll('.eliminar-serv-btn').forEach(btn => {
        btn.onclick = () => eliminarServicio(btn.dataset.id);
    });
}

// ------------------------------------------------------------------
// --- Inicialización General ---
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // cargarHabitaciones(); // Asumo que esta función existe en otro lado
    
    // Evento de tab para cargar los servicios solo cuando la pestaña es visible
    const serviciosTab = document.getElementById('servicios-tab');
    if (serviciosTab) {
        serviciosTab.addEventListener('shown.bs.tab', cargarServicios);
    }

    // Limpieza de modales
    if (servicioModalElement) {
        servicioModalElement.addEventListener('hidden.bs.modal', function () {
            document.getElementById('formulario-servicio').reset();
            document.getElementById('id_serv_oculto').value = ''; // Limpiar el ID
            document.getElementById('modalLabel').textContent = 'Agregar Servicio'; // Título por defecto
        });
    }

    // Cargar la lista de servicios al inicio si está en la pestaña correcta
    if (document.querySelector('.nav-link.active[href="contenidoAdmin.html"]')) {
         cargarServicios();
    }
});