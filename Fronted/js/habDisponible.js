let todasLasHabitaciones = [];
let parametrosBusqueda = {};


function renderizarHabitaciones(habitaciones) {
    const contenedor = document.getElementById("contenedor-habDisponible");
    if (!contenedor) {
        console.error("No se encontró el contenedor 'contenedor-habDisponible'");
        return;
    }

    if (!habitaciones || habitaciones.length === 0) {
        contenedor.innerHTML = `
            <div class="alert alert-warning text-center" role="alert">
                No se encontraron habitaciones disponibles para las fechas seleccionadas.
            </div>
        `;
    } else {
        contenedor.innerHTML = crearCards(habitaciones);
        agregarEventListeners();
    }
}

function crearCards(habitaciones) {
    return `
        <div class="container">
            <div class="row">
                ${habitaciones.map(hab => `
                    <div class="col-lg-4 col-md-6 mb-5 px-4">
                        <div class="card border-0 shadow h-100" style="max-width:350px; margin:auto;">
                            <img src="${hab.imagen || 'https://via.placeholder.com/350x250'}" class="card-img-top" alt="${hab.tipo_hab}">
                            <div class="card-body">
                                <h5>${hab.tipo_hab}</h5>
                                <p class="card-text">${hab.descripcion || 'Habitación disponible'}</p>
                                <p class="price">$${parseFloat(hab.precio).toLocaleString('es-ES')} / Noche</p>
                                <button class="btn-reservar" data-id-habitacion="${hab.id_hab}" data-tipo="${hab.tipo_hab}" data-precio="${hab.precio}">
                                    Reservar
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function agregarEventListeners() {
    const botonesReservar = document.querySelectorAll('.btn-reservar');
    botonesReservar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const idHabitacion = this.dataset.idHabitacion;
            
            // Guardar en localStorage
            localStorage.setItem('habitacionesDisponibles', JSON.stringify(data.data));
            
            // Redirigir a reserva
            window.location.href = 'reserva.html';
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    obtenerDisponibles();
});


document.addEventListener('DOMContentLoaded', function () {
    const contenedor = document.querySelector('#contenedor-habDisponibles');
    const habitaciones= JSON.parse(localStorage.getItem('habitacionesDisponibles'));

if (!habitaciones || !Array.isArray(habitaciones)) {
    contenedor.innerHTML = 'No hay habitaciones disponibles.';
    setTimeout(() => {
        window.location.href = '../Frontend/index.html';
    }, 5000);
    return;
}

    habitaciones.forEach(hab => {
        const div = document.createElement('div');
        div.innerHTML = `
            <h3>${hab.tipo_hab}</h3>
            <p>${hab.descripcion_hab}</p>
            <img src="${hab.imagen}" alt="${hab.tipo_hab}" />
            <p>Precio: $${hab.precio}</p>
        `;
        contenedor.appendChild(div);
    });


document.querySelector('.btn-buscardisponibilidad').addEventListener('click', function () {
    const fechaInicio = document.querySelector('#fecha_inicio').value;
    const fechaFin = document.querySelector('#fecha_fin').value;

    console.log('Enviando fechas:', fechaInicio, fechaFin);

    fetch('../Backend/controllers/habDisponible.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin
        })
    })

    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('habitacionesDisponibles', JSON.stringify(data.data));
            window.location.href = '../Frontend/habDisponible.html';
        } else {
            alert('Error: ' + data.message);
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const habitaciones = JSON.parse(localStorage.getItem('habitacionesDisponibles'));
    const contenedor = document.querySelector('#contenedor-habDisponibles');

    if (!contenedor) {
        console.error('No se encontró el contenedor de habitaciones');
        return;
    }

    if (!habitaciones || !Array.isArray(habitaciones) || habitaciones.length === 0) {
        contenedor.innerHTML = `
            <div class="mensaje-sin-disponibilidad">
                <h2>No hay habitaciones disponibles</h2>
                <p>Serás redirigido automáticamente en 5 segundos...</p>
            </div>
        `;
        setTimeout(() => {
            window.location.href = '../Frontend/index.html';
        }, 5000);
        return;
    }

    habitaciones.forEach(hab => {
        const div = document.createElement('div');
        div.classList.add('card-habitacion');
        div.innerHTML = `
            <h3>${hab.tipo_hab}</h3>
            <p>${hab.descripcion_hab}</p>
            <img src="${hab.imagen}" alt="${hab.tipo_hab}" />
            <p>Precio: $${hab.precio}</p>
        `;
        contenedor.appendChild(div);
    });
});
});

