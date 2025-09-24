let todasLasPromociones = [];

async function obtenerPromocion() {
  try {
    const respuesta = await fetch("../Backend/routes/api.php?url=promocion");
    const promocionesBD = await respuesta.json();

    const serviciosPorPromocion = {
      "DaySpa": ["Spa", "Masaje","Jacuzzi","Piscina", "Aromaterapia"],
      "DayUse": ["Habitación por un Dia", "TV", "Balcón Privado", "Minibar", "WIFI", "Mesas y Sillas"],
      "Cupón":["5% Descuento"],
      "FamilyPlan": ["Alojamiento", "Piscina", "Desayuno", "Juegos"],
      "Media pensión": ["Alojamiento", "Desayuno", "Cena"],
      "temporada": ["Piscina", "Vistas Increibles"]
    };

    todasLasPromociones = promocionesBD.map(promo => {
      const tipoPromocionCorrecto = promo.tipo_promo === 'DaySpa' ? 'temporada' : promo.tipo_promo;
      return {
        ...promo,
        servicios_promo: serviciosPorPromocion[tipoPromocionCorrecto] || []
      };
    });

    console.log("Promociones obtenidas y procesadas:", todasLasPromociones);

    renderizarPromociones(todasLasPromociones);

  } catch (error) {
    console.error("Error al obtener promociones: " + error);
    document.getElementById("contenedor-promociones").innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        Ocurrió un error al cargar las promociones. Por favor, inténtelo de nuevo más tarde.
      </div>
    `;
  }
}

function renderizarPromociones(promociones) {
  const contenedor = document.getElementById("contenedor-promociones");
  if (promociones.length === 0) {
    contenedor.innerHTML = `
      <div class="alert alert-warning text-center" role="alert">
        No se encontraron promociones que coincidan con los filtros.
      </div>
    `;
  } else {
    contenedor.innerHTML = crearCards(promociones);
  }
  agregarEventListeners();
}

function aplicarFiltros() {
  const tipoPromocion = Array.from(document.querySelectorAll('#filterDropdown input[type="checkbox"]:checked')).map(el => el.value);
  const precioMin = document.getElementById('precio-min')?.value || '';
  const precioMax = document.getElementById('precio-max')?.value || '';

  const promocionesFiltradas = todasLasPromociones.filter(promo => {
    const coincideTipo = tipoPromocion.length === 0 || tipoPromocion.includes(promo.tipo_promo);
    
    const precio = parseFloat(promo.precio_promo.replace('.', ''));
    const coincidePrecio = (!precioMin || precio >= parseFloat(precioMin)) && (!precioMax || precio <= parseFloat(precioMax));
    const coincideFechas = true; 

    return coincideTipo && coincidePrecio && coincideFechas;
  });

  renderizarPromociones(promocionesFiltradas);
}

function crearCards(promociones) {
  return `
    <div class="container">
      <div class="row">
        <div class="col-lg-12 col-md-12 px-4">
          ${promociones.map(promo => {
          const itemsDescripcion = (promo.descripcion_promo || '')
            .split('\r\n')
            .map(item => item.trim().replace(/^-/, '').trim())
            .filter(item => item.length > 0);

            return `
              <div class="card mb-4 border-0 shadow">
                <div class="row g-0 p-3 align-items-center">
                  <div class="col-md-5 mb-lg-0 mb-md-0 mb-3">
                    <img src="../Fronted/img/${promo.img_promo}" class="img-fluid rounded" alt="${promo.tipo_promo}">
                  </div>
                  <div class="col-md-5 px-lg-3 px-md-3 px-0">
                    <h5 class="mb-3">${promo.tipo_promo}</h5>
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
                        ${promo.servicios_promo.map(servicio => `
                          <span class="badge rounded-pill bg-light text-dark text-wrap me-1 mb-1">
                            ${servicio}
                          </span>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2 mt-lg-0 mt-md-0 mt-4 text-center">
                    <h6 class="mb-4">$${promo.precio_promo} por noche</h6>
                    <button class="btn btn-sm w-100 btn-outline-primary btn-reservar" data-id="${promo.id_promo}">Reservar ahora</button>
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
      const idPromocion = event.target.dataset.id;
      console.log(`Botón de reserva para la promoción con ID: ${idPromocion} clickeado.`);
      window.location.href = 'reserva.html';
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  obtenerPromocion();
  
  document.querySelectorAll('#filterDropdown input').forEach(input => {
    if (input.type === 'checkbox') {
      input.addEventListener('change', aplicarFiltros);
    } else {
      input.addEventListener('input', aplicarFiltros);
    }
  });
});