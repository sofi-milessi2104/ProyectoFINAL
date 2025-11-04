// ⭐ ¡AJUSTA ESTA URL! Debe apuntar a tu controlador de usuarios
const API_URL_USUARIOS = "../../Backend/routes/api.php?url=usuario"; 

let listaUsuarios = []; // Almacena la lista completa de usuarios para filtrar

// --- Funciones de Utilidad ---
function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/A';
    // Asume formato YYYY-MM-DD HH:MM:SS
    try {
        const datePart = fechaISO.split(' ')[0];
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    } catch (e) {
        return fechaISO; // Devuelve la cadena original si falla el parseo
    }
}

// 1. FUNCIÓN PRINCIPAL: OBTENER DATOS
async function obtenerUsuarios() {
    try {
        const tbody = document.getElementById("cuerpo-tabla-usuarios");
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Cargando usuarios...</td></tr>';
        
        const respuesta = await fetch(API_URL_USUARIOS);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status} - ${respuesta.statusText}`);
        }
        
        const data = await respuesta.json();
        
        if (!Array.isArray(data)) {
            throw new Error("Respuesta inválida o endpoint no devuelve un array de usuarios.");
        }
        
        listaUsuarios = data; // Guardamos la lista completa
        renderizarTabla(listaUsuarios); // Renderizamos por primera vez
        
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        document.getElementById("cuerpo-tabla-usuarios").innerHTML = `
            <tr><td colspan="7" class="text-danger text-center">Error al conectar con la API: ${error.message}.</td></tr>
        `;
    }
}

// 2. FUNCIÓN PARA RENDERIZAR LA TABLA
function renderizarTabla(usuarios) {
    const tbody = document.getElementById("cuerpo-tabla-usuarios");
    tbody.innerHTML = ''; 

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron usuarios.</td></tr>';
        return;
    }

    usuarios.forEach((usuario, index) => {
        
        // Asumiendo que el campo para el estado es 'estado' y usa 1 (Activo) / 0 (Baneado/Inactivo)
        const estadoActivo = usuario.estado == 1;
        const estadoTexto = estadoActivo ? 'Activo' : 'Baneado';
        const badgeClass = estadoActivo ? 'bg-success' : 'bg-danger';
        const iconoAccion = estadoActivo ? 'bi-lock-fill' : 'bi-unlock-fill';
        const textoAccion = estadoActivo ? 'Banear' : 'Habilitar';
        const btnClass = estadoActivo ? 'btn-outline-warning' : 'btn-outline-success';

        const fila = `
            <tr>
                <th scope="row">${usuario.id_usuario}</th>
                <td class="text-start">${usuario.nombre} ${usuario.apellido}</td>
                <td class="text-start">${usuario.email}</td>
                <td>${usuario.telefono || 'N/A'}</td>
                <td>${formatearFecha(usuario.fecha_registro)}</td>
                <td><span class="badge ${badgeClass}">${estadoTexto}</span></td>
                <td>
                    <button type="button" class="btn btn-sm ${btnClass} toggle-estado-btn shadow-none" 
                        data-id="${usuario.id_usuario}" 
                        data-estado="${usuario.estado}" 
                        title="${textoAccion} Usuario">
                        <i class="bi ${iconoAccion}"></i> ${textoAccion}
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
    
    agregarListenersAcciones();
}

// 3. FUNCIÓN PARA FILTRAR LA TABLA (Busqueda)
function filtrarUsuarios(termino) {
    const terminoLowerCase = termino.toLowerCase().trim();
    if (!terminoLowerCase) {
        renderizarTabla(listaUsuarios);
        return;
    }
    
    const usuariosFiltrados = listaUsuarios.filter(usuario => {
        const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
        const email = usuario.email.toLowerCase();
        
        return nombreCompleto.includes(terminoLowerCase) || email.includes(terminoLowerCase);
    });
    
    renderizarTabla(usuariosFiltrados);
}

// 4. LÓGICA PARA CAMBIAR EL ESTADO (Banear/Habilitar)
async function cambiarEstadoUsuario(id, estadoActual) {
    const nuevoEstado = estadoActual == 1 ? 0 : 1; // 1 -> 0 (Banear), 0 -> 1 (Habilitar)
    const accion = nuevoEstado == 0 ? 'banear' : 'habilitar';
    const confirmMsg = `¿Está seguro de querer ${accion.toUpperCase()} al usuario #${id}?`;

    if (!confirm(confirmMsg)) {
        return;
    }

    // ⭐ API_URL_USUARIOS debe responder a una acción POST
    const endpoint = `${API_URL_USUARIOS}&id=${id}&action=${accion}`; 

    try {
        const respuesta = await fetch(endpoint, {
            method: 'POST', 
            // Podrías enviar datos adicionales si fuera necesario
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert(resultado.message);
            obtenerUsuarios(); // Recargar la lista
        } else {
            alert('Error al cambiar el estado: ' + (resultado.message || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error de conexión al cambiar estado:", error);
        alert('Ocurrió un error de conexión al servidor.');
    }
}

// 5. FUNCIÓN AUXILIAR: Añadir Listeners
function agregarListenersAcciones() {
    // Listener para los botones de cambio de estado
    document.querySelectorAll('.toggle-estado-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            cambiarEstadoUsuario(this.dataset.id, this.dataset.estado);
        });
    });
}


// 6. INICIALIZACIÓN: Carga la tabla y añade listeners de búsqueda/refresco
document.addEventListener("DOMContentLoaded", () => {
    obtenerUsuarios();
    
    // Listener para el campo de búsqueda
    document.getElementById('filtro-busqueda').addEventListener('keyup', (e) => {
        filtrarUsuarios(e.target.value);
    });
    
    // Listener para el botón de refresco
    document.getElementById('btn-refrescar').addEventListener('click', obtenerUsuarios);
});