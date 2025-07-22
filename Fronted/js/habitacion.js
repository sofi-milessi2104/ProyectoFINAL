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
        titulo: 'Habitación Deluxe',
        descripcion: 'Incluye jacuzzi, vista al mar, desayuno incluido.',
        imagenes: ['deluxe1.jpg', 'deluxe2.jpg', 'deluxe3.jpg']
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
                <h2>${contenido.titulo}</h2>
                <p>${contenido.descripcion}</p>
                <div class="modal-imgs">
                    ${contenido.imagenes.map(img => `
                        <img src="../Fronted/img/${img}" alt="${contenido.titulo}" style="max-width: 100%; margin-top: 10px;">
                    `).join("")}
                </div>
                <button class="cerrar-modal">Cerrar</button>
            </div>
        `;

        modal.querySelector('.cerrar-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        });

        document.body.appendChild(modal);
    }
});


document.addEventListener("DOMContentLoaded", obtenerHabitacion);
