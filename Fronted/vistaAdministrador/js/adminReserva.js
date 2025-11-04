// Variable global para almacenar el endpoint de tu API de Reservas
// ATENCIÓN: Esta URL se mantiene por contexto.
const API_URL_BASE = "http://localhost/ProyectoFinal/Backend/routes/api.php?url=reserva"; 
const API_URL_RESERVAS = `${API_URL_BASE}`; 
// ⭐ RUTA ASUMIDA CORRECTA: Saliendo dos niveles para llegar al controlador PHP
const API_CONTROLLER_PATH = '../../Backend/controllers/reserva.php'; 
// Asegúrate de que este elemento exista en tu HTML
const modalDetalle = new bootstrap.Modal(document.getElementById('modal-detalle-reserva'));

// --- Funciones de Utilidad ---
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/A';
    // Formato YYYY-MM-DD a DD/MM/YYYY
    const date = new Date(fechaISO + 'T00:00:00'); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

// --- Funciones de Fetch Genéricas para Lectura ---

async function fetchReservasData() { 
    const tbody = document.getElementById("cuerpo-tabla-reservas");
    // Colspan ajustado a 10
    tbody.innerHTML = '<tr><td colspan="10" class="text-center">Cargando reservas...</td></tr>'; 
    try {
        // ⭐ CORRECCIÓN CLAVE: Agregamos explícitamente action=listar a la URL para la lectura inicial.
        const respuesta = await fetch(`${API_CONTROLLER_PATH}?action=listar`);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
        }
        
        const resultado = await respuesta.json(); // Respuesta es un objeto: {success: true, data: [...]} o {success: false, message: ...}
        
        // Intenta obtener el array desde la propiedad 'data' o usa el objeto completo si ya es un array
        const dataArray = Array.isArray(resultado) ? resultado : resultado.data;

        if (!Array.isArray(dataArray)) {
            console.error("Respuesta del servidor no es un array:", resultado);
            throw new Error("Respuesta inválida. El servidor no devolvió un listado de reservas.");
        }
        
        return dataArray;

    } catch (error) {
        console.error("Error en la operación de fetch:", error);
        // Colspan ajustado a 10
        tbody.innerHTML = `
            <tr><td colspan="10" class="text-danger text-center">Error: ${error.message}. Verifica la API.</td></tr>
        `;
        return null;
    }
}


// 1. FUNCIÓN PRINCIPAL: OBTENER Y MOSTRAR DATOS EN LA TABLA
async function obtenerYRenderizarReservas() {
    const tbody = document.getElementById("cuerpo-tabla-reservas");
    // Colspan ajustado a 10
    tbody.innerHTML = '<tr><td colspan="10" class="text-center">Cargando reservas...</td></tr>'; 
    
    // Llama a la función sin argumento de URL
    const reservas = await fetchReservasData(); 
    
    if (!reservas) {
        return; 
    }

    tbody.innerHTML = ''; 

    if (reservas.length === 0) {
        // Colspan ajustado a 10
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

        // Fila con 10 celdas
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


// 2. FUNCIÓN PARA MOSTRAR DETALLES Y SERVICIOS 
async function mostrarDetallesReserva(id) {
    try {
        // Uso de la ruta corregida para detalles (también necesita la acción)
        const respuesta = await fetch(`${API_CONTROLLER_PATH}?id=${id}&action=detalles`);
        
        if (!respuesta.ok) {
            throw new Error(`Error al obtener detalles: ${respuesta.statusText}`);
        }
        
        const detalle = await respuesta.json(); 
        
        if (!detalle || !detalle.id_reserva) {
            alert('No se pudieron cargar los detalles de la reserva. (ID no encontrado o respuesta vacía).');
            return;
        }

        // Cargar detalles de reserva
        document.getElementById('reserva-id-modal').textContent = id;
        
        // Cargar detalles de habitación
        document.getElementById('detalle-habitacion').innerHTML = `
            <li>**Tipo:** ${detalle.tipo_hab}</li>
            <li>**Descripción:** ${detalle.descripcion_hab || 'N/A'}</li>
            <li>**Precio/Noche:** $${detalle.precio} USD</li>
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
        
        // Cargar detalles de pago
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

    // Uso de la ruta corregida para POST
    const endpoint = API_CONTROLLER_PATH;

    try {
        const payload = {
            action: nuevaAccion === 'cancelar' ? 'cancelarReserva' : 'checkInReserva',
            id_reserva: id
        };

        const respuesta = await fetch(endpoint, {
            method: 'POST', // Usamos POST para acciones de modificación
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        let resultado = { success: false, message: 'Respuesta vacía o error.' };
        // Si el servidor responde OK (200-299), intentamos leer el JSON.
        if (respuesta.ok) {
             resultado = await respuesta.json();
        } 

        if (resultado && resultado.success) {
            alert(resultado.message || `Reserva #${id} actualizada con éxito.`);
            obtenerYRenderizarReservas(); // Recargar la tabla
        } else {
            alert('Error al actualizar el estado: ' + (resultado.message || `Error del servidor (${respuesta.status}).`));
        }

    } catch (error) {
        console.error("Error de conexión o parseo al cambiar estado:", error);
        alert('Ocurrió un error de conexión o al procesar la respuesta del servidor.');
    }
}

// 4. FUNCIÓN AUXILIAR: Añadir Listeners a los botones (Sin cambios)
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


// INICIALIZACIÓN: Carga la tabla al iniciar la página
document.addEventListener("DOMContentLoaded", obtenerYRenderizarReservas);