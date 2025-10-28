// Variable global para almacenar el endpoint de tu API
// AJUSTA ESTA URL para que apunte correctamente a tu Backend
const API_URL = "../Backend/routes/api.php?url=habitacion"; 
const formHabitacion = document.getElementById('formulario-habitacion');
const modalHabitacion = new bootstrap.Modal(document.getElementById('modal-habitacion'));

// 1. FUNCIÓN PRINCIPAL: OBTENER Y MOSTRAR DATOS EN LA TABLA
async function obtenerYRenderizarHabitaciones() {
    try {
        const respuesta = await fetch(API_URL);
        const habitaciones = await respuesta.json();
        
        if (!Array.isArray(habitaciones)) {
            // Manejar caso donde el backend podría devolver un mensaje de error no envuelto en array
            throw new Error("Respuesta inválida del servidor o endpoint no devuelve un array.");
        }

        const tbody = document.getElementById("cuerpo-tabla-habitaciones");
        tbody.innerHTML = ''; // Limpia el contenido actual

        if (habitaciones.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay habitaciones para administrar.</td></tr>';
            return;
        }

        habitaciones.forEach((hab, index) => {
            const fila = `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${hab.tipo_hab}</td>
                    <td>$${hab.precio}</td>
                    <td>${hab.descripcion_hab.substring(0, 50)}...</td>
                    <td><img src="../Fronted/img/${hab.imagen}" alt="${hab.tipo_hab}" width="70"></td>
                    <td>
                        <button type="button" class="btn btn-sm btn-primary editar-btn" data-id="${hab.id_hab}">
                            <i class="material-icons align-middle" style="font-size: 18px;">edit</i>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger eliminar-btn" data-id="${hab.id_hab}">
                            <i class="material-icons align-middle" style="font-size: 18px;">delete</i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
        
        agregarListenersAcciones();

    } catch (error) {
        console.error("Error al cargar habitaciones para gestión:", error);
        document.getElementById("cuerpo-tabla-habitaciones").innerHTML = `
            <tr><td colspan="6" class="text-danger text-center">Error al conectar con la API: ${error.message}</td></tr>
        `;
    }
}


// 2. LÓGICA DE ENVÍO DE FORMULARIO (Crear y Editar)
formHabitacion.addEventListener('submit', async function(event) {
    event.preventDefault();
    const idHab = document.getElementById('id_hab_oculto').value;
    const esEdicion = idHab !== '';

    const formData = new FormData(this);

    // Determinar método y endpoint
    const method = esEdicion ? 'POST' : 'POST'; // Usamos POST para manejar FormData y archivos, tu backend debe diferenciar la operación
    const endpoint = esEdicion ? `${API_URL}&id=${idHab}&action=update` : `${API_URL}&action=create`;

    // **NOTA IMPORTANTE SOBRE PUT/DELETE y PHP:**
    // Los navegadores solo envían FormData con POST. Para simular PUT o DELETE y manejar
    // archivos al mismo tiempo, es común enviar un campo oculto (action=update) y usar POST.
    // Tu backend de PHP debe estar configurado para leer este 'action'.

    try {
        const respuesta = await fetch(endpoint, {
            method: method,
            body: formData 
        });

        // Asumiendo que tu backend devuelve JSON.
        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert(esEdicion ? 'Habitación actualizada con éxito.' : 'Habitación creada con éxito.');
            modalHabitacion.hide();
            obtenerYRenderizarHabitaciones(); 
        } else {
            alert('Error al guardar: ' + (resultado.message || respuesta.statusText || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error al enviar el formulario:", error);
        alert('Ocurrió un error de conexión al servidor.');
    }
});


// 3. LÓGICA PARA ELIMINAR
async function eliminarHabitacion(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta habitación? Esta acción no se puede deshacer.')) {
        return;
    }

    // Usamos POST con una acción de eliminación, ya que FormData no funciona bien con DELETE.
    const endpoint = `${API_URL}&id=${id}&action=delete`;

    try {
        const respuesta = await fetch(endpoint, {
            method: 'POST',
            // Tu backend debe estar configurado para leer esto como una eliminación.
            body: JSON.stringify({id: id, action: 'delete'}) 
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert('Habitación eliminada correctamente.');
            obtenerYRenderizarHabitaciones(); 
        } else {
            alert('Error al eliminar: ' + (resultado.message || respuesta.statusText || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error al eliminar la habitación:", error);
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
                // Abre el modal inmediatamente para la experiencia de usuario
                modalHabitacion.show(this); 

                // Carga los datos
                const respuesta = await fetch(`${API_URL}&id=${id}`);
                const hab = await respuesta.json();

                if (hab && hab.id_hab) {
                    document.getElementById('modalLabel').textContent = 'Editar Habitación ID: ' + hab.id_hab;
                    document.getElementById('id_hab_oculto').value = hab.id_hab;
                    document.getElementById('tipo_hab').value = hab.tipo_hab;
                    document.getElementById('precio').value = hab.precio;
                    document.getElementById('descripcion_hab').value = hab.descripcion_hab;
                    document.getElementById('imagen_hab').value = ''; 
                } else {
                    alert("Error: Datos de habitación no encontrados.");
                    modalHabitacion.hide();
                }
            } catch (error) {
                console.error("Error al cargar datos para edición:", error);
                alert("No se pudieron cargar los datos de la habitación.");
                modalHabitacion.hide();
            }
        });
    });

    // Evento para Eliminar
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            eliminarHabitacion(this.dataset.id);
        });
    });
}

// Evento que se dispara al abrir el modal (prepara el modo "Añadir Nuevo")
document.getElementById('modal-habitacion').addEventListener('show.bs.modal', function (event) {
    const botonActivador = event.relatedTarget;
    // Si el botón activador es el de "Añadir Nueva Habitación"
    if (botonActivador && botonActivador.textContent.includes('Añadir')) {
        document.getElementById('modalLabel').textContent = 'Añadir Nueva Habitación';
        formHabitacion.reset();
        document.getElementById('id_hab_oculto').value = ''; // Indica que es una creación (POST)
    }
    // Si el botón activador tiene data-id (es un botón de editar), la función agregarListenersAcciones ya cargó los datos.
});


// INICIALIZACIÓN: Carga la tabla al iniciar la página
document.addEventListener("DOMContentLoaded", obtenerYRenderizarHabitaciones);