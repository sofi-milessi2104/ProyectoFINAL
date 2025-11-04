let todosLosServicios = [];

async function obtenerServicios() {
    try {
        const respuesta = await fetch("../Backend/routes/api.php?url=servicio");
        const serviciosBD = await respuesta.json();

        todosLosServicios = serviciosBD;
        console.log("Servicios obtenidos y procesados:", todosLosServicios);

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

function crearCardsServicios(servicios) {
    return `
        <div class="container">
            <div class="row">
                <div class="col-lg-12 col-md-12 px-4">
                    ${servicios.map(servicio => `
                        <div class="card mb-4 border-0 shadow">
                            <div class="row g-0 p-3 align-items-center">
                                <div class="col-md-5 mb-lg-0 mb-md-0 mb-3">
                                    <img src="${servicio.imagen}" class="img-fluid rounded" alt="${servicio.tipo_servicio}">
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

function manejarFiltros() {
    const checkboxes = document.querySelectorAll('#filterDropdown input[type="checkbox"]');
    const tiposSeleccionados = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            tiposSeleccionados.push(checkbox.value);
        }
    });

    const serviciosFiltrados = (tiposSeleccionados.length === 0)
        ? todosLosServicios
        : todosLosServicios.filter(servicio => tiposSeleccionados.includes(servicio.tipo_servicio));

    renderizarServicios(serviciosFiltrados);
}

document.addEventListener("DOMContentLoaded", () => {
    obtenerServicios();

    const checkboxes = document.querySelectorAll('#filterDropdown input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', manejarFiltros);
    });
});