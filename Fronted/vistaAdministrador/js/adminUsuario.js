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
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Cargando usuarios...</td></tr>';
        
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
            <tr><td colspan="4" class="text-danger text-center">Error al conectar con la API: ${error.message}.</td></tr>
        `;
    }
}

function renderizarTabla(usuarios) {
    const tbody = document.getElementById("cuerpo-tabla-usuarios");
    tbody.innerHTML = ''; 

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No se encontraron usuarios.</td></tr>';
        return;
    }

    usuarios.forEach((usuario) => {
        const fila = `
            <tr>
                <th scope="row">${usuario.id_usuario}</th>
                <td>${usuario.nombre} ${usuario.apellido}</td>
                <td>${usuario.email}</td>
                <td>${usuario.celular || 'N/A'}</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
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

document.addEventListener("DOMContentLoaded", () => {
    obtenerUsuarios();
    
    document.getElementById('filtro-busqueda').addEventListener('keyup', (e) => {
        filtrarUsuarios(e.target.value);
    });
    
    document.getElementById('btn-refrescar').addEventListener('click', obtenerUsuarios);
});