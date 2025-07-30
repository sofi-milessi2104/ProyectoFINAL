function redirigirReserva(id) {
    // Acá cargás dinámicamente lo que necesites
    console.log("Redirigiendo a la reserva de la habitación con ID:", id);
    
    // Por ejemplo, ocultás la vista actual y mostrás el formulario de reserva
    document.body.innerHTML = ""; // o .innerHTML de un contenedor específico
    cargarFormularioReserva(id);
}
