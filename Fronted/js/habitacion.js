let todasLasHabitaciones = [];

async function obtenerHabitacion() {
    try {
        const respuesta = await fetch("../Backend/routes/api.php?url=habitacion");
        const data = await respuesta.json();

        console.log("Respuesta cruda del backend:", data);

        if (!Array.isArray(data)) {
            throw new Error("El backend no devolvió un array de habitaciones");
        }

        const habitacionesBD = data;

        const serviciosPorHabitacion = {
            "Suite": ["Wifi", "TV", "Doble Balcón", "Minibar", "Microondas", "Mesas y Sillas"],
            "River Suite": ["Wifi", "TV", "Balcón Privado", "Minibar", "Microondas", "Mesas y Sillas"],
            "Loft": ["Wifi", "TV", "Balcón", "Minibar", "Microondas", "Jarra Eléctrica"],
            "River Loft": ["Wifi", "TV", "Balcón", "Minibar", "Microondas", "Mesas y Sillas"],
            "Super Loft": ["Wifi", "TV", "Microondas", "Balcón doble"]
        };

        todasLasHabitaciones = habitacionesBD.map(hab => {
            const tipoHabitacionCorrecto = hab.tipo_hab === 'Suit Loft' ? 'Super Loft' : hab.tipo_hab; 

            // <-- definir aquí las imágenes por tipo o por id (ajusta rutas según tu estructura)
            const imagenesPorTipo = {
                "Suite": [
                    "http://localhost/ProyectoFinal/Fronted/img/Suite.jpeg",
                    "http://localhost/ProyectoFinal/Fronted/img/Suite 2.jpeg", 
                    "http://localhost/ProyectoFinal/Fronted/img/Suite 3.jpeg"
                ],
                "River Suite": [
                    "http://localhost/ProyectoFinal/Fronted/img/River Suite.jpeg",
                    "http://localhost/ProyectoFinal/Fronted/img/River Suite 2.jpeg",
                ],
                "Loft": [
                    "http://localhost/ProyectoFinal/Fronted/img/Loft.jpeg",
                    "http://localhost/ProyectoFinal/Fronted/img/Loft 2.jpeg",
                    "http://localhost/ProyectoFinal/Fronted/img/Loft 3.jpeg",
                ],
                "River Loft": [
                    "http://localhost/ProyectoFinal/Fronted/img/River Loft.jpeg",
                    "http://localhost/ProyectoFinal/Fronted/img/River Loft 2.jpeg",
                    "http://localhost/ProyectoFinal/Fronted/img/River Loft 3.jpeg",
                    "http://localhost/ProyectoFinal/Fronted/img/River Loft 4.jpeg"
                ],
                "Super Loft": [
                    "http://localhost/ProyectoFinal/Fronted/img/Super Loft.jpeg",
                    "http://localhost/ProyectoFinal/Fronted/img/Super Loft 2.jpeg",
                    
                ]
            };

            // Si la API ya trae imagenes, las usamos; si no, asignamos las de ejemplo por tipo
            const imagenesAsignadas = Array.isArray(hab.imagen) && hab.imagen.length
                ? hab.imagen
                : (imagenesPorTipo[tipoHabitacionCorrecto] || ["https://via.placeholder.com/800x500?text=Sin+imagen"]);

            return {
                ...hab,
                servicios_hab: serviciosPorHabitacion[tipoHabitacionCorrecto] || [],
                imagen: imagenesAsignadas
            };
        });

        console.log("Habitaciones obtenidas y procesadas:", todasLasHabitaciones);
        renderizarHabitaciones(todasLasHabitaciones);

    } catch (error) {
        console.error("Error al obtener habitaciones: " + error);
        document.getElementById("contenedor-habitacion").innerHTML = `
            <div class="alert alert-danger text-center" role="alert">
                Ocurrió un error al cargar las habitaciones. Por favor, inténtelo de nuevo más tarde.
            </div>
        `;
    }
}

function renderizarHabitaciones(habitaciones) {
    const contenedor = document.getElementById("contenedor-habitacion");
    if (!habitaciones || habitaciones.length === 0) {
        contenedor.innerHTML = `
            <div class="alert alert-warning text-center" role="alert">
                No se encontraron habitaciones que coincidan con los filtros.
            </div>
        `;
    } else {
        contenedor.innerHTML = crearCards(habitaciones);
    }
    agregarEventListeners();
}

function aplicarFiltros() {
    const tipoHabitacion = Array.from(document.querySelectorAll('#filterDropdown input[type="checkbox"]:checked')).map(el => el.value);
    const precioMin = document.getElementById('precio-min')?.value || '';
    const precioMax = document.getElementById('precio-max')?.value || '';
    const checkInDate = document.getElementById('check-in-date')?.value || '';
    const checkOutDate = document.getElementById('check-out-date')?.value || '';

    const habitacionesFiltradas = todasLasHabitaciones.filter(hab => {
        const coincideTipo = tipoHabitacion.length === 0 || tipoHabitacion.includes(hab.tipo_hab);

        const precio = parseFloat(hab.precio.toString().replace('.', ''));
        const coincidePrecio = (!precioMin || precio >= parseFloat(precioMin)) && (!precioMax || precio <= parseFloat(precioMax));

        const coincideFechas = true;

        return coincideTipo && coincidePrecio && coincideFechas;
    });

    renderizarHabitaciones(habitacionesFiltradas);
}

function crearCards(habitaciones) {
    const placeholder = 'https://via.placeholder.com/800x500?text=Sin+imagen';
    const crearCarousel = (hab) => {
        // Normalizar a array de imágenes
        let images = [];
        if (Array.isArray(hab.imagen)) {
            images = hab.imagen;
        } else if (typeof hab.imagen === 'string') {
            try {
                const parsed = JSON.parse(hab.imagen);
                if (Array.isArray(parsed)) images = parsed;
                else images = hab.imagen.split(',').map(s => s.trim()).filter(Boolean);
            } catch (e) {
                images = hab.imagen.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        // Saneamiento: si las rutas son relativas y faltan ../, ajusta aquí según tu estructura
        images = images.map(img => img && !img.startsWith('http') ? img.replace(/^\/+/, '') : img).filter(Boolean);

        if (images.length === 0) images = [placeholder];

        // DEBUG: ver qué imágenes se usan para cada habitación
        console.log(`Imágenes para hab ${hab.id_hab}:`, images);

        const id = `carousel-${hab.id_hab}`;

        return `
            <div id="${id}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="4000" data-bs-touch="true">
                <div class="carousel-indicators">
                    ${images.map((_, i) => `
                        <button type="button" data-bs-target="#${id}" data-bs-slide-to="${i}" class="${i === 0 ? 'active' : ''}" aria-current="${i === 0 ? 'true' : 'false'}" aria-label="Slide ${i+1}"></button>
                    `).join('')}
                </div>
                <div class="carousel-inner">
                    ${images.map((img, idx) => `
                        <div class="carousel-item ${idx === 0 ? 'active' : ''}">
                            <img src="${img}" class="d-block w-100 rounded" alt="${hab.tipo_hab} - imagen ${idx + 1}">
                        </div>
                    `).join('')}
                </div>
                ${images.length > 1 ? `
                    <button class="carousel-control-prev" type="button" data-bs-target="#${id}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Anterior</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#${id}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Siguiente</span>
                    </button>
                ` : ''}
            </div>
        `;
    };

    return `
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 px-4">
                    ${habitaciones.map(hab => {
                        const itemsDescripcion = (hab.descripcion_hab || '')
                            .split('\r\n')
                            .map(item => item.trim().replace(/^-/, '').trim())
                            .filter(item => item.length > 0);

                        return `
                            <div class="card mb-4 border-0 shadow">
                                <div class="row g-0 p-3 align-items-center">
                                    <div class="col-md-5 mb-lg-0 mb-md-0 mb-3">
                                        ${crearCarousel(hab)}
                                    </div>
                                    <div class="col-md-5 px-lg-3 px-md-3 px-0">
                                        <h5 class="mb-3">${hab.tipo_hab}</h5>
                                        <div class="features mb-3">
                                            <h6 class="mb-1">Descripción</h6>
                                            <ul class="list-unstyled">
                                                ${itemsDescripcion.map(item => `
                                                    <li>
                                                        <span class="badge rounded-pill bg-light text-dark text-wrap">
                                                            ${item}
                                                        </span>
                                                    </li>
                                                `).join('')}
                                            </ul>
                                        </div>
                                        <div class="features mb-3">
                                            <h6 class="mb-1">Servicios</h6>
                                            <div class="d-flex flex-wrap">
                                                ${hab.servicios_hab.map(servicio => `
                                                    <span class="badge rounded-pill bg-light text-dark text-wrap me-1 mb-1">
                                                        ${servicio}
                                                    </span>
                                                `).join('')}
                                            </div>
                                        </div>
                                        <div class="mt-2">
                                            <span class="badge ${hab.disponible ? 'bg-success' : 'bg-danger'}">
                                                ${hab.disponible ? 'Disponible' : 'No disponible'}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-md-2 mt-lg-0 mt-md-0 mt-4 text-center">
                                        <h6 class="mb-4">$${hab.precio} por noche</h6>
                                        <button class="btn btn-sm w-100 btn-outline-primary btn-reservar" data-id="${hab.id_hab}">Reservar ahora</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
}

function agregarEventListeners() {
    const botonesReservar = document.querySelectorAll('.btn-reservar');
    botonesReservar.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const idHabitacion = event.target.dataset.id;
            
            localStorage.setItem('selected_room_id', idHabitacion); 
            
            console.log(`Botón de reserva para la habitación con ID: ${idHabitacion} clickeado. Redirigiendo a reserva.html...`);
            
            window.location.href = 'reserva.html';
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    obtenerHabitacion();

    document.querySelectorAll('#filterDropdown input').forEach(input => {
        if (input.type === 'checkbox') {
            input.addEventListener('change', aplicarFiltros);
        } else {
            input.addEventListener('input', aplicarFiltros);
        }
    });
});