// Módulo para gestionar la página de Mis Reservas

// Verificar si el usuario está logueado
let usuarioLogueado = null;
try {
    usuarioLogueado = JSON.parse(localStorage.getItem("sesionUser"));
} catch (e) {
    console.error("Error leyendo sesión del usuario:", e);
}

if (!usuarioLogueado) {
    // Si no está logueado, redirigir a la página de login
    window.location.href = "usuario.html";
}

// Mostrar información del usuario en el navbar
document.addEventListener("DOMContentLoaded", function () {
    const userMenuContainer = document.getElementById("userMenuContainer");
    const loginLink = document.getElementById("loginLink");
    const userAvatar = document.getElementById("userAvatar");
    const userEmail = document.getElementById("userEmail");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    if (usuarioLogueado) {
        // Mostrar menú de usuario y ocultar botón de login
        loginLink.style.display = "none";
        userMenuContainer.style.display = "block";

        // Configurar avatar con la inicial del nombre
        const inicial = usuarioLogueado.nombre ? usuarioLogueado.nombre.charAt(0).toUpperCase() : "U";
        userAvatar.textContent = inicial;
        userEmail.textContent = usuarioLogueado.email;

        // Toggle del dropdown
        userAvatar.addEventListener("click", function () {
            userDropdown.classList.toggle("hidden");
        });

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener("click", function (e) {
            if (!userMenuContainer.contains(e.target)) {
                userDropdown.classList.add("hidden");
            }
        });

        // Logout
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("sesionUser");
            alert("Sesión cerrada correctamente.");
            window.location.href = "index.html";
        });
    }

    // Cargar las reservas del usuario
    cargarReservas();
});

/**
 * Cargar las reservas del usuario desde el backend
 */
async function cargarReservas() {
    const contenedor = document.getElementById("contenedorReservas");
    const spinner = document.getElementById("spinnerCarga");
    const mensajeNoReservas = document.getElementById("mensajeNoReservas");

    try {
        const response = await fetch(
            `../Backend/controllers/reserva.php?action=obtenerReservasUsuario&id_usuario=${usuarioLogueado.id_usuario}`
        );

        const data = await response.json();
        console.log('Datos de reservas:', data); // Debug

        // Ocultar spinner
        spinner.style.display = "none";

        if (data.success && data.reservas && data.reservas.length > 0) {
            mostrarReservas(data.reservas);
        } else {
            // No hay reservas
            mensajeNoReservas.style.display = "block";
        }
    } catch (error) {
        console.error("Error al cargar reservas:", error);
        spinner.style.display = "none";
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Error al cargar las reservas. Por favor, intenta de nuevo más tarde.
                </div>
            </div>
        `;
    }
}

/**
 * Mostrar las reservas en el DOM
 * @param {Array} reservas Lista de reservas
 */
function mostrarReservas(reservas) {
    const contenedor = document.getElementById("contenedorReservas");
    contenedor.innerHTML = "";

    reservas.forEach((reserva) => {
        const estadoReserva = obtenerEstadoReserva(reserva.fecha_inicio, reserva.fecha_fin);
        const totalNoches = reserva.noches || calcularNoches(reserva.fecha_inicio, reserva.fecha_fin);
        const precioTotal = reserva.precio_total || (reserva.precio * totalNoches);
        
        console.log('Reserva:', reserva.id_reserva, 'Noches:', totalNoches, 'Precio:', reserva.precio, 'Total:', precioTotal); // Debug

        const cardHTML = `
            <div class="col-lg-6 col-md-12">
                <div class="reserva-card">
                    ${reserva.imagen ? `<img src="${reserva.imagen}" alt="${reserva.tipo_hab}" class="reserva-imagen">` : '<div class="reserva-imagen bg-secondary d-flex align-items-center justify-content-center text-white"><i class="bi bi-image" style="font-size: 3rem;"></i></div>'}
                    
                    <div class="reserva-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h3 class="reserva-titulo">${reserva.tipo_hab || "Habitación"}</h3>
                            ${estadoReserva.mostrar ? `<span class="estado-badge ${estadoReserva.clase}">${estadoReserva.texto}</span>` : ''}
                        </div>
                        
                        <div class="reserva-info">
                            <div class="info-item">
                                <i class="bi bi-calendar-check"></i>
                                <span><strong>Check-in:</strong> ${formatearFecha(reserva.fecha_inicio)}</span>
                            </div>
                            <div class="info-item">
                                <i class="bi bi-calendar-x"></i>
                                <span><strong>Check-out:</strong> ${formatearFecha(reserva.fecha_fin)}</span>
                            </div>
                            <div class="info-item">
                                <i class="bi bi-moon-stars"></i>
                                <span><strong>Noches:</strong> ${totalNoches}</span>
                            </div>
                            <div class="info-item">
                                <i class="bi bi-people"></i>
                                <span><strong>Huéspedes:</strong> ${reserva.adultos} adulto(s), ${reserva.niños} niño(s)</span>
                            </div>
                        </div>

                        ${reserva.servicios && reserva.servicios.length > 0 ? `
                            <div class="servicios-lista">
                                <div class="servicios-titulo">
                                    <i class="bi bi-star me-1"></i>Servicios incluidos:
                                </div>
                                <div>
                                    ${reserva.servicios.map(s => `<span class="servicio-tag">${s.tipo_servicio}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <div class="precio-total">
                            $${precioTotal.toLocaleString('es-UY')}
                        </div>
                        
                        ${estadoReserva.puedeCancel ? `
                            <div class="mt-3">
                                <button class="btn btn-danger btn-sm w-100" onclick="cancelarReserva(${reserva.id_reserva})">
                                    <i class="bi bi-x-circle me-1"></i>Cancelar Reserva
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        contenedor.innerHTML += cardHTML;
    });
}

/**
 * Determinar el estado de una reserva según las fechas
 * @param {string} fechaInicio 
 * @param {string} fechaFin 
 * @returns {object} Estado con clase CSS y texto
 */
function obtenerEstadoReserva(fechaInicio, fechaFin) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    // Permitir cancelar si el check-out no ha pasado
    const puedeCancel = hoy <= fin;
    
    if (hoy < inicio) {
        return { texto: "Próxima", clase: "estado-proxima", mostrar: true, puedeCancel: puedeCancel };
    } else {
        return { texto: "", clase: "", mostrar: false, puedeCancel: puedeCancel };
    }
}

/**
 * Calcular la cantidad de noches entre dos fechas
 * @param {string} fechaInicio 
 * @param {string} fechaFin 
 * @returns {number} Cantidad de noches
 */
function calcularNoches(fechaInicio, fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diffTime = Math.abs(fin - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Formatear fecha a formato legible
 * @param {string} fecha 
 * @returns {string} Fecha formateada
 */
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

/**
 * Cancelar una reserva
 * @param {number} id_reserva - ID de la reserva a cancelar
 */
window.cancelarReserva = async function(id_reserva) {
    if (!confirm('¿Está seguro de que desea cancelar esta reserva? Esta acción no se puede deshacer.')) {
        return;
    }

    try {
        const response = await fetch('../Backend/controllers/reserva.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'eliminar',
                id_reserva: id_reserva
            })
        });

        const resultado = await response.json();

        if (resultado.success) {
            alert('Reserva cancelada correctamente');
            // Recargar la página para actualizar la lista
            window.location.reload();
        } else {
            alert(resultado.message || 'Error al cancelar la reserva');
        }
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        alert('Error de conexión al cancelar la reserva. Por favor, intente de nuevo.');
    }
}
