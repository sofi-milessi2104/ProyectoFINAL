async function obtenerAdministradores() {
    try {
        const respuesta = await fetch("../Backend/routes/api.php?url=admin");
        const administradores = await respuesta.json();
        console.log(administradores);
        agregarEventoForm(); 
        console.log(administradores);
    } catch (error) {
        console.error("Error al obtener los administradores: " + error);
    }


}

function agregarEventoForm() {
    let form = document.querySelector("#Form");
    if (!form) return;
    form.onsubmit = (e) => {
        e.preventDefault();
        let nombre_completo = form.nombre_completo.value;
        let ci = form.ci.value;
        iniciarSesionAdministrador(nombre_completo, ci);
    }
}

async function iniciarSesionAdministrador(nombre_completo, ci) {
    try {
        const url = "../Backend/routes/api.php?url=admin";
        const data = new FormData();
        data.append("nombre_completo", nombre_completo);
        data.append("ci", ci);

        const respuesta = await fetch(url, {
            method: "POST",
            body: data
        });
        const resultado = await respuesta.json();

        if (resultado.status && resultado.rol === "admin") {
            window.localStorage.setItem("sesionAdmin", JSON.stringify(resultado.data));
            window.location.href = "Fronted/index.html";
        } else {
            alert("No tienes permisos de administrador o los datos son incorrectos.");
        }
    } catch (error) {
        alert("Error al iniciar sesión.");
    }
}