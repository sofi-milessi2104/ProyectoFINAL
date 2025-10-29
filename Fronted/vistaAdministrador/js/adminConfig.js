// ⭐ ¡AJUSTA ESTA URL! Debería apuntar a tu API general para CRUD
const API_BASE_URL = "../../Backend/routes/api.php"; 

const modalHabitacion = new bootstrap.Modal(document.getElementById('modal-habitacion'));
const modalServicio = new bootstrap.Modal(document.getElementById('modal-servicio'));
const modalPromocion = new bootstrap.Modal(document.getElementById('modal-promocion')); 

// --- Funciones de CRUD Genéricas ---
async function crudOperation(url, method, data, successMsg, errorMsg) {
    try {
        const respuesta = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: method !== 'GET' ? JSON.stringify(data) : null
        });
        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert(successMsg);
            return true;
        } else {
            alert(errorMsg + (resultado.message || ''));
            return false;
        }
    } catch (error) {
        console.error("Error en la operación CRUD:", error);
        alert('Error de conexión o al procesar la solicitud.');
        return false;
    }
}


// ------------------------------------------------------------------
// --- Lógica de HABITACIONES (CRUD) ---
// ------------------------------------------------------------------

async function cargarHabitaciones() {
    const tbody = document.getElementById("cuerpo-tabla-habitaciones");
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>';
    try {
        const respuesta = await fetch(`${API_BASE_URL}?url=habitacion`);
        const habitaciones = await respuesta.json();

        tbody.innerHTML = '';
        if (!Array.isArray(habitaciones) || habitaciones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay tipos de habitación registrados.</td></tr>';
            return;
        }

        habitaciones.forEach(hab => {
            const fila = `
                <tr>
                    <th scope="row">${hab.id_hab}</th>
                    <td>${hab.tipo_hab}</td>
                    <td>${hab.descripcion_hab.substring(0, 50)}...</td>
                    <td>$${hab.precio} USD</td>
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
        tbody.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Error al conectar con el servidor.</td></tr>';
    }
}

document.getElementById('form-habitacion').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('hab-id').value;
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

    if (await crudOperation(url, method, data, successMsg, errorMsg)) {
        modalHabitacion.hide();
        cargarHabitaciones();
    }
});

function editarHabitacion(id) {
    fetch(`${API_BASE_URL}?url=habitacion&id=${id}`) 
        .then(res => res.json())
        .then(hab => {
            if (hab && hab.id_hab) {
                document.getElementById('habitacionModalLabel').textContent = 'Editar Tipo de Habitación';
                document.getElementById('hab-id').value = hab.id_hab;
                document.getElementById('hab-tipo').value = hab.tipo_hab;
                document.getElementById('hab-desc').value = hab.descripcion_hab;
                document.getElementById('hab-precio').value = hab.precio;
                document.getElementById('hab-imagen').value = hab.imagen || '';
                modalHabitacion.show();
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
// --- Lógica de SERVICIOS (CRUD) ---
// ------------------------------------------------------------------

async function cargarServicios() {
    const tbody = document.getElementById("cuerpo-tabla-servicios");
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>';
    try {
        const respuesta = await fetch(`${API_BASE_URL}?url=servicio`);
        const servicios = await respuesta.json();

        tbody.innerHTML = '';
        if (!Array.isArray(servicios) || servicios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay servicios registrados.</td></tr>';
            return;
        }

        servicios.forEach(serv => {
            // Nota: Aquí estamos ignorando la columna id_promo en la vista para mantener el enfoque en el servicio
            const precioTexto = serv.precio_servicio == 0 ? 'Gratis' : `$${serv.precio_servicio} USD`;
            const fila = `
                <tr>
                    <th scope="row">${serv.id_servicio}</th>
                    <td>${serv.tipo_servicio}</td>
                    <td>${serv.descripcion_servicio ? serv.descripcion_servicio.substring(0, 50) + '...' : ''}</td>
                    <td>${precioTexto}</td>
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

document.getElementById('form-servicio').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('serv-id').value;
    const data = Object.fromEntries(new FormData(e.target).entries());
    
    // Necesitas ajustar tu API y BD, ya que el formulario pide precio_servicio (number)
    // y el esquema de tu BD no tiene precio para servicio, solo tiene id_promo.
    // Aquí asumimos que tienes un campo precio_servicio en tu BD o que lo manejas en el backend.
    data.precio_servicio = data.precio_servicio || 0; 
    
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
        modalServicio.hide();
        cargarServicios();
    }
});

function editarServicio(id) {
    fetch(`${API_BASE_URL}?url=servicio&id=${id}`) 
        .then(res => res.json())
        .then(serv => {
            if (serv && serv.id_servicio) {
                document.getElementById('servicioModalLabel').textContent = 'Editar Servicio';
                document.getElementById('serv-id').value = serv.id_servicio;
                document.getElementById('serv-tipo').value = serv.tipo_servicio;
                document.getElementById('serv-desc').value = serv.descripcion_servicio;
                // Nota: Usamos 0 como fallback si precio_servicio no existe en tu BD
                document.getElementById('serv-precio').value = serv.precio_servicio || 0; 
                document.getElementById('serv-imagen').value = serv.imagen || '';
                modalServicio.show();
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
// --- Lógica de PROMOCIONES (CRUD ADAPTADO) ---
// ------------------------------------------------------------------

async function cargarPromociones() {
    const tbody = document.getElementById("cuerpo-tabla-promociones");
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>';
    try {
        const respuesta = await fetch(`${API_BASE_URL}?url=promocion`);
        const promociones = await respuesta.json();

        tbody.innerHTML = '';
        if (!Array.isArray(promociones) || promociones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay promociones registradas.</td></tr>';
            return;
        }

        promociones.forEach(promo => {
            const fila = `
                <tr>
                    <th scope="row">${promo.id_promo}</th>
                    <td>${promo.tipo_promo}</td>
                    <td>$${promo.precio_promo} USD</td>
                    <td><a href="${promo.img_promo}" target="_blank">Ver Imagen</a></td>
                    <td>
                        <button type="button" class="btn btn-sm btn-warning editar-promo-btn shadow-none" data-id="${promo.id_promo}">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button type="button" class="btn btn-sm btn-danger eliminar-promo-btn shadow-none" data-id="${promo.id_promo}">
                            <i class="bi bi-trash-fill"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
        agregarListenersPromociones();
    } catch (error) {
        console.error("Error al cargar promociones:", error);
        tbody.innerHTML = '<tr><td colspan="5" class="text-danger text-center">Error al conectar con el servidor.</td></tr>';
    }
}

document.getElementById('form-promocion').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('promo-id').value;
    const data = Object.fromEntries(new FormData(e.target).entries());
    
    let url, method, successMsg, errorMsg;

    if (id) {
        url = `${API_BASE_URL}?url=promocion&id=${id}&action=editar`;
        method = 'POST';
        successMsg = 'Promoción actualizada con éxito.';
        errorMsg = 'Error al actualizar la promoción: ';
    } else {
        url = `${API_BASE_URL}?url=promocion&action=agregar`;
        method = 'POST';
        successMsg = 'Promoción creada con éxito.';
        errorMsg = 'Error al crear la promoción: ';
    }

    if (await crudOperation(url, method, data, successMsg, errorMsg)) {
        modalPromocion.hide();
        cargarPromociones();
    }
});

function editarPromocion(id) {
    fetch(`${API_BASE_URL}?url=promocion&id=${id}`) 
        .then(res => res.json())
        .then(promo => {
            if (promo && promo.id_promo) { 
                document.getElementById('promocionModalLabel').textContent = 'Editar Promoción';
                document.getElementById('promo-id').value = promo.id_promo;
                document.getElementById('promo-tipo').value = promo.tipo_promo; 
                document.getElementById('promo-desc').value = promo.descripcion_promo;
                document.getElementById('promo-precio').value = promo.precio_promo;
                document.getElementById('promo-img').value = promo.img_promo;
                modalPromocion.show();
            } else {
                 alert('Error al cargar datos de la promoción.');
            }
        }).catch(err => {
            console.error(err);
            alert('Error al obtener datos del servidor.');
        });
}

async function eliminarPromocion(id) {
    if (!confirm(`¿Está seguro de eliminar la promoción #${id}?`)) return;

    const url = `${API_BASE_URL}?url=promocion&id=${id}&action=eliminar`;
    const successMsg = 'Promoción eliminada correctamente.';
    const errorMsg = 'Error al eliminar la promoción: ';
    
    if (await crudOperation(url, 'POST', {}, successMsg, errorMsg)) {
        cargarPromociones();
    }
}

function agregarListenersPromociones() {
    document.querySelectorAll('.editar-promo-btn').forEach(btn => {
        btn.onclick = () => editarPromocion(btn.dataset.id);
    });
    document.querySelectorAll('.eliminar-promo-btn').forEach(btn => {
        btn.onclick = () => eliminarPromocion(btn.dataset.id);
    });
}

// ------------------------------------------------------------------
// --- Inicialización General ---
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    cargarHabitaciones();
    
    document.getElementById('servicios-tab').addEventListener('shown.bs.tab', cargarServicios);
    document.getElementById('promociones-tab').addEventListener('shown.bs.tab', cargarPromociones); 

    // Limpieza de modales
    document.getElementById('modal-habitacion').addEventListener('hidden.bs.modal', function () {
        document.getElementById('form-habitacion').reset();
        document.getElementById('hab-id').value = '';
        document.getElementById('habitacionModalLabel').textContent = 'Agregar Tipo de Habitación';
    });
    
    document.getElementById('modal-servicio').addEventListener('hidden.bs.modal', function () {
        document.getElementById('form-servicio').reset();
        document.getElementById('serv-id').value = '';
        document.getElementById('servicioModalLabel').textContent = 'Agregar Servicio';
    });
    
    document.getElementById('modal-promocion').addEventListener('hidden.bs.modal', function () {
        document.getElementById('form-promocion').reset();
        document.getElementById('promo-id').value = '';
        document.getElementById('promocionModalLabel').textContent = 'Crear Nueva Promoción';
    });
});