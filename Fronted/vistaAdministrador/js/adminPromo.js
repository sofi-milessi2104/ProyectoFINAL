 const API_BASE_URL = 'http://localhost/ProyectoFinal/Backend/routes/api.php?url=promocion';
 const modalPromocion = new bootstrap.Modal(document.getElementById('modal-promocion'));

async function crudOperation(url, method, data, successMsg, errorMsg) {
    try {
        const respuesta = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: ['POST', 'PUT', 'DELETE'].includes(method) ? JSON.stringify(data) : null
        });
        
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
                            <td>${promo.img_promo ? '<i class="bi bi-image-fill text-success"></i>' : 'N/A'}</td>
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
    
    const data = {};
    const formData = new FormData(e.target);
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    const id = document.getElementById('id_promo_oculto').value;
    
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
        if (typeof modalPromocion !== 'undefined' && modalPromocion.hide) {
            modalPromocion.hide();
        }
        cargarPromociones();
    }
});

function editarPromocion(id) {
    fetch(`${API_BASE_URL}?url=promocion&id=${id}`) 
        .then(res => res.json())
        .then(promo => {
            if (promo && promo.id_promo) { 
                document.getElementById('modalLabel').textContent = 'Editar Promoción';
                document.getElementById('id_promo_oculto').value = promo.id_promo;
                document.getElementById('titulo_promo').value = promo.tipo_promo;
                document.getElementById('descripcion_promo').value = promo.descripcion_promo;
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

document.addEventListener("DOMContentLoaded", () => {
    cargarPromociones();

    document.getElementById('modal-promocion').addEventListener('hidden.bs.modal', function () {
        document.getElementById('formulario-promocion').reset();
        document.getElementById('id_promo_oculto').value = '';
        document.getElementById('modalLabel').textContent = 'Crear Promoción';
    });
    
    if (typeof bootstrap !== 'undefined') {
        window.modalPromocion = new bootstrap.Modal(document.getElementById('modal-promocion'));
    }
});