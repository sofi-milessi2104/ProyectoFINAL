 const API_BASE_URL = 'http://localhost/ProyectoFinal/Backend/routes/api.php?url=promocion';
 let modalPromocion;

async function crudOperation(url, method, data, successMsg, errorMsg) {
    try {
        let fetchOptions = { method: method };
        
        // Si data es FormData, no poner Content-Type
        if (data instanceof FormData) {
            fetchOptions.body = data;
        } else if (['POST', 'PUT', 'DELETE'].includes(method)) {
            fetchOptions.headers = { 'Content-Type': 'application/json' };
            fetchOptions.body = JSON.stringify(data);
        }
        
        const respuesta = await fetch(url, fetchOptions);
        
        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            console.error("Error HTTP. Respuesta del servidor:", errorText);
            alert(errorMsg + `Error de servidor (${respuesta.status}). Revise la consola.`);
            return false;
        }

        let resultado;
        try {
            resultado = await respuesta.json();
        } catch (e) {
            if (respuesta.status >= 200 && respuesta.status < 300) {
                 alert(successMsg);
                 return true;
            }
            console.error("No se pudo parsear la respuesta JSON. Posiblemente respuesta vacía:", e);
            alert(errorMsg + 'Respuesta de servidor inválida.');
            return false;
        }


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

async function cargarPromociones() {
    const tbody = document.getElementById("cuerpo-tabla-promociones");
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>'; 
    try {
        const respuesta = await fetch(`${API_BASE_URL}`);
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
                            <td>${promo.descripcion_promo ? promo.descripcion_promo.substring(0, 50) + '...' : 'N/A'}</td>
                            <td>${promo.img_promo ? `<a href="${promo.img_promo}" target="_blank">Ver imagen</a>` : 'N/A'}</td>
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

document.getElementById('formulario-promocion').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const id = document.getElementById('id_promo_oculto').value;
    
    // Determinar acción y agregar al FormData
    const action = id ? 'editar' : 'agregar';
    formData.append('action', action);
    
    if (id) {
        formData.append('id_promo', id);
    }
    
    const successMsg = id ? 'Promoción actualizada con éxito.' : 'Promoción creada con éxito.';
    const errorMsg = id ? 'Error al actualizar la promoción: ' : 'Error al crear la promoción: ';

    if (await crudOperation(API_BASE_URL, 'POST', formData, successMsg, errorMsg)) {
        if (typeof modalPromocion !== 'undefined' && modalPromocion.hide) {
            modalPromocion.hide();
        }
        cargarPromociones();
    }
});

function editarPromocion(id) {
    const data = {
        action: 'obtener_uno',
        id_promo: id
    };

    fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(promo => {
            if (promo && promo.id_promo) { 
                document.getElementById('modalLabel').textContent = 'Editar Promoción';
                document.getElementById('id_promo_oculto').value = promo.id_promo;
                document.getElementById('titulo_promo').value = promo.tipo_promo;
                document.getElementById('descripcion_promo').value = promo.descripcion_promo;
                document.getElementById('precio_promo').value = promo.precio_promo || 0;
                document.getElementById('imagen_promo').value = '';
                 if (typeof modalPromocion !== 'undefined' && modalPromocion.show) {
                    modalPromocion.show();
                }
            } else {
                 alert('Error al cargar datos de la promoción. El servidor no devolvió datos válidos.');
            }
        }).catch(err => {
            console.error(err);
            alert('Error al obtener datos del servidor.');
        });
}

async function eliminarPromocion(id) {
    if (!confirm(`¿Está seguro de eliminar la promoción #${id}?`)) return;

    const data = {
        action: 'eliminar',
        id_promo: id
    };
    
    const successMsg = 'Promoción eliminada correctamente.';
    const errorMsg = 'Error al eliminar la promoción: ';
    
    if (await crudOperation(API_BASE_URL, 'POST', data, successMsg, errorMsg)) {
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

document.addEventListener("DOMContentLoaded", () => {
    modalPromocion = new bootstrap.Modal(document.getElementById('modal-promocion'));
    cargarPromociones();

    document.getElementById('modal-promocion').addEventListener('hidden.bs.modal', function () {
        document.getElementById('formulario-promocion').reset();
        document.getElementById('id_promo_oculto').value = '';
        document.getElementById('modalLabel').textContent = 'Crear Promoción';
    });
});