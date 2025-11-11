let todasLasHabitaciones = [];
let parametrosBusqueda = {};

async function obtenerHabitacionesDisponibles() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const checkin = urlParams.get('checkin');
        const checkout = urlParams.get('checkout');
        const adultos = urlParams.get('adultos');
        const ninios = urlParams.get('ninios') || urlParams.get('ninos') || urlParams.get('niños');

        parametrosBusqueda = { checkin, checkout, adultos, ninios };

        let url = '../Backend/controllers/habDisponible.php?action=obtenerDisponibles';
        if (checkin && checkout) {
            url += `&fecha_inicio=${encodeURIComponent(checkin)}&fecha_fin=${encodeURIComponent(checkout)}`;
            if (adultos !== null && adultos !== undefined) url += `&adultos=${encodeURIComponent(adultos)}`;
            if (ninios !== null && ninios !== undefined) url += `&ninios=${encodeURIComponent(ninios)}`;
        }

        console.log("URL de solicitud:", url);
        const respuesta = await fetch(url);

        const texto = await respuesta.text(); // siempre leer el cuerpo
        console.log("Cuerpo respuesta servidor:", texto);

        if (!respuesta.ok) {
            // muestra el HTML/ERROR devuelto por PHP
            throw new Error(`HTTP ${respuesta.status}: ${texto.substring(0, 500)}`);
        }

        const data = JSON.parse(texto);
        if (!data.success || !Array.isArray(data.data)) {
            throw new Error(data.message || "No se pudieron obtener las habitaciones");
        }

        todasLasHabitaciones = data.data;
        renderizarHabitaciones(todasLasHabitaciones);

    } catch (error) {
        console.error("Error al obtener habitaciones:", error);
        const contenedor = document.getElementById("contenedor-habDisponible");
        if (contenedor) {
            contenedor.innerHTML = `<div class="alert alert-danger text-center" role="alert">Ocurrió un error al cargar las habitaciones. ${error.message}</div>`;
        }
    }
}

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
            localStorage.setItem('selected_room_id', idHabitacion);
            
            // Redirigir a reserva
            window.location.href = 'reserva.html';
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    obtenerHabitacionesDisponibles();
});


document.addEventListener('DOMContentLoaded', function () {
    const habitaciones= JSON.parse(localStorage.getItem('habitacionesDisponibles'));

if (!habitaciones || !Array.isArray(habitaciones)) {
    contenedor.innerHTML = '<p>No hay habitaciones disponibles o hubo un error al cargar los datos.</p>';
    return;
}

    const contenedor = document.querySelector('#contenedor-habitaciones');
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

    fetch('Backend/controllers/HabDisponibleController.php', {
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
            window.location.href = 'Frontend/pages/habDisponible.html';
        } else {
            alert('Error: ' + data.message);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const habitaciones = JSON.parse(localStorage.getItem('habitacionesDisponibles'));
    const contenedor = document.querySelector('#contenedor-habitaciones');

    // Verificar si hay habitaciones disponibles
    if (!habitaciones || !Array.isArray(habitaciones) || habitaciones.length === 0) {
        contenedor.innerHTML = `
            <div class="mensaje-sin-disponibilidad">
                <h2>No hay habitaciones disponibles</h2>
                <p>Lo sentimos, no encontramos habitaciones para las fechas seleccionadas.</p>
                <a href="../../index.html" class="btn-volver">Volver a intentar</a>
            </div>
        `;
        return;
    }

    // Mostrar habitaciones disponibles
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

document.addEventListener('DOMContentLoaded', function () {
    const habitaciones = JSON.parse(localStorage.getItem('habitacionesDisponibles'));
    const contenedor = document.querySelector('#contenedor-habitaciones');

    if (!habitaciones || !Array.isArray(habitaciones) || habitaciones.length === 0) {
        contenedor.innerHTML = `
            <div class="mensaje-sin-disponibilidad">
                <h2>No hay habitaciones disponibles</h2>
                <p>Lo sentimos, no encontramos habitaciones para las fechas seleccionadas.</p>
                <p>Serás redirigido automáticamente en 5 segundos...</p>
            </div>
        `;

        // Redirigir automáticamente después de 5 segundos
        setTimeout(() => {
            window.location.href = '../../index.html';
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