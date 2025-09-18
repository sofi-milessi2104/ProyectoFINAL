let todasLasHabitaciones = [];

async function obtenerHabitacion() {
  try {
    const respuesta = await fetch("../Backend/routes/api.php?url=habitacion");
    const habitacionesBD = await respuesta.json();

    const serviciosPorHabitacion = {
      "Suit": ["Wifi", "TV", "Doble Balcón", "Minibar", "Microondas", "Mesas y Sillas"],
      "River Suit": ["Wifi", "TV", "Balcón Privado", "Minibar", "Microondas", "Mesas y Sillas"],
      "Loft": ["Wifi", "TV", "Balcón", "Minibar", "Microondas", "Jarra Eléctrica"],
      "River Loft": ["Wifi", "TV", "Balcón", "Minibar", "Microondas", "Mesas y Sillas"],
      "Super Loft": ["Wifi", "TV", "Microondas", "Balcón doble"]
    };

    todasLasHabitaciones = habitacionesBD.map(hab => {
      // Nota: Tu BD tiene "Suit Loft", pero tus filtros y datos tienen "Super Loft".
      // Lo corregí en tus filtros, pero si tu BD devuelve "Suit Loft", el servicio será un array vacío.
      // Revisa si el campo en tu BD es "Suit Loft" o "Super Loft" y ajústalo.
      const tipoHabitacionCorrecto = hab.tipo_hab === 'Suit Loft' ? 'Super Loft' : hab.tipo_hab;
      return {
        ...hab,
        servicios_hab: serviciosPorHabitacion[tipoHabitacionCorrecto] || []
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
  if (habitaciones.length === 0) {
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
  // Se ha mejorado la selección de elementos para evitar errores de 'null'
  const tipoHabitacion = Array.from(document.querySelectorAll('#filterDropdown input[type="checkbox"]:checked')).map(el => el.value);
  const precioMin = document.getElementById('precio-min')?.value || '';
  const precioMax = document.getElementById('precio-max')?.value || '';
  const checkInDate = document.getElementById('check-in-date')?.value || '';
  const checkOutDate = document.getElementById('check-out-date')?.value || '';

  const habitacionesFiltradas = todasLasHabitaciones.filter(hab => {
    const coincideTipo = tipoHabitacion.length === 0 || tipoHabitacion.includes(hab.tipo_hab);
    
    const precio = parseFloat(hab.precio.replace('.', ''));
    const coincidePrecio = (!precioMin || precio >= parseFloat(precioMin)) && (!precioMax || precio <= parseFloat(precioMax));

    const coincideFechas = true; 

    return coincideTipo && coincidePrecio && coincideFechas;
  });

  renderizarHabitaciones(habitacionesFiltradas);
}

function crearCards(habitaciones) {
  return `
    <div class="container">
      <div class="row">
        <div class="col-lg-12 col-md-12 px-4">
          ${habitaciones.map(hab => {
            // Procesa la descripción para crear una lista, incluso si es un solo párrafo
            const itemsDescripcion = hab.descripcion_hab
              .split('\r\n')
              .map(item => item.trim().replace(/^-/, '').trim())
              .filter(item => item.length > 0);

            return `
              <div class="card mb-4 border-0 shadow">
                <div class="row g-0 p-3 align-items-center">
                  <div class="col-md-5 mb-lg-0 mb-md-0 mb-3">
                    <img src="../Fronted/img/${hab.imagen}" class="img-fluid rounded" alt="${hab.tipo_hab}">
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
      console.log(`Botón de reserva para la habitación con ID: ${idHabitacion} clickeado.`);
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