document.addEventListener('DOMContentLoaded', () => {
  // Obtener elementos del DOM
  const contenedor = document.getElementById('contenedor-habDisponible');
  
  if (!contenedor) {
    console.error('No se encontró el contenedor de habitaciones');
    return;
  }
  
  const precioMin = document.getElementById('precio-min');
  const precioMax = document.getElementById('precio-max');

  // Obtener datos de localStorage
  const busqueda = JSON.parse(localStorage.getItem('busquedaDisponibilidad'));

  if (!busqueda || !busqueda.habitaciones) {
    contenedor.innerHTML = `
      <div class="mensaje-sin-disponibilidad">
        <h3>No hay búsqueda activa</h3>
        <p>Por favor, realiza una búsqueda desde la página principal.</p>
        <a href="index.html" class="btn-volver">Volver al inicio</a>
      </div>
    `;
    return;
  }

  let habitacionesFiltradas = busqueda.habitaciones;

  function mostrarHabitaciones(habitaciones) {
    contenedor.innerHTML = '';

    if (habitaciones.length === 0) {
      contenedor.innerHTML = `
        <div class="col-12">
          <div class="mensaje-sin-disponibilidad text-center p-5">
            <h3>No hay habitaciones disponibles</h3>
            <p>Lo sentimos, no hay habitaciones disponibles para las fechas seleccionadas.</p>
            <p><strong>Fechas:</strong> ${busqueda.fecha_inicio} - ${busqueda.fecha_fin}</p>
            <a href="index.html" class="btn btn-primary mt-3">Buscar otras fechas</a>
          </div>
        </div>
      `;
      return;
    }

    // Crear una fila para las tarjetas
    const row = document.createElement('div');
    row.className = 'row g-4';
    
    console.log('Habitaciones recibidas:', habitaciones);
    
    habitaciones.forEach(hab => {
      console.log('Habitación completa:', hab);
      console.log('Solo imagen:', hab.imagen);
      
      // Limpiar la URL si viene completa
      let imagenPath = hab.imagen;
      if (imagenPath.includes('http://localhost')) {
        // Extraer solo el nombre del archivo
        imagenPath = imagenPath.split('/').pop();
      }
      
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 col-sm-12';
      col.innerHTML = `
        <div class="card border-0 shadow h-100">
          <img src="img/${imagenPath}" class="card-img-top" alt="${hab.tipo_hab}" style="height: 250px; object-fit: cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold">${hab.tipo_hab}</h5>
            <p class="text-muted flex-grow-1" style="font-size: 0.9rem;">${hab.descripcion_hab || ''}</p>
            <div class="mb-3">
              <span class="badge bg-success me-2">Disponible</span>
              ${hab.disponible > 1 ? `<span class="badge bg-light text-dark">${hab.disponible} ${hab.disponible === 1 ? 'habitación' : 'habitaciones'}</span>` : ''}
            </div>
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 class="text-primary mb-0">$${parseInt(hab.precio).toLocaleString('es-UY')}</h4>
                <small class="text-muted">por noche</small>
              </div>
            </div>
            <a href="reserva.html?id=${hab.id_hab}" class="btn btn-primary w-100">Reservar ahora</a>
          </div>
        </div>
      `;
      row.appendChild(col);
    });
    
    contenedor.appendChild(row);
  }

  function aplicarFiltros() {
    const min = precioMin.value ? parseInt(precioMin.value) : 0;
    const max = precioMax.value ? parseInt(precioMax.value) : Infinity;

    habitacionesFiltradas = busqueda.habitaciones.filter(hab => {
      const precio = parseInt(hab.precio);
      return precio >= min && precio <= max;
    });

    mostrarHabitaciones(habitacionesFiltradas);
  }

  // Eventos de filtros (solo si existen los elementos)
  if (precioMin) {
    precioMin.addEventListener('input', aplicarFiltros);
  }
  if (precioMax) {
    precioMax.addEventListener('input', aplicarFiltros);
  }

  // Mostrar habitaciones inicialmente
  mostrarHabitaciones(busqueda.habitaciones);
});