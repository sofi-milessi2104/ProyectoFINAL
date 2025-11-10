const API_BASE_URL = "../../Backend/routes/api.php"; 
const API_INGRESOS_URL = "../../Backend/routes/ingresos.php"; // <--- NUEVA URL DE INGRESOS

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

async function actualizarReservasHoy() {
    const elementoReservas = document.getElementById('reservas-hoy');
    if (!elementoReservas) return;
    // Esto debería ser una llamada a la API, pero por ahora se deja fijo/pendiente
    elementoReservas.textContent = '12'; 
}

async function cargarTareasPendientes() {
    const totalPendientes = 2; // Esto debería venir de la API
    const contador = document.getElementById('contador-pendientes');
    if (contador) contador.textContent = `(${totalPendientes})`;

    const tbody = document.getElementById('cuerpo-tabla-pendientes');
    if (!tbody) return;
    // Aquí iría la lógica para cargar las filas de la tabla desde la API
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarConteoUsuarios();
    actualizarReservasHoy();
    actualizarIngresosMes(); // <--- Ahora carga el valor dinámico
    cargarTareasPendientes();
    
    console.log("Panel de Administración cargado. Listo para gestionar el hotel.");
});