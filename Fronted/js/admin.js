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
    let form = document.querySelector("#Form");
    if (!form) return;
    form.onsubmit = (e) => {
        e.preventDefault();
        let email = form.email.value;
        let password = form.password.value;
        iniciarSesionAdministrador(nombreemailcompleto, password);
    }
}

async function iniciarSesionAdministrador(email, password) {
    try {
        const url = "../Backend/routes/api.php?url=administrador";
        const data = new FormData();
        data.append("email", email);
        data.append("password", password);

        const respuesta = await fetch(url, {
            method: "POST",
            body: data
        });
        const resultado = await respuesta.json();

        if (resultado.status && resultado.rol === "administrador") {
            window.localStorage.setItem("sesionAdmin", JSON.stringify(resultado.data));
            window.location.href = "Fronted/index.html";
        } else {
            alert("No tienes permisos de administrador o los datos son incorrectos.");
        }
    } catch (error) {
        alert("Error al iniciar sesión.");
    }
}