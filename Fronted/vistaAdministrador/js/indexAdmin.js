const API_BASE_URL = "../../Backend/routes/api.php"; 

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

        if (data.success && data.total !== undefined) {
            elementoConteo.textContent = data.total; 
            console.log("Conteo de usuarios actualizado con éxito:", data.total);
        } else if (Array.isArray(data)) {
            elementoConteo.textContent = data.length;
            console.warn(`La API de conteo devolvió un array (longitud: ${data.length}) en lugar de un objeto. Se usó la longitud.`);
        } else {
            elementoConteo.textContent = 'Error API';
            console.error("Error en datos recibidos, se esperaba {total: N}, se recibió:", data);
        }

    } catch (error) {
        console.error("Fallo la llamada al conteo de usuarios:", error);
        elementoConteo.textContent = 'Falla JS';
    }
}

async function actualizarReservasHoy() {
    const elementoReservas = document.getElementById('reservas-hoy');
    if (!elementoReservas) return;
    elementoReservas.textContent = '...';
    elementoReservas.textContent = '12';
}

async function actualizarIngresosMes() {
    const elementoIngresos = document.getElementById('ingresos-mes');
    if (!elementoIngresos) return;
    elementoIngresos.textContent = '...';
    elementoIngresos.textContent = '$15,480';
}

async function cargarTareasPendientes() {
    const tbody = document.getElementById('cuerpo-tabla-pendientes');
    if (!tbody) return;
    
    const totalPendientes = 2;
    document.getElementById('contador-pendientes').textContent = `(${totalPendientes})`;
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarConteoUsuarios();
    actualizarReservasHoy();
    actualizarIngresosMes();
    cargarTareasPendientes();
    
    console.log("Panel de Administración cargado. Listo para gestionar el hotel.");
});