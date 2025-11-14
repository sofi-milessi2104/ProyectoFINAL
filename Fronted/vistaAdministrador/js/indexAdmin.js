const API_BASE_URL = "../../Backend/routes/api.php"; 
const API_INGRESOS_URL = "../../Backend/routes/ingresos.php";
const API_RESERVAS_URL = "../../Backend/routes/reservasAdmin.php"; // URL para contar reservas

async function actualizarConteoUsuarios() {
    const elementoConteo = document.getElementById('total-usuarios');
    if (!elementoConteo) return;
    
    elementoConteo.textContent = '...';

    try {
        const url = `${API_BASE_URL}?url=usuario&action=conteo`; 
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`Error de servidor. Código HTTP: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();

        // Lógica mejorada para manejar arrays o el objeto {total: N}
        if (Array.isArray(data)) {
            elementoConteo.textContent = data.length;
            console.warn(`La API de conteo devolvió un array (longitud: ${data.length}). Se usó la longitud.`);
        } else if (data.success && data.total !== undefined) {
            elementoConteo.textContent = data.total; 
            console.log("Conteo de usuarios actualizado con éxito:", data.total);
        } else {
            elementoConteo.textContent = 'Error API';
            console.error("Error en datos recibidos, se esperaba array o {total: N}, se recibió:", data);
        }

    } catch (error) {
        console.error("Fallo la llamada al conteo de usuarios:", error);
        elementoConteo.textContent = 'Falla JS';
    }
}

// FUNCIÓN CORREGIDA Y DINÁMICA
async function actualizarIngresosMes() {
    const elementoIngresos = document.getElementById('ingresos-mes');
    if (!elementoIngresos) return;
    
    elementoIngresos.textContent = '...'; // Indicador de carga

    try {
        // Llama al endpoint de ingresos con la acción 'mes'
        const url = `${API_INGRESOS_URL}?action=mes`; 
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) throw new Error(`Error de servidor. Código HTTP: ${respuesta.status}`);
        
        const data = await respuesta.json();

        if (data.success && data.ingresos_mes !== undefined) {
            
            // Formatear el valor
            const valorFormateado = data.ingresos_mes.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'UYU', // Ajusta tu moneda si no es USD (ej: 'ARS', 'MXN', 'UYU')
                minimumFractionDigits: 0
            });
            
            elementoIngresos.textContent = valorFormateado; 

        } else {
            elementoIngresos.textContent = '$0';
            console.error("Error en datos recibidos del API de ingresos:", data);
        }

    } catch (error) {
        console.error("Fallo la llamada a Ingresos del Mes:", error);
        elementoIngresos.textContent = 'Falla';
    }
}

// NUEVA FUNCIÓN: Carga dinámicamente el total de reservas
async function actualizarReservasHoy() {
    const elementoReservas = document.getElementById('reservas-hoy');
    if (!elementoReservas) return;
    
    elementoReservas.textContent = '...'; // Indicador de carga

    try {
        const respuesta = await fetch(API_RESERVAS_URL);
        
        if (!respuesta.ok) throw new Error(`Error de servidor. Código HTTP: ${respuesta.status}`);
        
        const reservas = await respuesta.json();

        // Verificar que sea un array y contar el total
        if (Array.isArray(reservas)) {
            elementoReservas.textContent = reservas.length;
            console.log("Total de reservas actualizado:", reservas.length);
        } else {
            elementoReservas.textContent = '0';
            console.error("Error: El API de reservas no devolvió un array", reservas);
        }

    } catch (error) {
        console.error("Fallo la llamada al conteo de reservas:", error);
        elementoReservas.textContent = 'Falla';
    }
}

// Cargar resumen del día
async function cargarResumenDia() {
    try {
        // Obtener reservas y habitaciones
        const [respuestaReservas, respuestaHabitaciones] = await Promise.all([
            fetch(API_RESERVAS_URL),
            fetch(`${API_BASE_URL}?url=habitacion`)
        ]);
        
        const reservas = await respuestaReservas.json();
        const habitaciones = await respuestaHabitaciones.json();
        
        // Obtener fecha de hoy en formato YYYY-MM-DD
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        const fechaHoy = `${año}-${mes}-${dia}`;
        
        console.log("Fecha de hoy:", fechaHoy);
        console.log("Reservas:", reservas);
        
        // Calcular métricas
        const habitacionesOcupadas = Array.isArray(reservas) ? reservas.filter(r => {
            const checkIn = r.check_in.split(' ')[0]; // Por si viene con hora
            const checkOut = r.check_out.split(' ')[0];
            return checkIn <= fechaHoy && checkOut >= fechaHoy;
        }).length : 0;
        
        const totalHabitaciones = Array.isArray(habitaciones) ? habitaciones.length : 40;
        const tasaOcupacion = totalHabitaciones > 0 ? Math.round((habitacionesOcupadas / totalHabitaciones) * 100) : 0;
        
        const checkinsHoy = Array.isArray(reservas) ? reservas.filter(r => {
            const checkIn = r.check_in.split(' ')[0];
            console.log("Comparando check_in:", checkIn, "con", fechaHoy);
            return checkIn === fechaHoy;
        }).length : 0;
        
        const checkoutsHoy = Array.isArray(reservas) ? reservas.filter(r => {
            const checkOut = r.check_out.split(' ')[0];
            return checkOut === fechaHoy;
        }).length : 0;
        
        console.log("Check-ins hoy:", checkinsHoy);
        console.log("Check-outs hoy:", checkoutsHoy);
        
        // Actualizar UI
        const elemHabOcupadas = document.getElementById('habitaciones-ocupadas');
        const elemCheckins = document.getElementById('checkins-dia');
        const elemCheckouts = document.getElementById('checkouts-dia');
        const elemTasa = document.getElementById('tasa-ocupacion');
        
        if (elemHabOcupadas) elemHabOcupadas.textContent = habitacionesOcupadas;
        if (elemCheckins) elemCheckins.textContent = checkinsHoy;
        if (elemCheckouts) elemCheckouts.textContent = checkoutsHoy;
        if (elemTasa) elemTasa.textContent = `${tasaOcupacion}%`;
        
    } catch (error) {
        console.error("Error al cargar resumen del día:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarConteoUsuarios();
    actualizarReservasHoy();
    actualizarIngresosMes();
    cargarResumenDia();
    
    console.log("Panel de Administración cargado. Listo para gestionar el hotel.");
});