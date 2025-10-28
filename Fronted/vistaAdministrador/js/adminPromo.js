// Variable global para almacenar el endpoint de tu API de Promociones
// AJUSTA ESTA URL para que apunte correctamente a tu Backend
const API_URL_PROMOS = "../Backend/routes/api.php?url=promocion"; 
const formPromocion = document.getElementById('formulario-promocion');
const modalPromocion = new bootstrap.Modal(document.getElementById('modal-promocion'));

// --- Funciones de Utilidad ---
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/A';
    // Formato YYYY-MM-DD a DD/MM/YYYY
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
}

// 1. FUNCIÓN PRINCIPAL: OBTENER Y MOSTRAR DATOS EN LA TABLA
async function obtenerYRenderizarPromociones() {
    try {
        const respuesta = await fetch(API_URL_PROMOS);
        const promociones = await respuesta.json();
        
        if (!Array.isArray(promociones)) {
            throw new Error("Respuesta inválida del servidor o endpoint no devuelve un array.");
        }

        const tbody = document.getElementById("cuerpo-tabla-promociones");
        tbody.innerHTML = ''; // Limpia el contenido actual

        if (promociones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay promociones para administrar.</td></tr>';
            return;
        }

        promociones.forEach((promo, index) => {
            const fechaFin = formatearFecha(promo.fecha_fin);
            const fila = `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td class="text-start fw-bold">${promo.titulo}</td>
                    <td>${promo.descuento}</td>
                    <td>${fechaFin}</td>
                    <td><img src="../Fronted/img/${promo.imagen}" alt="${promo.titulo}" width="70"></td>
                    <td>
                        <button type="button" class="btn btn-sm btn-primary editar-btn" data-id="${promo.id_promo}">
                            <i class="bi bi-pencil-square align-middle"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger eliminar-btn" data-id="${promo.id_promo}">
                            <i class="bi bi-trash-fill align-middle"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
        
        agregarListenersAcciones();

    } catch (error) {
        console.error("Error al cargar promociones para gestión:", error);
        document.getElementById("cuerpo-tabla-promociones").innerHTML = `
            <tr><td colspan="6" class="text-danger text-center">Error al conectar con la API: ${error.message}</td></tr>
        `;
    }
}


// 2. LÓGICA DE ENVÍO DE FORMULARIO (Crear y Editar)
formPromocion.addEventListener('submit', async function(event) {
    event.preventDefault();
    const idPromo = document.getElementById('id_promo_oculto').value;
    const esEdicion = idPromo !== '';

    const formData = new FormData(this);

    // Determinar método y endpoint. Se usa POST para subir archivos.
    const method = 'POST'; 
    const endpoint = esEdicion ? `${API_URL_PROMOS}&id=${idPromo}&action=update` : `${API_URL_PROMOS}&action=create`;

    try {
        const respuesta = await fetch(endpoint, {
            method: method,
            body: formData 
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert(esEdicion ? 'Promoción actualizada con éxito.' : 'Promoción creada con éxito.');
            modalPromocion.hide();
            obtenerYRenderizarPromociones(); 
        } else {
            alert('Error al guardar: ' + (resultado.message || respuesta.statusText || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error al enviar el formulario:", error);
        alert('Ocurrió un error de conexión al servidor.');
    }
});


// 3. LÓGICA PARA ELIMINAR
async function eliminarPromocion(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta promoción? Esta acción no se puede deshacer.')) {
        return;
    }

    const endpoint = `${API_URL_PROMOS}&id=${id}&action=delete`;

    try {
        const respuesta = await fetch(endpoint, {
            method: 'POST', // Usamos POST para simular DELETE con PHP/FormData
            body: JSON.stringify({id: id, action: 'delete'}) 
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert('Promoción eliminada correctamente.');
            obtenerYRenderizarPromociones(); 
        } else {
            alert('Error al eliminar: ' + (resultado.message || respuesta.statusText || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error al eliminar la promoción:", error);
        alert('Ocurrió un error de conexión al servidor.');
    }
}

// 4. FUNCIÓN AUXILIAR: Añadir Listeners a botones de Editar/Eliminar
function agregarListenersAcciones() {
    // Evento para Editar
    document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const id = this.dataset.id;
            
            try {
                modalPromocion.show(this); 

                // Carga los datos de la promoción específica
                const respuesta = await fetch(`${API_URL_PROMOS}&id=${id}`);
                const promo = await respuesta.json();

                if (promo && promo.id_promo) {
                    document.getElementById('modalLabel').textContent = 'Editar Promoción ID: ' + promo.id_promo;
                    document.getElementById('id_promo_oculto').value = promo.id_promo;
                    document.getElementById('titulo_promo').value = promo.titulo;
                    document.getElementById('descripcion_promo').value = promo.descripcion;
                    document.getElementById('descuento_promo').value = promo.descuento;
                    // Los campos de fecha deben cargarse en formato YYYY-MM-DD
                    document.getElementById('fecha_fin_promo').value = promo.fecha_fin;
                    document.getElementById('imagen_promo').value = ''; // Resetea el campo file
                } else {
                    alert("Error: Datos de la promoción no encontrados.");
                    modalPromocion.hide();
                }
            } catch (error) {
                console.error("Error al cargar datos para edición:", error);
                alert("No se pudieron cargar los datos de la promoción.");
                modalPromocion.hide();
            }
        });
    });

    // Evento para Eliminar
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            eliminarPromocion(this.dataset.id);
        });
    });
}

// Evento que se dispara al abrir el modal (prepara el modo "Añadir Nuevo")
document.getElementById('modal-promocion').addEventListener('show.bs.modal', function (event) {
    const botonActivador = event.relatedTarget;
    // Si el botón activador es el de "Crear Nueva Promoción"
    if (botonActivador && botonActivador.textContent.includes('Crear')) {
        document.getElementById('modalLabel').textContent = 'Crear Nueva Promoción';
        formPromocion.reset();
        document.getElementById('id_promo_oculto').value = ''; // Indica que es una creación
    }
});


// INICIALIZACIÓN: Carga la tabla al iniciar la página
document.addEventListener("DOMContentLoaded", obtenerYRenderizarPromociones);