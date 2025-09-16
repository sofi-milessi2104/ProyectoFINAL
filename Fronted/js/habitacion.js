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
    return `
    <div class="container">
      <div class="row">
        <div class="col-lg-12 col-md-12 px-4">
          ${habitaciones.map(hab => `
            <div class="card mb-4 border-0 shadow">
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
                    <span class="badge rounded-pill bg-light text-dark text-wrap">
                      Wifi
                    </span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap">
                      TV
                    </span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap">
                      Aire Acondicionado
                    </span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap">
                      Mini bar
                    </span>
                  </div>
                  <div class="guests">
                    <h6 class="mb-1">Personas</h6>
                    <span class="badge rounded-pill bg-light text-dark text-wrap">
                      2 Adultos
                    </span>
                    <span class="badge rounded-pill bg-light text-dark text-wrap">
                    0 Niños
                    </span>
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
          `).join('')}
        </div>
      </div>
    </div>
    `;
}

document.addEventListener("DOMContentLoaded", obtenerHabitacion);
