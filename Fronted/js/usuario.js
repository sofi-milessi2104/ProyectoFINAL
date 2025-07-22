async function obtenerUsuario() {
    try {
        const respuesta = await fetch("../Backend/routes/api.php?url=usuario");
        const usuario = await respuesta.json();
        console.log(usuario);
        agregarEventoForm(); 
        console.log(usuario);
    } catch (error) {
        console.error("Error al obtener los usuarios: " + error);
    }


}


function agregarEventoForm() {
    let form = document.querySelector("#Form");
    if (!form) return;
    form.onsubmit = (e) => {
        e.preventDefault();
        let email = form.email.value;
        let password = form.password.value;
        iniciarSesionUsuario(email, password);
    }
}

async function iniciarSesionUsuario(email, password) {
    try {
        const url = "../Backend/routes/api.php?url=usuario";
        const data = new FormData();
        data.append("email", email);
        data.append("password", password);

        const respuesta = await fetch(url, {
            method: "POST",
            body: data
        });
        const resultado = await respuesta.json();

        if (resultado.status && resultado.rol === "usuario") {
            window.localStorage.setItem("sesionUser", JSON.stringify(resultado.data));
            window.location.href = "Fronted/index.html";
        } else {
            alert("No tienes permisos de usuario o los datos son incorrectos.");
        }
    } catch (error) {
        alert("Error al iniciar sesión.");
    }
}

//Eventos del form
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    }

    agregarEventoForm();
});

