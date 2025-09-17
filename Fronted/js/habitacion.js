let todasLasHabitaciones = []; // almacenamos todas las habitaciones

async function obtenerHabitacion() {
  try {
    const respuesta = await fetch("../Backend/routes/api.php?url=habitacion");
    todasLasHabitaciones = await respuesta.json();

    renderizarHabitaciones(todasLasHabitaciones);

    // Activar filtros
    inicializarFiltros();

  } catch (error) {
    console.error("Error al obtener habitaciones: " + error);
  }
}

function renderizarHabitaciones(habitaciones) {
  const contenedor = document.getElementById("contenedor-habitacion");
  contenedor.innerHTML = crearCards(habitaciones);

  const botonesReservar = document.querySelectorAll(".btn-reservar");
  botonesReservar.forEach((boton) => {
    boton.addEventListener("click", () => {
      window.location.href = "reserva.html";
    });
  });
}

function crearCards(habitaciones) {
  if (habitaciones.length === 0) {
    return `<p class="text-center">No se encontraron habitaciones con los filtros seleccionados.</p>`;
  }

  return `
    <div class="container">
      <div class="row">
        <div class="col-lg-12 col-md-12 px-4">
          ${habitaciones
            .map(
              (hab) => `
            <div class="card mb-4 border-0 shadow" 
                 data-servicios="${hab.servicios ? hab.servicios.join(',').toLowerCase() : ''}" 
                 data-adultos="${hab.adultos || 2}" 
                 data-ninos="${hab.ninos || 0}" 
                 data-disponible="${hab.disponible}">
              <div class="row g-0 p-3 align-items-center">
                <div class="col-md-5 mb-lg-0 mb-md-0 mb-3">
                  <img src="../Fronted/img/${hab.imagen}" class="img-fluid rounded" alt="${hab.tipo_hab}">
                </div>
                <div class="col-md-5 px-lg-3 px-md-3 px-0">
                  <h5 class="mb-3">${hab.tipo_hab}</h5>
                  <div class="features mb-3">
                    <h6 class="mb-1">Descripción</h6>
                    <span class="badge rounded-pill bg-light text-dark text-wrap">
                      ${hab.descripcion_hab}
                    </span>
                  </div>
                  <div class="features mb-3">
                    <h6 class="mb-1">Servicios</h6>
                    ${(hab.servicios || ["Wifi", "TV"]).map(
                      (s) =>
                        `<span class="badge rounded-pill bg-light text-dark text-wrap">${s}</span>`
                    ).join(" ")}
                  </div>
                  <div class="guests">
                    <h6 class="mb-1">Personas</h6>
                    <span class="badge rounded-pill bg-light text-dark text-wrap">
                      ${hab.adultos || 2} Adultos
                    </span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap">
                      ${hab.ninos || 0} Niños
                    </span>
                  </div>
                  <div class="mt-2">
                    <span class="badge ${hab.disponible ? "bg-success" : "bg-danger"}">
                      ${hab.disponible ? "Disponible" : "No disponible"}
                    </span>
                  </div>
                </div>
                <div class="col-md-2 mt-lg-0 mt-md-0 mt-4 text-center">
                  <h6 class="mb-4">$${hab.precio} por noche</h6>
                  <button class="btn btn-sm w-100 btn-outline-primary btn-reservar" data-id="${hab.id_hab}">Reservar ahora</button>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function inicializarFiltros() {
  const checkboxes = document.querySelectorAll(".form-check-input");
  const adultosInput = document.querySelectorAll('input[type="number"]')[0];
  const ninosInput = document.querySelectorAll('input[type="number"]')[1];

  function aplicarFiltros() {
    let habitacionesFiltradas = [...todasLasHabitaciones];

    // Servicios seleccionados
    const serviciosSeleccionados = [...checkboxes]
      .filter((cb) => cb.checked)
      .map((cb) => cb.nextElementSibling.textContent.trim().toLowerCase());

    if (serviciosSeleccionados.length > 0) {
      habitacionesFiltradas = habitacionesFiltradas.filter((hab) => {
        const servicios = (hab.servicios || []).map((s) => s.toLowerCase());
        return serviciosSeleccionados.every((s) => servicios.includes(s));
      });
    }

    // Adultos
    const adultos = adultosInput.value ? parseInt(adultosInput.value) : null;
    if (adultos) {
      habitacionesFiltradas = habitacionesFiltradas.filter(
        (hab) => (hab.adultos || 2) >= adultos
      );
    }

    // Niños
    const ninos = ninosInput.value ? parseInt(ninosInput.value) : null;
    if (ninos) {
      habitacionesFiltradas = habitacionesFiltradas.filter(
        (hab) => (hab.ninos || 0) >= ninos
      );
    }

    renderizarHabitaciones(habitacionesFiltradas);
  }

  // Eventos
  checkboxes.forEach((cb) => cb.addEventListener("change", aplicarFiltros));
  adultosInput.addEventListener("input", aplicarFiltros);
  ninosInput.addEventListener("input", aplicarFiltros);
}

document.addEventListener("DOMContentLoaded", obtenerHabitacion);
