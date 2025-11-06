const API_URL_USUARIOS = "../../Backend/routes/api.php?url=usuario"; 

let listaUsuarios = [];

function formatearFecha(fechaISO) {
    if (!fechaISO) return 'N/A';
    try {
        const datePart = fechaISO.split(' ')[0];
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    } catch (e) {
        return fechaISO;
    }
}

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
        
        listaUsuarios = data;
        renderizarTabla(listaUsuarios);
        
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        document.getElementById("cuerpo-tabla-usuarios").innerHTML = `
            <tr><td colspan="7" class="text-danger text-center">Error al conectar con la API: ${error.message}.</td></tr>
        `;
    }
}

function renderizarTabla(usuarios) {
    const tbody = document.getElementById("cuerpo-tabla-usuarios");
    tbody.innerHTML = ''; 

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron usuarios.</td></tr>';
        return;
    }

    usuarios.forEach((usuario, index) => {
        
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

async function cambiarEstadoUsuario(id, estadoActual) {
    const nuevoEstado = estadoActual == 1 ? 0 : 1;
    const accion = nuevoEstado == 0 ? 'banear' : 'habilitar';
    const confirmMsg = `¿Está seguro de querer ${accion.toUpperCase()} al usuario #${id}?`;

    if (!confirm(confirmMsg)) {
        return;
    }

    const endpoint = `${API_URL_USUARIOS}&id=${id}&action=${accion}`; 

    try {
        const respuesta = await fetch(endpoint, {
            method: 'POST', 
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.success) {
            alert(resultado.message);
            obtenerUsuarios();
        } else {
            alert('Error al cambiar el estado: ' + (resultado.message || 'Error desconocido.'));
        }

    } catch (error) {
        console.error("Error de conexión al cambiar estado:", error);
        alert('Ocurrió un error de conexión al servidor.');
    }
}

function agregarListenersAcciones() {
    document.querySelectorAll('.toggle-estado-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            cambiarEstadoUsuario(this.dataset.id, this.dataset.estado);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    obtenerUsuarios();
    
    document.getElementById('filtro-busqueda').addEventListener('keyup', (e) => {
        filtrarUsuarios(e.target.value);
    });
    
    document.getElementById('btn-refrescar').addEventListener('click', obtenerUsuarios);
});