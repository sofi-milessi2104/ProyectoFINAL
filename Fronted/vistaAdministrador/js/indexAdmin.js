// ⭐⭐⭐ admin_index.js ⭐⭐⭐

// --- Configuración Global ---
// ⭐ AJUSTA ESTA RUTA si es necesario. Debe ser la ruta relativa desde la carpeta 'js' hasta 'api.php'
const API_BASE_URL = "../../Backend/routes/api.php"; 

// --- Funciones de Conteo y Obtención de Datos ---

/**
 * 1. Obtiene el conteo total de usuarios registrados desde la API.
 * Endpoint esperado: api.php?url=usuario&action=conteo
 */
async function actualizarConteoUsuarios() {
    // Referencia al elemento que muestra el conteo de usuarios
    const elementoConteo = document.getElementById('total-usuarios');
    if (!elementoConteo) return;
    
    elementoConteo.textContent = '...'; // Indicador de carga

    try {
        // La URL debe especificar la acción de conteo para evitar listar todos los usuarios
        const url = `${API_BASE_URL}?url=usuario&action=conteo`; 
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`Error de servidor. Código HTTP: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();

        // ⭐ Lógica de CORRECCIÓN: Espera un objeto con {success: true, total: N}
        if (data.success && data.total !== undefined) {
            elementoConteo.textContent = data.total; 
            console.log("Conteo de usuarios actualizado con éxito:", data.total);
        } else if (Array.isArray(data)) {
            // Manejar el caso donde el PHP devuelve accidentalmente el array de la lista
            elementoConteo.textContent = data.length;
            console.warn(`La API de conteo devolvió un array (longitud: ${data.length}) en lugar de un objeto. Se usó la longitud.`);
        } else {
            // Maneja cualquier otra respuesta inesperada (que causa el "Error API")
            elementoConteo.textContent = 'Error API';
            console.error("Error en datos recibidos, se esperaba {total: N}, se recibió:", data);
        }

    } catch (error) {
        console.error("Fallo la llamada al conteo de usuarios:", error);
        elementoConteo.textContent = 'Falla JS';
    }
}


/**
 * 2. Función placeholder para actualizar Reservas Hoy (debes implementarla)
 */
async function actualizarReservasHoy() {
    const elementoReservas = document.getElementById('reservas-hoy');
    if (!elementoReservas) return;
    elementoReservas.textContent = '...';
    // Lógica para llamar a api.php?url=reserva&action=conteoHoy
    elementoReservas.textContent = '12'; // Valor estático de ejemplo
}

/**
 * 3. Función placeholder para actualizar Ingresos del Mes (debes implementarla)
 */
async function actualizarIngresosMes() {
    const elementoIngresos = document.getElementById('ingresos-mes');
    if (!elementoIngresos) return;
    elementoIngresos.textContent = '...';
    // Lógica para llamar a api.php?url=reporte&action=ingresosMes
    elementoIngresos.textContent = '$15,480'; // Valor estático de ejemplo
}


/**
 * 4. Función placeholder para cargar Tareas Pendientes (debes implementarla)
 */
async function cargarTareasPendientes() {
    const tbody = document.getElementById('cuerpo-tabla-pendientes');
    if (!tbody) return;
    
    // Aquí cargarías la lista de reservas que están pendientes de confirmación
    // Esto requiere un nuevo endpoint en el ReservaController.php
    
    // Ejemplo de cómo se vería la actualización del contador en el título:
    const totalPendientes = 2; // (Resultado de la llamada a la API)
    document.getElementById('contador-pendientes').textContent = `(${totalPendientes})`;
}


// --- Inicialización ---

document.addEventListener('DOMContentLoaded', () => {
    // Llamadas a todas las funciones de actualización al cargar el dashboard
    actualizarConteoUsuarios();
    actualizarReservasHoy();
    actualizarIngresosMes();
    cargarTareasPendientes();
    
    console.log("Panel de Administración cargado. Listo para gestionar el hotel.");
});