async function obtenerAdministrador() {
    try {
        const respuesta = await fetch("../Backend/routes/api.php?url=administrador");
        const administrador = await respuesta.json();
        console.log(administrador);
        agregarEventoForm(); 
        console.log(administrador);
    } catch (error) {
        console.error("Error al obtener los administradores: " + error);
    }


}

function agregarEventoForm() {
    let form = document.querySelector("#frmAdministrador");
    if (!form) return;
    form.onsubmit = (e) => {
        e.preventDefault();
        let email = form.email.value;
        let password = form.password.value;
        iniciarSesionAdministrador(email, password);
    }
}

async function iniciarSesionAdministrador(email, password) {
    try {
        const url = "../Backend/routes/api.php?url=login";
        const data = new FormData();
        data.append("email", email);
        data.append("password", password);

        const respuesta = await fetch(url, {
            method: "POST",
            body: data
        });
        const resultado = await respuesta.json();

        if (resultado.status == true) {
            window.localStorage.setItem("sesionAdmin", JSON.stringify(resultado.data));
            window.location.href = "../fronted/index.html";
        } else {
            alert("No tienes permisos de administrador o los datos son incorrectos.");
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
