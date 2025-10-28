// Variable global para almacenar el endpoint de tu API de Servicios
// AJUSTA ESTA URL para que apunte correctamente a tu Backend
const API_URL_SERVICIOS = "../Backend/routes/api.php?url=servicio"; 
const formServicio = document.getElementById('formulario-servicio');
const modalServicio = new bootstrap.Modal(document.getElementById('modal-servicio'));

// 1. FUNCIÓN PRINCIPAL: OBTENER Y MOSTRAR DATOS EN LA TABLA
async function obtenerYRenderizarServicios() {
    try {
        const respuesta = await fetch(API_URL_SERVICIOS);
        const servicios = await respuesta.json();
        
        if (!Array.isArray(servicios)) {
            // Manejar caso donde el backend podría devolver un mensaje de error
            throw new Error("Respuesta inválida del servidor o endpoint no devuelve un array.");
        }

        const tbody = document.getElementById("cuerpo-tabla-servicios");
        tbody.innerHTML = ''; // Limpia el contenido actual

        if (servicios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay servicios para administrar.</td></tr>';
            return;
        }

        servicios.forEach((serv, index) => {
            const fila = `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${serv.tipo_servicio}</td>
                    <td>${serv.descripcion_servicio.substring(0, 70)}...</td>
                    <td><img src="../Fronted/img/${serv.imagen}" alt="${serv.tipo_servicio}" width="70"></td>
                    <td>
                        <button type="button" class="btn btn-sm btn-primary editar-btn" data-id="${serv.id_serv}">
                            <i class="bi bi-pencil-square align-middle"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger eliminar-btn" data-id="${serv.id_serv}">
                            <i class="bi bi-trash-fill align-middle"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
        
        agregarListenersAcciones();

    } catch (error) {
        console.error("Error al cargar servicios para gestión:", error);
        document.getElementById("cuerpo-tabla-servicios").innerHTML = `
            <tr><td colspan="5" class="text-danger text-center">Error al conectar con la API: ${error.message}</td></tr>
        `;
    }
}


// 2. LÓGICA DE ENVÍO DE FORMULARIO (Crear y Editar)
formServicio.addEventListener('submit', async function(event) {
    event.preventDefault();
    const idServ = document.getElementById('id_serv_oculto').value;
    const esEdicion = idServ !== '';

    const formData = new FormData(this);

    // Determinar método y endpoint. Se usa POST para subir archivos.
    const method = 'POST'; 
    const endpoint = esEdicion ? `${API_URL_SERVICIOS}&id=${idServ}&action=update` : `${API_URL_SERVICIOS}&action=create`;

    try {
        const respuesta = await fetch(endpoint, {
            method: method,
            body: formData 
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert(esEdicion ? 'Servicio actualizado con éxito.' : 'Servicio creado con éxito.');
            modalServicio.hide();
            obtenerYRenderizarServicios(); 
        } else {
            alert('Error al guardar: ' + (resultado.message || respuesta.statusText || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error al enviar el formulario:", error);
        alert('Ocurrió un error de conexión al servidor.');
    }
});


// 3. LÓGICA PARA ELIMINAR
async function eliminarServicio(id) {
    if (!confirm('¿Está seguro de que desea eliminar este servicio? Esta acción no se puede deshacer.')) {
        return;
    }

    const endpoint = `${API_URL_SERVICIOS}&id=${id}&action=delete`;

    try {
        const respuesta = await fetch(endpoint, {
            method: 'POST', // Usamos POST para simular DELETE con PHP/FormData
            body: JSON.stringify({id: id, action: 'delete'}) 
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert('Servicio eliminado correctamente.');
            obtenerYRenderizarServicios(); 
        } else {
            alert('Error al eliminar: ' + (resultado.message || respuesta.statusText || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error al eliminar el servicio:", error);
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
                modalServicio.show(this); 

                // Carga los datos del servicio específico
                const respuesta = await fetch(`${API_URL_SERVICIOS}&id=${id}`);
                const serv = await respuesta.json();

                if (serv && serv.id_serv) {
                    document.getElementById('modalLabel').textContent = 'Editar Servicio ID: ' + serv.id_serv;
                    document.getElementById('id_serv_oculto').value = serv.id_serv;
                    document.getElementById('tipo_servicio').value = serv.tipo_servicio;
                    document.getElementById('descripcion_servicio').value = serv.descripcion_servicio;
                    document.getElementById('imagen_servicio').value = ''; // Resetea el campo file
                } else {
                    alert("Error: Datos del servicio no encontrados.");
                    modalServicio.hide();
                }
            } catch (error) {
                console.error("Error al cargar datos para edición:", error);
                alert("No se pudieron cargar los datos del servicio.");
                modalServicio.hide();
            }
        });
    });

    // Evento para Eliminar
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            eliminarServicio(this.dataset.id);
        });
    });
}

// Evento que se dispara al abrir el modal (prepara el modo "Añadir Nuevo")
document.getElementById('modal-servicio').addEventListener('show.bs.modal', function (event) {
    const botonActivador = event.relatedTarget;
    // Si el botón activador es el de "Añadir Nuevo Servicio"
    if (botonActivador && botonActivador.textContent.includes('Añadir')) {
        document.getElementById('modalLabel').textContent = 'Añadir Nuevo Servicio';
        formServicio.reset();
        document.getElementById('id_serv_oculto').value = ''; // Indica que es una creación
    }
});


// INICIALIZACIÓN: Carga la tabla al iniciar la página
document.addEventListener("DOMContentLoaded", obtenerYRenderizarServicios);