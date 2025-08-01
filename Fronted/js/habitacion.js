async function obtenerHabitacion() {
    try{
        const respuesta=await fetch("../Backend/routes/api.php?url=habitacion");
        const habitacion=await respuesta.json();
        console.log(habitacion);
        const contenedor=document.getElementById ("contenedor-habitacion");
        contenedor.innerHTML=crearCards(habitacion);

    }catch (error){
        console.error("Error al obtener habitacion" + error);
    }
    }

function crearCards(habitaciones) {
    return habitaciones.map((hab, i) => `
        <div class="card">
            <img src="../Fronted/img/${hab.imagen}" alt="${hab.tipo_hab}" class="card-img">
            <div class="card-body">
                <h3>${hab.tipo_hab}</h3>
                <p>${hab.descripcion_hab}</p>
                <p><strong>Disponible:</strong> ${hab.disponible ? 'Sí' : 'No'}</p>
                <p><strong>Precio:</strong> $${hab.precio}</p>
                <button class="btn-ver-mas" data-id="${i}">Ver más</button>
            </div>
        </div>
    `).join("");
}

const contenidoHabitaciones = {
    0: {
        titulo: 'Suite',
        descripcion: 'Máximo 3 personas en total <em>(3 adultos como máximo)</em>. <br> <br><strong>Incluye:</strong> <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>Un sofá cama <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-120q-17 0-28.5-11.5T160-160v-40q-50 0-85-35t-35-85v-200q0-50 35-85t85-35v-80q0-50 35-85t85-35h400q50 0 85 35t35 85v80q50 0 85 35t35 85v200q0 50-35 85t-85 35v40q0 17-11.5 28.5T760-120q-17 0-28.5-11.5T720-160v-40H240v40q0 17-11.5 28.5T200-120Zm-40-160h640q17 0 28.5-11.5T840-320v-200q0-17-11.5-28.5T800-560q-17 0-28.5 11.5T760-520v160H200v-160q0-17-11.5-28.5T160-560q-17 0-28.5 11.5T120-520v200q0 17 11.5 28.5T160-280Zm120-160h400v-80q0-27 11-49t29-39v-112q0-17-11.5-28.5T680-760H280q-17 0-28.5 11.5T240-720v112q18 17 29 39t11 49v80Zm200 0Zm0 160Zm0-80Z"/></svg> <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>Una cama doble grande <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h-40l-26-80H80v-201q0-33 23.5-56t56.5-23v-120q0-33 23.5-56.5T240-760h480q33 0 56.5 23.5T800-680v120q33 0 56.5 23.5T880-480v200h-54l-26 80h-40l-26-80H226l-26 80Zm320-360h200v-120H520v120Zm-280 0h200v-120H240v120Zm-80 200h640v-120H160v120Zm640 0H160h640Z"/></svg> <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>Cuna gratis disponible bajo petición <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M240-400h480v-120H400v-200h-80q-33 0-56.5 23.5T240-640v240Zm240 240q20 0 40-2.5t40-7.5v-150H400v150q20 5 40 7.5t40 2.5Zm0 80q-80 0-153-30.5T197-197l57-57q15 15 31.5 27.5T320-203v-117h-80q-33 0-56.5-23.5T160-400v-240q0-66 47-113t113-47h160v200h240q33 0 56.5 23.5T800-520v120q0 33-23.5 56.5T720-320h-80v117q18-11 34.5-23.5T706-254l57 57q-57 56-130 86.5T480-80Zm-80-440Z"/></svg>',
        servicios:'<strong>Servicios:</strong> <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> Balcón <br> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> Aire acondicionado <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> Caja fuerte <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> Ropa de cama <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> Escritorio',
        servicios2:'<br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> Baño privado <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> Teléfono <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> Microondas <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> Calefacción <br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg> TV de pantalla plana',
        servicios3:'<br><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>Minibar',
        imagenes: ['Suite.jpeg','Suite 4.jpg', 'Suite 2.jpeg', 'Suite 3.jpeg']
    },
    1: {
        titulo: 'Habitación Doble',
        descripcion: 'Ideal para parejas. Cama king size, TV y aire acondicionado.',
        imagenes: ['doble1.jpg', 'doble2.jpg']
    },
    // Agregá más entradas según los índices de las habitaciones
};

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-ver-mas')) {
        const id = e.target.getAttribute('data-id');
        const contenido = contenidoHabitaciones[id];

        if (!contenido) return;

        const modal = document.createElement('div');
        modal.classList.add('modal-overlay');
        modal.innerHTML = `
    <div class="modal-box">
    <button class="cerrar-modal">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
        </button>
        <h2>${contenido.titulo}</h2>
        <div class="modal-flex">
            <div class="modal-carousel">
                <button class="carousel-prev">&lt;</button>
                <img id="carousel-img" src="../Fronted/img/${contenido.imagenes[0]}" alt="${contenido.titulo}">
                <button class="carousel-next">&gt;</button>
            </div>
            <div class="modal-descripcion">
                <p>${contenido.descripcion}</p>
            </div>
            <div class="modal-servicios">
                <p>${contenido.servicios}</p>
            </div>
            <div class="modal-descripcion">
                <p>${contenido.servicios2}</p>
            </div>
        </div>
        <button class="reservar-modal">Reservar</button>
    </div>
`;

        // Cerar modal
        modal.querySelector('.cerrar-modal').addEventListener('click', () => {
        modal.remove();
         });

        // Carrusel JS
        let indexImg = 0;
        const imgElement = modal.querySelector('#carousel-img');
        const btnPrev = modal.querySelector('.carousel-prev');
        const btnNext = modal.querySelector('.carousel-next');

        btnPrev.addEventListener('click', () => {
            indexImg = (indexImg - 1 + contenido.imagenes.length) % contenido.imagenes.length;
            imgElement.src = `../Fronted/img/${contenido.imagenes[indexImg]}`;
        });

        btnNext.addEventListener('click', () => {
            indexImg = (indexImg + 1) % contenido.imagenes.length;
            imgElement.src = `../Fronted/img/${contenido.imagenes[indexImg]}`;
        });

        document.body.appendChild(modal);

        modal.querySelector('.reservar-modal').addEventListener('click', () => {
        window.location.href = 'reserva.html';
        });

    }

});

// Esto se mantiene si usás obtenerHabitacion()
document.addEventListener("DOMContentLoaded", obtenerHabitacion);
