// admin.js (JavaScript para el Panel de Administración)

document.addEventListener('DOMContentLoaded', function() {
    console.log('Panel de Administración cargado. Listo para gestionar el hotel.');

    // Aquí iría la lógica para cargar datos vía API (AJAX/Fetch)
    // y actualizar las métricas del dashboard, como:
    /*
    fetch('api/reservas_hoy')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.card-text.fs-1.fw-bold').textContent = data.count;
        });
    */

    // Lógica para manejar la confirmación de reservas en la tabla
    document.querySelectorAll('.btn-success').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const reservaId = row.querySelector('td:first-child').textContent;
            
            // Simulación de confirmación
            alert(`Reserva ${reservaId} ha sido confirmada.`);
            row.remove(); // Eliminar de la lista de pendientes (solo visual)
        });
    });
});