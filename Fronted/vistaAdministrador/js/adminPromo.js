// --- Variables Globales (Asegúrate de que API_BASE_URL y modalPromocion estén definidas si es necesario) ---
 const API_BASE_URL = 'http://localhost/ProyectoFinal/Backend/routes/api.php?url=promocion'; // DEBE ESTAR DEFINIDA EN TU AMBIENTE
 const modalPromocion = new bootstrap.Modal(document.getElementById('modal-promocion')); // DEBE ESTAR DEFINIDA

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

        // Asumimos que todas las respuestas de éxito o error contienen JSON
        let resultado;
        try {
            resultado = await respuesta.json();
        } catch (e) {
             // Esto puede ocurrir si el servidor devuelve un 200/204 sin body JSON (como en un DELETE)
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

// ------------------------------------------------------------------
// --- Lógica de PROMOCIONES (CRUD ADAPTADO) ---
// ------------------------------------------------------------------

async function cargarPromociones() {
    const tbody = document.getElementById("cuerpo-tabla-promociones");
    // Colspan de 5: ID, Tipo, Precio, Descripción (implícito), Acciones
    // Nota: El HTML tiene 5 columnas, pero la tabla tiene 6 encabezados (ID, Tipo, Descripción, Imagen, Acciones).
    // Usaremos colspan 5 para que 'Cargando...' cubra la fila, asumiendo que el campo Precio no está visible en la tabla.
    // Si se incluyen todas las columnas del HTML, el colspan debe ser 5.
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando...</td></tr>'; 
    try {
        // Nota: Asume que API_BASE_URL está definida globalmente
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

// *** CORRECCIÓN #1: Cambiado 'form-promocion' a 'formulario-promocion' ***
document.getElementById('formulario-promocion').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario incluyendo el ID oculto
    const data = {};
    const formData = new FormData(e.target);
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    const id = document.getElementById('id_promo_oculto').value; // Usar el ID real del input
    
    let url, method, successMsg, errorMsg;

    if (id) {
        url = `${API_BASE_URL}?url=promocion&id=${id}&action=editar`;
        // En tu backend, probablemente esperas un POST o PUT para editar. Mantengo POST como estaba:
        method = 'POST'; 
        successMsg = 'Promoción actualizada con éxito.';
        errorMsg = 'Error al actualizar la promoción: ';
    } else {
        url = `${API_BASE_URL}?url=promocion&action=agregar`;
        method = 'POST';
        successMsg = 'Promoción creada con éxito.';
        errorMsg = 'Error al crear la promoción: ';
    }

    // Nota: Asume que modalPromocion está definida globalmente
    if (await crudOperation(url, method, data, successMsg, errorMsg)) {
        // Asumiendo que 'modalPromocion' es una instancia de Bootstrap Modal
        if (typeof modalPromocion !== 'undefined' && modalPromocion.hide) {
            modalPromocion.hide();
        }
        cargarPromociones();
    }
});

function editarPromocion(id) {
    // Nota: Asume que API_BASE_URL está definida globalmente
    fetch(`${API_BASE_URL}?url=promocion&id=${id}`) 
        .then(res => res.json())
        .then(promo => {
            if (promo && promo.id_promo) { 
                document.getElementById('modalLabel').textContent = 'Editar Promoción';
                // *** CORRECCIÓN #2: Se usan los IDs correctos del modal HTML ***
                document.getElementById('id_promo_oculto').value = promo.id_promo; // ID Oculto
                document.getElementById('titulo_promo').value = promo.tipo_promo; // Título (mapeado a tipo_promo)
                document.getElementById('descripcion_promo').value = promo.descripcion_promo; // Descripción
                // El campo 'precio_promo' no existe en el HTML proporcionado, pero si lo tuvieras, sería:
                // document.getElementById('precio_promo_input').value = promo.precio_promo;
                // El campo 'imagen_promo' es un input de tipo file, no se puede pre-llenar por seguridad.
                // document.getElementById('imagen_promo').value = promo.img_promo; // Solo si fuera un campo de texto con la URL

                // Asume que modalPromocion está definida globalmente
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

// ------------------------------------------------------------------
// --- Inicialización General ---
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Nota: Se asume que la función 'cargarHabitaciones()' existe en otro archivo o está incompleta.
    // cargarHabitaciones(); 
    
    // Nota: La pestaña de promociones no está en este HTML, pero si existiera, se mantendría este listener.
    // document.getElementById('promociones-tab').addEventListener('shown.bs.tab', cargarPromociones); 

    // Cargar promociones al cargar la página (ya que esta es la página de promociones)
    cargarPromociones();

    // *** CORRECCIÓN #3: Se usan los IDs correctos para la limpieza del modal ***
    document.getElementById('modal-promocion').addEventListener('hidden.bs.modal', function () {
        document.getElementById('formulario-promocion').reset();
        document.getElementById('id_promo_oculto').value = ''; // Usar el ID oculto real
        document.getElementById('modalLabel').textContent = 'Crear Promoción'; // Corregido a 'modalLabel'
    });
    
    // Inicializar el modal de Bootstrap
    if (typeof bootstrap !== 'undefined') {
        window.modalPromocion = new bootstrap.Modal(document.getElementById('modal-promocion'));
    }
});