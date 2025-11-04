const API_BASE_URL_SERV = 'http://localhost/ProyectoFinal/Backend/routes/api.php?url=servicio';

let modalServicio;

// --- Funciones de Utilidad ---

// Función genérica para todas las operaciones CRUD (Agregar, Editar, Eliminar)
async function crudOperationServicio(action, data = {}, successMsg, errorMsg) {
    try {
        // Para 'agregar' y 'editar' el backend podría esperar 'multipart/form-data' si incluye la carga de la imagen.
        // Dado que el formulario de Servicios usa un input 'file', usaremos FormData en lugar de JSON.stringify.

        const formData = new FormData();
        formData.append('action', action);
        
        // Agregar el resto de los datos al FormData.
        // Nota: Asume que el backend puede manejar la imagen y otros campos juntos.
        for (const key in data) {
            // Si el valor es un objeto File, lo adjuntamos directamente.
            // Si no, lo adjuntamos como un campo de texto normal.
            if (data[key] instanceof File) {
                formData.append(key, data[key], data[key].name);
            } else {
                formData.append(key, data[key]);
            }
        }
        
        // La API de Habitaciones usaba POST con JSON, pero el formulario de Servicios tiene un 'file',
        // por lo que cambiamos a FormData y no especificamos 'Content-Type'.
        const respuesta = await fetch(API_BASE_URL_SERV, {
            method: 'POST',
            body: formData // Usamos FormData para enviar datos y archivos
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            console.error("Error HTTP:", errorText);
            alert(errorMsg + ` (HTTP ${respuesta.status})`);
            return false;
        }

        // El backend debe responder con JSON.
        const resultado = await respuesta.json();
        console.log("Respuesta backend:", resultado);

        if (resultado.success) {
            alert(successMsg);
            return true;
        } else {
            alert(errorMsg + (resultado.message || 'Error desconocido en el backend.'));
            return false;
        }
    } catch (error) {
        console.error("Error en CRUD de Servicio:", error);
        alert('Error de conexión con el servidor o fallo de red.');
        return false;
    }
}


// --- Funciones de Carga y Renderización (Tabla) ---

async function cargarServicios() {
    const tbody = document.getElementById("cuerpo-tabla-servicios");
    const COLUMNS = 5; 
    tbody.innerHTML = `<tr><td colspan="${COLUMNS}" class="text-center">Cargando servicios...</td></tr>`; 

    try {
        // Solicitud GET para obtener todos los servicios
        const respuesta = await fetch(API_BASE_URL_SERV, { method: 'GET' });
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        console.log("Servicios obtenidos:", data);

        tbody.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${COLUMNS}" class="text-center">No hay servicios registrados.</td></tr>`; 
            return;
        }

        // Renderizar filas de la tabla
        data.forEach(servicio => {
            const fila = `
                <tr>
                    <th scope="row">${servicio.id_serv}</th>
                    <td>${servicio.tipo_servicio}</td>
                    <td>${servicio.descripcion_servicio.substring(0, 70)}...</td>
                    <td>${servicio.imagen ? `<a href="${servicio.imagen}" target="_blank">Ver Imagen</a>` : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning editar-serv-btn" data-id="${servicio.id_serv}">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger eliminar-serv-btn" data-id="${servicio.id_serv}">
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
        tbody.innerHTML = `<tr><td colspan="${COLUMNS}" class="text-danger text-center">Error al conectar o cargar servicios.</td></tr>`;
    }
}


// --- Funciones de CRUD Específicas (Editar, Eliminar) ---

function editarServicio(id) {
    const data = {
        action: 'obtener_uno',
        id_serv: id
    };

    fetch(API_BASE_URL_SERV, {
        method: 'POST', // Asumo que obtener uno también es POST con action: 'obtener_uno'
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) 
    })
    .then(async res => {
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
    })
    .then(serv => {
        console.log("JSON de servicio parseado:", serv);
        if (serv.success && serv.data) {
            const s = serv.data;
            document.getElementById('modalLabel').textContent = 'Editar Servicio Existente';
            document.getElementById('id_serv_oculto').value = s.id_serv;
            document.getElementById('tipo_servicio').value = s.tipo_servicio;
            document.getElementById('descripcion_servicio').value = s.descripcion_servicio;
            // El campo de imagen (file) debe quedar vacío por defecto para no enviar nada a menos que se seleccione un archivo.
            document.getElementById('imagen_servicio').value = ''; 

            modalServicio.show();
        } else {
            alert('No se pudieron cargar los datos del servicio: ' + (serv.message || 'Respuesta del backend inesperada.'));
        }
    })
    .catch(err => {
        console.error("Error al obtener datos del servicio:", err);
        alert('Error al obtener datos del servicio.');
    });
}

async function eliminarServicio(id) {
    if (!confirm(`¿Está seguro de eliminar el servicio #${id}? Esta acción es irreversible.`)) return;
    
    // Para la eliminación, podríamos volver a usar JSON, asumiendo que solo se necesita el ID y la acción.
    const data = {
        action: 'eliminar',
        id_serv: id
    };
    
    // Usamos el fetch con JSON.stringify directamente para eliminar, ya que no lleva archivo.
    try {
        const respuesta = await fetch(API_BASE_URL_SERV, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            alert(`Error al eliminar: (HTTP ${respuesta.status})`);
            console.error("Error HTTP en eliminar:", errorText);
            return;
        }

        const resultado = await respuesta.json();
        if (resultado.success) {
            alert('Servicio eliminado correctamente.');
            cargarServicios(); // Recargar la tabla
        } else {
            alert('Error al eliminar servicio: ' + (resultado.message || 'Error desconocido.'));
        }
    } catch (error) {
        console.error("Error en la eliminación del servicio:", error);
        alert('Error de conexión con el servidor al intentar eliminar.');
    }
}


// --- Event Listeners ---

document.getElementById('formulario-servicio').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('id_serv_oculto').value;
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const action = id ? 'editar' : 'agregar';
    const successMsg = id ? 'Servicio actualizado correctamente.' : 'Servicio agregado correctamente.';
    const errorMsg = id ? 'Error al actualizar servicio: ' : 'Error al agregar servicio: ';

    // Si es edición, nos aseguramos de que el ID esté en los datos.
    if (id) {
        data.id_serv = id;
    }
    
    // Si no se seleccionó una nueva imagen en edición, eliminamos el campo 'imagen_servicio'
    // para que no se envíe un campo vacío al backend (que podría borrar la imagen existente).
    // NOTA: El input 'imagen_servicio' es de tipo 'file'. Si está vacío, su valor en FormData.entries() es File { size: 0, ... }.
    const imagenInput = document.getElementById('imagen_servicio');
    if (imagenInput.files.length === 0 && action === 'editar') {
        delete data.imagen_servicio;
    }
    
    // Convertir el objeto plano 'data' a un formato que podamos enviar a crudOperationServicio,
    // que es FormData para manejar la carga de archivos.
    // Aquí usamos una variación de crudOperationServicio que recibe el objeto plano 'data'.
    // Para simplificar, asumiremos que el backend es capaz de manejar 'multipart/form-data'
    // y lo adaptamos para usar la función genérica con el FormData.

    // Crearemos un objeto solo con los datos necesarios, incluyendo el archivo File.
    const dataToSend = {};
    for (const [key, value] of formData.entries()) {
        if (key === 'imagen_servicio' && imagenInput.files.length === 0 && action === 'editar') {
            // Ignorar el campo de imagen vacío en edición.
            continue; 
        }
        dataToSend[key] = value;
    }

    if (await crudOperationServicio(action, dataToSend, successMsg, errorMsg)) {
        modalServicio.hide();
        cargarServicios();
    }
});


function agregarListenersServicios() {
    document.querySelectorAll('.editar-serv-btn').forEach(btn => {
        btn.onclick = () => editarServicio(btn.dataset.id);
    });
    document.querySelectorAll('.eliminar-serv-btn').forEach(btn => {
        btn.onclick = () => eliminarServicio(btn.dataset.id);
    });
}


document.addEventListener("DOMContentLoaded", () => {
    // Inicializar el modal de Bootstrap
    modalServicio = new bootstrap.Modal(document.getElementById('modal-servicio'));
    
    // Cargar los datos iniciales en la tabla
    cargarServicios();

    // Resetear el formulario y el título al cerrar el modal
    document.getElementById('modal-servicio').addEventListener('hidden.bs.modal', function () {
        document.getElementById('formulario-servicio').reset();
        document.getElementById('id_serv_oculto').value = '';
        document.getElementById('modalLabel').textContent = 'Añadir Nuevo Servicio';
    });
    
    // Configurar el botón de añadir nuevo servicio para resetear el formulario al abrir el modal
    document.querySelector('[data-bs-target="#modal-servicio"]').addEventListener('click', function () {
        document.getElementById('formulario-servicio').reset();
        document.getElementById('id_serv_oculto').value = '';
        document.getElementById('modalLabel').textContent = 'Añadir Nuevo Servicio';
    });
});