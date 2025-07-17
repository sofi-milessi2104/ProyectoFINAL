async function obtenerAdministrador() {
    try {
        const respuesta = await fetch("../Backend/routes/api.php?url=administrador");
        const administrador = await respuesta.json();
        console.log(administrador);
        const contenedor=document.getElementById("contenedor-administrador");
        contenedor.innerHTML=crearForm(administrador);
    } catch (error) {
        console.error("Error al obtener los administradores: " + error);
    }
}

function crearForm(administradores) {
        return administradores.map(administrador => `
            <div class="form-container sign-in">
                <form id="Form">
                    <h1>Iniciar Sesión</h1>
                    <div class="social-icons">
                        <a href="#" class="icon"><i class='bx bxl-google'></i></a>
                        <a href="#" class="icon"><i class='bx bxl-facebook'></i></a>
                        <a href="#" class="icon"><i class='bx bxl-github'></i></a>
                        <a href="#" class="icon"><i class='bx bxl-youtube'></i></a>
                    </div>
                    <span>Usa tu cuenta de Usuario</span>
                    <label for="nombre_completo">Nombre Completo:</label>
                    <input type="text" id="nombre_completo" name="nombre_completo" required>
                    <br>
                    <label for="cedula">Cédula de identidad:</label>
                    <input type="number" id="cedula" name="cedula" required>
                    <br>
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                    <br>
                    <label for="area">Área:</label>
                    <select id="area" name="area" required>
                        <option value="">Seleccione un área</option>
                        <option value="Recursos Humanos">Recursos Humanos</option>
                        <option value="Administración">Administración</option>
                        <option value="Finanzas">Gerencia</option>
                        <option value="Otro">Otro</option>
                    </select>
                    <a href="#">¿No puede iniciar sesión?</a>
                    <input type="submit" id="Iniciar_button" value="iniciar">
                </form>
            </div>
        `).join('');
    }

    // Llama a la función para mostrar el formulario
document.addEventListener("DOMContentLoaded", obtenerAdministrador);
