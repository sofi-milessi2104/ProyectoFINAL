// Variable global para almacenar los datos de los servicios
let todosLosServicios = [];

// Función para obtener los datos de los servicios de la API
async function obtenerServicios() {
    try {
        const respuesta = await fetch("../Backend/routes/api.php?url=servicio");
        const serviciosBD = await respuesta.json();

        todosLosServicios = serviciosBD;
        console.log("Servicios obtenidos y procesados:", todosLosServicios);

        // Renderiza las tarjetas de servicios al obtener los datos
        renderizarServicios(todosLosServicios);
    } catch (error) {
        console.error("Error al obtener servicios: " + error);
        const contenedor = document.getElementById("contenedor-servicios");
        if (contenedor) {
            contenedor.innerHTML = `
                <div class="alert alert-danger text-center" role="alert">
                    Ocurrió un error al cargar los servicios. Por favor, inténtelo de nuevo más tarde.
                </div>
            `;
        }
    }
}

// Función para renderizar las tarjetas de servicios en el HTML
function renderizarServicios(servicios) {
    const contenedor = document.getElementById("contenedor-servicios");
    if (!contenedor) {
        console.error("No se encontró el contenedor con el id 'contenedor-servicios'.");
        return;
    }

    if (servicios.length === 0) {
        contenedor.innerHTML = `
            <div class="alert alert-warning text-center" role="alert">
                No se encontraron servicios disponibles.
            </div>
        `;
    } else {
        contenedor.innerHTML = crearCardsServicios(servicios);
    }
}

// Función para generar el código HTML de las tarjetas de servicios
function crearCardsServicios(servicios) {
    return `
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 px-4">
                    ${servicios.map(servicio => `
                        <div class="card mb-4 border-0 shadow">
                            <div class="row g-0 p-3 align-items-center">
                                <div class="col-md-5 mb-lg-0 mb-md-0 mb-3">
                                    <img src="../Fronted/img/${servicio.imagen}" class="img-fluid rounded" alt="${servicio.tipo_servicio}">
                                </div>
                                <div class="col-md-7 px-lg-3 px-md-3 px-0">
                                    <h5 class="mb-3">${servicio.tipo_servicio}</h5>
                                    <p class="text-secondary">${servicio.descripcion_servicio}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Función para manejar los filtros de tipo de servicio
function manejarFiltros() {
    const checkboxes = document.querySelectorAll('#filterDropdown input[type="checkbox"]');
    const tiposSeleccionados = [];

    // Recorre las casillas para ver cuáles están marcadas
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            tiposSeleccionados.push(checkbox.value);
        }
    });

    // Filtra los servicios
    const serviciosFiltrados = (tiposSeleccionados.length === 0)
        ? todosLosServicios // Si no hay nada seleccionado, muestra todo
        : todosLosServicios.filter(servicio => tiposSeleccionados.includes(servicio.tipo_servicio));

    renderizarServicios(serviciosFiltrados);
}

// Inicia la carga de servicios y configura los escuchadores de eventos
document.addEventListener("DOMContentLoaded", () => {
    obtenerServicios();

    // Agrega un escuchador de eventos a cada casilla de verificación del filtro
    const checkboxes = document.querySelectorAll('#filterDropdown input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', manejarFiltros);
    });
});