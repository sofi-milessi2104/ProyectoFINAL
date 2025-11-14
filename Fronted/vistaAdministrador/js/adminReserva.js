// Contenido de js/adminReserva.js

document.addEventListener('DOMContentLoaded', () => {
    // Cargar las reservas al iniciar la página
    cargarReservas();
});

// --- URL BASE DEL API (ADAPTAR SEGÚN LA RUTA DE TU SERVIDOR) ---
// Nota: el nombre de la carpeta es "ProyectoFINAL" en este proyecto
const API_URL = 'http://localhost/ProyectoFINAL/Backend/routes/reservasAdmin.php'; 

/**
 * Muestra alertas temporales en la interfaz
 * @param {string} mensaje
 * @param {string} tipo (success, danger, info)
 */
function mostrarAlerta(mensaje, tipo = 'success') {
    const contenedor = document.querySelector('.container-fluid');
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show fixed-top mt-5 mx-auto w-50`;
    alerta.role = 'alert';
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close shadow-none" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    contenedor.prepend(alerta);

    setTimeout(() => {
        const bsAlert = bootstrap.Alert.getOrCreateInstance(alerta);
        bsAlert.close();
    }, 5000);
}

/**
 * 1. Pide la lista de reservas al API y la renderiza en la tabla.
 */
async function cargarReservas() {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-reservas');
    // Mostrar indicador de carga
    cuerpoTabla.innerHTML = '<tr><td colspan="9" class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></td></tr>';

    try {
        const response = await fetch(API_URL);
        
        // Clonamos la respuesta para poder leerla como JSON o como texto en caso de error
        const responseClone = response.clone(); 
        let reservas = null;
        
        try {
            // Intenta leer el cuerpo como JSON
            reservas = await response.json(); 
        } catch (e) {
            // Si falla al leer JSON, es un error de conexión o servidor
            const rawText = await responseClone.text();

            // Loguear la respuesta cruda para facilitar debugging
            console.error('Respuesta cruda del servidor (no JSON):', rawText);

            // Si hay un error, lo lanzamos para que el catch final lo maneje.
            if (response.status !== 200 || rawText.trim() === '') {
                throw new Error(`Error de red o servidor: ${response.status}. La respuesta no fue JSON.`);
            }
            // Si no fue un error de status pero el JSON falló, usamos el error original y mostramos el texto crudo
            throw new Error(`Error parseando JSON: ${e.message}. Respuesta cruda: ${rawText}`);
        }

        // Si la respuesta no es 200 y pudimos leer el JSON (que contendría el error), lo lanzamos.
        if (response.status !== 200) {
            // Aquí 'reservas' contendría el objeto de error {"error": "..."} del PHP
            throw new Error(reservas.error || `Error ${response.status}: Error desconocido del servidor.`);
        }

        // Si llegamos aquí, 'reservas' es un array (vacío o con datos)
        // Limpiar y generar las filas
        cuerpoTabla.innerHTML = ''; 
        
        // Lógica corregida para manejo de array vacío
        if (reservas.length === 0) {
            cuerpoTabla.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No hay reservas.</td></tr>';
            return;
        }

        reservas.forEach(reserva => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${reserva.id}</td>
                <td>${reserva.usuario}</td>
                <td>${reserva.adultos}</td>
                <td>${reserva.ninos}</td>
                <td>${reserva.check_in}</td>
                <td>${reserva.check_out}</td>
                <td>${reserva.habitacion}</td>
                <td>${reserva.servicios_extra_resumen}</td>
            `;
            cuerpoTabla.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar las reservas:', error);
        
        // Mostrar mensaje de error más claro para el usuario
        const mensajeError = error.message.includes('No se pudo cargar la base de datos') 
            ? 'Error de servidor: Revise la conexión a la base de datos y la ruta del archivo config.' 
            : error.message;

        cuerpoTabla.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Error: ${mensajeError}</td></tr>`;
    }
}
// Las demás funciones (mostrarDetalles, actualizarEstado) no requieren cambios.