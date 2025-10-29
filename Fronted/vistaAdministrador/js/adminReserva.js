// Variable global para almacenar el endpoint de tu API de Reservas
// ⭐ ¡AJUSTA ESTA URL! Asegúrate de que la ruta a api.php sea correcta
const API_URL_RESERVAS = "../../Backend/routes/api.php?url=reserva"; 
const modalDetalle = new bootstrap.Modal(document.getElementById('modal-detalle-reserva'));

// --- Funciones de Utilidad ---
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/A';
    // Formato YYYY-MM-DD a DD/MM/YYYY
    const [year, month, day] = fechaISO.split('-');
    return `${day}/${month}/${year}`;
}

// 1. FUNCIÓN PRINCIPAL: OBTENER Y MOSTRAR DATOS EN LA TABLA
async function obtenerYRenderizarReservas() {
    try {
        const respuesta = await fetch('../../Backend/routes/api2.php');
        
        // Verifica si la respuesta es OK antes de intentar parsear JSON
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
        }
        
        const reservas = await respuesta.json();
        
        if (!Array.isArray(reservas)) {
            // Esto atrapa el error de JSON mal formado (como recibir HTML/string)
            throw new Error("Respuesta inválida del servidor o endpoint no devuelve un array.");
        }

        const tbody = document.getElementById("cuerpo-tabla-reservas");
        tbody.innerHTML = ''; // Limpia el contenido actual

        if (reservas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay reservas pendientes o activas.</td></tr>';
            return;
        }

        reservas.forEach((reserva, index) => {
            const fechaInicio = formatearFecha(reserva.fecha_inicio);
            const fechaFin = formatearFecha(reserva.fecha_fin);
            
            const nombreCliente = reserva.nombre_cliente ? `${reserva.nombre_cliente} ${reserva.apellido_cliente}` : 'Cliente Sin Registrar';
            
            // Lógica para asignar estilo de estado
            let estado = reserva.estado || 'Desconocido';
            let badgeClass = 'bg-secondary';
            
            switch (estado) {
                case 'Pendiente':
                    badgeClass = 'bg-warning text-dark';
                    break;
                case 'Activa':
                case 'Check-in':
                    badgeClass = 'bg-success';
                    break;
                case 'Cancelada':
                    badgeClass = 'bg-danger';
                    break;
                case 'Finalizada':
                    badgeClass = 'bg-info';
                    break;
            }

            const fila = `
                <tr>
                    <th scope="row">${reserva.id_reserva}</th>
                    <td class="text-start">${nombreCliente}</td>
                    <td>${fechaInicio} / ${fechaFin}</td>
                    <td>${reserva.adultos || '1'} / ${reserva.niños || '0'}</td>
                    <td>${reserva.tipo_hab} (${reserva.precio}$)**</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-info text-white detalle-servicios-btn shadow-none" data-id="${reserva.id_reserva}">
                            Ver Servicios
                        </button>
                    </td>
                    <td><span class="badge ${badgeClass}">${estado}</span></td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-success check-in-btn shadow-none" data-id="${reserva.id_reserva}" title="Marcar Check-in/Activa" ${estado === 'Activa' ? 'disabled' : ''}>
                            <i class="bi bi-check-circle-fill"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger cancelar-btn shadow-none" data-id="${reserva.id_reserva}" title="Cancelar Reserva" ${estado === 'Cancelada' ? 'disabled' : ''}>
                            <i class="bi bi-x-square-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });
        
        agregarListenersAcciones();

    } catch (error) {
        console.error("Error al cargar reservas para gestión:", error);
        document.getElementById("cuerpo-tabla-reservas").innerHTML = `
            <tr><td colspan="8" class="text-danger text-center">Error: ${error.message}. Verifica la ruta de la API y la respuesta del servidor.</td></tr>
        `;
    }
}


// 2. FUNCIÓN PARA MOSTRAR DETALLES Y SERVICIOS
async function mostrarDetallesReserva(id) {
    try {
        const respuesta = await fetch(`${API_URL_RESERVAS}&id=${id}&action=detalles`);
        
        if (!respuesta.ok) {
            throw new Error(`Error al obtener detalles: ${respuesta.statusText}`);
        }
        
        const detalle = await respuesta.json(); 

        if (!detalle || !detalle.id_reserva) {
            alert('No se pudieron cargar los detalles de la reserva.');
            return;
        }

        document.getElementById('reserva-id-modal').textContent = id;
        
        // Cargar detalles de habitación
        document.getElementById('detalle-habitacion').innerHTML = `
            <li>**Tipo:** ${detalle.tipo_hab}</li>
            <li>**Descripción:** ${detalle.descripcion_hab || 'N/A'}</li>
            <li>**Precio/Noche:** $${detalle.precio}</li>
            <li>**Estadía:** Del ${formatearFecha(detalle.fecha_inicio)} al ${formatearFecha(detalle.fecha_fin)}</li>
        `;
        
        // Cargar servicios adicionales
        const listaServicios = document.getElementById('lista-servicios-modal');
        listaServicios.innerHTML = '';

        if (detalle.servicios && detalle.servicios.length > 0) {
            detalle.servicios.forEach(servicio => {
                listaServicios.innerHTML += `<li class="list-group-item">${servicio.tipo_servicio} - $${servicio.precio_servicio}</li>`;
            });
        } else {
            listaServicios.innerHTML = '<li class="list-group-item text-muted">No se contrataron servicios adicionales.</li>';
        }
        
        // Cargar detalles de pago (usando el campo que trae la API)
        const ultimosDigitos = detalle.tarjeta || 'XXXX';
        document.getElementById('detalle-pago').textContent = `**** **** **** ${ultimosDigitos.slice(-4)}`;

        modalDetalle.show();

    } catch (error) {
        console.error("Error al obtener detalles:", error);
        alert("Ocurrió un error al intentar cargar los detalles de la reserva. (Ver consola)");
    }
}

// 3. LÓGICA PARA CAMBIAR EL ESTADO (Check-in/Cancelación)
async function cambiarEstadoReserva(id, nuevaAccion) {
    const estadoTexto = nuevaAccion === 'cancelar' ? 'CANCELAR' : 'MARCAR CHECK-IN';
    if (!confirm(`¿Está seguro de querer ${estadoTexto} la reserva #${id}?`)) {
        return;
    }

    const endpoint = `${API_URL_RESERVAS}&id=${id}&action=${nuevaAccion}`;

    try {
        const respuesta = await fetch(endpoint, {
            method: 'POST', // Usamos POST para acciones de modificación
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert(resultado.message);
            obtenerYRenderizarReservas(); // Recargar la tabla
        } else {
            alert('Error al actualizar el estado: ' + (resultado.message || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error de conexión al cambiar estado:", error);
        alert('Ocurrió un error de conexión al servidor.');
    }
}

// 4. FUNCIÓN AUXILIAR: Añadir Listeners a los botones
function agregarListenersAcciones() {
    // Listener para el botón "Ver Servicios"
    document.querySelectorAll('.detalle-servicios-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            mostrarDetallesReserva(this.dataset.id);
        });
    });

    // Listener para el botón "Cancelar"
    document.querySelectorAll('.cancelar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            cambiarEstadoReserva(this.dataset.id, 'cancelar');
        });
    });
    
    // Listener para el botón "Check-in"
    document.querySelectorAll('.check-in-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            cambiarEstadoReserva(this.dataset.id, 'checkin'); 
        });
    });
}


// INICIALIZACIÓN: Carga la tabla al iniciar la página
document.addEventListener("DOMContentLoaded", obtenerYRenderizarReservas);