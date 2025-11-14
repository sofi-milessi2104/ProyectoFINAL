const API_PROMO_URL = 'http://localhost/ProyectoFINAL/Backend/routes/api.php?url=promocion';

async function cargarPromocionesSelect() {
    const select = document.getElementById('id_promo');
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione una promoción...</option>';
    try {
        const res = await fetch(API_PROMO_URL);
        const promos = await res.json();
        if (Array.isArray(promos)) {
            promos.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.id_promo;
                opt.textContent = `${p.tipo_promo} (${p.precio_promo})`;
                select.appendChild(opt);
            });
        }
    } catch (e) {
        console.error('Error cargando promociones:', e);
    }
}
const API_BASE_URL_SERV = 'http://localhost/ProyectoFINAL/Backend/routes/api.php?url=servicio';

let modalServicio;

async function crudOperationServicio(action, data = {}, successMsg, errorMsg) {
    try {

        const formData = new FormData();
        formData.append('action', action);
        
        for (const key in data) {
            if (data[key] instanceof File) {
                formData.append(key, data[key], data[key].name);
            } else {
                formData.append(key, data[key]);
            }
        }
        
        const respuesta = await fetch(API_BASE_URL_SERV, {
            method: 'POST',
            body: formData
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
            alert(errorMsg + (resultado.message || 'Error desconocido en el backend.'));
            return false;
        }
    } catch (error) {
        console.error("Error en CRUD de Servicio:", error);
        alert('Error de conexión con el servidor o fallo de red.');
        return false;
    }
}

async function cargarServicios() {
    const tbody = document.getElementById("cuerpo-tabla-servicios");
    const COLUMNS = 5; 
    tbody.innerHTML = `<tr><td colspan="${COLUMNS}" class="text-center">Cargando servicios...</td></tr>`; 

    try {
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

        data.forEach(servicio => {
            const fila = `
                <tr>
                    <th scope="row">${servicio.id_servicio}</th>
                    <td>${servicio.tipo_servicio}</td>
                    <td>${servicio.descripcion_servicio.substring(0, 70)}...</td>
                    <td>${servicio.imagen ? `<a href="${servicio.imagen}" target="_blank">Ver Imagen</a>` : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning editar-serv-btn" data-id="${servicio.id_servicio}">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger eliminar-serv-btn" data-id="${servicio.id_servicio}">
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

function editarServicio(id) {
    const data = {
        action: 'obtener_uno',
        id_servicio: id
    };

    fetch(API_BASE_URL_SERV, {
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
    .then(serv => {
        console.log("JSON de servicio parseado:", serv);
        if (serv.success && serv.data) {
            const s = serv.data;
            document.getElementById('modalLabel').textContent = 'Editar Servicio Existente';
            document.getElementById('id_serv_oculto').value = s.id_servicio;
            document.getElementById('tipo_servicio').value = s.tipo_servicio;
            document.getElementById('descripcion_servicio').value = s.descripcion_servicio;
            document.getElementById('id_promo').value = s.id_promo || '';
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
    const data = {
        action: 'eliminar',
        id_servicio: id
    };
    
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
            cargarServicios();
        } else {
            alert('Error al eliminar servicio: ' + (resultado.message || 'Error desconocido.'));
        }
    } catch (error) {
        console.error("Error en la eliminación del servicio:", error);
        alert('Error de conexión con el servidor al intentar eliminar.');
    }
}

document.getElementById('formulario-servicio').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('id_serv_oculto').value;
    const formData = new FormData(e.target);

    // Si es edición, agregar el id
    if (id) {
        formData.append('id_servicio', id);
    }

    const action = id ? 'editar' : 'agregar';
    const successMsg = id ? 'Servicio actualizado correctamente.' : 'Servicio agregado correctamente.';
    const errorMsg = id ? 'Error al actualizar servicio: ' : 'Error al agregar servicio: ';

    // Convertir FormData a objeto para crudOperationServicio
    const dataToSend = {};
    for (const [key, value] of formData.entries()) {
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
    modalServicio = new bootstrap.Modal(document.getElementById('modal-servicio'));
    cargarServicios();
    cargarPromocionesSelect();

    document.getElementById('modal-servicio').addEventListener('shown.bs.modal', function () {
        cargarPromocionesSelect();
    });

    document.getElementById('modal-servicio').addEventListener('hidden.bs.modal', function () {
        document.getElementById('formulario-servicio').reset();
        document.getElementById('id_serv_oculto').value = '';
        document.getElementById('modalLabel').textContent = 'Añadir Nuevo Servicio';
    });

    document.querySelector('[data-bs-target="#modal-servicio"]').addEventListener('click', function () {
        document.getElementById('formulario-servicio').reset();
        document.getElementById('id_serv_oculto').value = '';
        document.getElementById('modalLabel').textContent = 'Añadir Nuevo Servicio';
        cargarPromocionesSelect();
    });
});