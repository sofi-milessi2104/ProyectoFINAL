const API_URL_BASE = "http://localhost/ProyectoFinal/Backend/routes/api.php?url=reserva"; 
const API_URL_RESERVAS = `${API_URL_BASE}`; 
const API_CONTROLLER_PATH = '../../Backend/controllers/reserva.php'; 
const modalDetalle = new bootstrap.Modal(document.getElementById('modal-detalle-reserva'));

function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/A';
    const date = new Date(fechaISO + 'T00:00:00'); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

async function fetchReservasData() { 
    const tbody = document.getElementById("cuerpo-tabla-reservas");
    tbody.innerHTML = '<tr><td colspan="10" class="text-center">Cargando reservas...</td></tr>'; 
    try {
        const respuesta = await fetch(`${API_CONTROLLER_PATH}?action=listar`);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
        }
        
        const resultado = await respuesta.json();
        
        const dataArray = Array.isArray(resultado) ? resultado : resultado.data;

        if (!Array.isArray(dataArray)) {
            console.error("Respuesta del servidor no es un array:", resultado);
            throw new Error("Respuesta inválida. El servidor no devolvió un listado de reservas.");
        }
        
        return dataArray;

    } catch (error) {
        console.error("Error en la operación de fetch:", error);
        tbody.innerHTML = `
            <tr><td colspan="10" class="text-danger text-center">Error: ${error.message}. Verifica la API.</td></tr>
        `;
        return null;
    }
}

async function obtenerYRenderizarReservas() {
    const tbody = document.getElementById("cuerpo-tabla-reservas");
    tbody.innerHTML = '<tr><td colspan="10" class="text-center">Cargando reservas...</td></tr>'; 
    
    const reservas = await fetchReservasData(); 
    
    if (!reservas) {
        return; 
    }

    tbody.innerHTML = ''; 

    if (reservas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No hay reservas pendientes o activas.</td></tr>';
        return;
    }

    reservas.forEach((reserva, index) => {
        const fechaInicio = formatearFecha(reserva.fecha_inicio);
        const fechaFin = formatearFecha(reserva.fecha_fin);
        
        const nombreCliente = reserva.nombre_cliente ? `${reserva.nombre_cliente} ${reserva.apellido_cliente}` : 'Cliente Sin Registrar';
        
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
                    <td>${reserva.adultos || '1'}</td> 
                    <td>${reserva.niños || '0'}</td> 
                    <td>${fechaInicio}</td> 
                    <td>${fechaFin}</td> 
                    <td>${reserva.tipo_hab} ($${reserva.precio} USD)</td> 
                    <td>
                        <button type="button" class="btn btn-sm btn-info text-white detalle-servicios-btn shadow-none" data-id="${reserva.id_reserva}">
                            Ver Servicios
                        </button>
                    </td> 
                    <td><span class="badge ${badgeClass}">${estado}</span></td> 
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-success check-in-btn shadow-none" data-id="${reserva.id_reserva}" title="Marcar Check-in/Activa" ${['Activa', 'Cancelada', 'Finalizada'].includes(estado) ? 'disabled' : ''}>
                            <i class="bi bi-check-circle-fill"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger cancelar-btn shadow-none" data-id="${reserva.id_reserva}" title="Cancelar Reserva" ${['Cancelada', 'Finalizada'].includes(estado) ? 'disabled' : ''}>
                            <i class="bi bi-x-square-fill"></i>
                        </button>
                    </td>
                </tr>
        `;
        tbody.innerHTML += fila;
    });
    
    agregarListenersAcciones();
}

async function mostrarDetallesReserva(id) {
    try {
        const respuesta = await fetch(`${API_CONTROLLER_PATH}?id=${id}&action=detalles`);
        
        if (!respuesta.ok) {
            throw new Error(`Error al obtener detalles: ${respuesta.statusText}`);
        }
        
        const detalle = await respuesta.json(); 
        
        if (!detalle || !detalle.id_reserva) {
            alert('No se pudieron cargar los detalles de la reserva. (ID no encontrado o respuesta vacía).');
            return;
        }

        document.getElementById('reserva-id-modal').textContent = id;
        
        document.getElementById('detalle-habitacion').innerHTML = `
            <li>**Tipo:** ${detalle.tipo_hab}</li>
            <li>**Descripción:** ${detalle.descripcion_hab || 'N/A'}</li>
            <li>**Precio/Noche:** $${detalle.precio} USD</li>
            <li>**Estadía:** Del ${formatearFecha(detalle.fecha_inicio)} al ${formatearFecha(detalle.fecha_fin)}</li>
        `;
        
        const listaServicios = document.getElementById('lista-servicios-modal');
        listaServicios.innerHTML = '';

        if (detalle.servicios && detalle.servicios.length > 0) {
            detalle.servicios.forEach(servicio => {
                listaServicios.innerHTML += `<li class="list-group-item">${servicio.tipo_servicio} - $${servicio.precio_servicio}</li>`;
            });
        } else {
            listaServicios.innerHTML = '<li class="list-group-item text-muted">No se contrataron servicios adicionales.</li>';
        }
        
        const ultimosDigitos = detalle.tarjeta || 'XXXX';
        document.getElementById('detalle-pago').textContent = `**** **** **** ${ultimosDigitos.slice(-4)}`;

        modalDetalle.show();

    } catch (error) {
        console.error("Error al obtener detalles:", error);
        alert("Ocurrió un error al intentar cargar los detalles de la reserva. (Ver consola)");
    }
}

async function cambiarEstadoReserva(id, nuevaAccion) {
    const estadoTexto = nuevaAccion === 'cancelar' ? 'CANCELAR' : 'MARCAR CHECK-IN';
    if (!confirm(`¿Está seguro de querer ${estadoTexto} la reserva #${id}?`)) {
        return;
    }

    const endpoint = API_CONTROLLER_PATH;

    try {
        const payload = {
            action: nuevaAccion === 'cancelar' ? 'cancelarReserva' : 'checkInReserva',
            id_reserva: id
        };

        const respuesta = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        let resultado = { success: false, message: 'Respuesta vacía o error.' };
        if (respuesta.ok) {
             resultado = await respuesta.json();
        } 

        if (resultado && resultado.success) {
            alert(resultado.message || `Reserva #${id} actualizada con éxito.`);
            obtenerYRenderizarReservas();
        } else {
            alert('Error al actualizar el estado: ' + (resultado.message || `Error del servidor (${respuesta.status}).`));
        }

    } catch (error) {
        console.error("Error de conexión o parseo al cambiar estado:", error);
        alert('Ocurrió un error de conexión o al procesar la respuesta del servidor.');
    }
}

function agregarListenersAcciones() {
    document.querySelectorAll('.detalle-servicios-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            mostrarDetallesReserva(this.dataset.id);
        });
    });
    document.querySelectorAll('.cancelar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            cambiarEstadoReserva(this.dataset.id, 'cancelar');
        });
    });
    document.querySelectorAll('.check-in-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            cambiarEstadoReserva(this.dataset.id, 'checkin'); 
        });
    });
}

document.addEventListener("DOMContentLoaded", obtenerYRenderizarReservas);