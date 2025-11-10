const API_LIST_TODAY_URL = "../../Backend/routes/api.php?url=reserva&action=list_today"; 
const modalReserva = new bootstrap.Modal(document.getElementById('modal-reserva'));

document.addEventListener("DOMContentLoaded", () => {
    cargarReservasHoy();
});

async function cargarReservasHoy() {
    const tbody = document.getElementById("cuerpo-tabla-reservas-hoy");
    if (!tbody) return; 

    const loadingRow = '<tr><td colspan="7" class="text-center"><i class="bi bi-arrow-clockwise spinner-border spinner-border-sm me-2"></i> Cargando reservas...</td></tr>';
    tbody.innerHTML = loadingRow;

    try {
        const response = await fetch(API_LIST_TODAY_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const reservas = await response.json();

        tbody.innerHTML = '';

        if (!Array.isArray(reservas) || reservas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">🎉 ¡Hoy no hay check-ins programados!</td></tr>';
            return;
        }

        reservas.forEach(reserva => {
            const huespedes = `${reserva.adultos || 0} Adultos / ${reserva.niños || 0} Niños`;
            
            const fila = `
                <tr>
                    <th scope="row">${reserva.id_reserva}</th>
                    <td>${reserva.id_usuario || 'Invitado'}</td>
                    <td>${reserva.id_habitacion}</td>
                    <td><span class="badge text-bg-success">${reserva.fecha_inicio}</span></td>
                    <td>${reserva.fecha_fin}</td>
                    <td>${huespedes}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-info ver-detalles-btn shadow-none" data-id="${reserva.id_reserva}">
                            <i class="bi bi-eye-fill"></i> Detalles
                        </button>
                        <button type="button" class="btn btn-sm btn-primary checkin-btn shadow-none" data-id="${reserva.id_reserva}">
                            <i class="bi bi-door-open-fill"></i> Check-in
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += fila;
        });

        agregarListeners();

    } catch (error) {
        console.error("Error al cargar la lista de reservas de hoy:", error);
        tbody.innerHTML = '<tr><td colspan="7" class="text-danger text-center">❌ Error de conexión al servidor.</td></tr>';
    }
}

function agregarListeners() {
    document.querySelectorAll('.ver-detalles-btn').forEach(btn => {
        btn.onclick = () => verDetallesReserva(btn.dataset.id);
    });

    document.querySelectorAll('.checkin-btn').forEach(btn => {
        btn.onclick = () => alert(`Realizando Check-in para Reserva #${btn.dataset.id}. (Falta implementar lógica)`);
    });
}

function verDetallesReserva(id) {
    document.getElementById('res-id-display').textContent = id;
    modalReserva.show();
}


modalReserva._element.addEventListener('hidden.bs.modal', function () {
});