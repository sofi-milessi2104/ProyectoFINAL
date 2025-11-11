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
    let form = document.querySelector("#frmUsuario");
     let formAdd = document.querySelector("#frmAddUsuario");
    
    if (!form) return;
    form.onsubmit = (e) => {
        e.preventDefault();
        let email = form.email.value;
        let password = form.password.value;
        iniciarSesionUsuario(email, password);
    }

    if (!formAdd) return;
    formAdd.onsubmit = (e) => {
        e.preventDefault();
        let nombre = formAdd.nombre.value;
        let apellido = formAdd.apellido.value;
        let email = formAdd.email.value;
        let celular = formAdd.celular.value;
        let password = formAdd.password.value;
        loginAddUser(nombre, apellido, email, celular, password);
    }

}

async function iniciarSesionUsuario(email, password) {
    try {
        const url = "../Backend/routes/api.php?url=loginUsr";
        const data = new FormData();
        data.append("email", email);
        data.append("password", password);

        const respuesta = await fetch(url, {
            method: "POST",
            body: data
        });
        const resultado = await respuesta.json();
        console.log("loginUsr response:", resultado); 

        if (resultado.status == true) {
            window.localStorage.setItem("sesionUser", JSON.stringify(resultado.data));
            window.location.href = "../Fronted/index.html";
        } else {
            alert("No tienes permisos de usuario o los datos son incorrectos.");
        }
    } catch (error) {
        alert("Error al iniciar sesión " + error);
    }
}

async function loginAddUser(nombre, apellido, email, celular, password) {
    try {
        const url = "../Backend/routes/api.php?url=loginAddUsr";
        const data = new FormData();
        data.append("nombre", nombre);
        data.append("apellido", apellido);
        data.append("email", email);
        data.append("celular", celular);
        data.append("password", password);

        const respuesta = await fetch(url, {
            method: "POST",
            body: data
        });
        const resultado = await respuesta.json();
        console.log("loginAddUsr response:", resultado); 

        if (resultado.status == true) {
            window.localStorage.setItem("sesionUser", JSON.stringify(resultado.data));
            window.location.href = "../Fronted/index.html";

        } else {
            alert("No pudiste crear una cuenta correctamente");
        }
    } catch (error) {
        alert("Error al crear cuenta " + error);
    }
}

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
