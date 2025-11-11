document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formFechas');
  const resultadoDiv = document.getElementById('resultado');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fechaInicio = document.getElementById('fecha_inicio').value;
    const fechaFin = document.getElementById('fecha_fin').value;

    try {
      const response = await fetch('../../Backend/routes/habDisponibles.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: fechaFin })
      });

      const data = await response.json();

      if (data.success) {
        resultadoDiv.innerHTML = '<h3>Habitaciones disponibles:</h3>';
        if (data.data.length === 0) {
          resultadoDiv.innerHTML += '<p>No hay habitaciones disponibles en ese rango de fechas.</p>';
        } else {
          const lista = document.createElement('ul');
          data.data.forEach(hab => {
            const item = document.createElement('li');
            item.textContent = `Habitación ${hab.id_hab} - ${hab.tipo} - $${hab.precio}`;
            lista.appendChild(item);
          });
          resultadoDiv.appendChild(lista);
        }
      } else {
        resultadoDiv.innerHTML = `<p>Error: ${data.message}</p>`;
      }
    } catch (error) {
      resultadoDiv.innerHTML = `<p>Error de conexión: ${error.message}</p>`;
    }
  });
});