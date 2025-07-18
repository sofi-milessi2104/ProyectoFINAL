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
    return habitaciones.map((hab, i) => `
        <div class="card">
            <img src="../Fronted/img/1.jpeg${hab.imagen}" alt="${hab.tipo_hab}" class="card-img">
            <div class="card-body">
                <h3>${hab.tipo_hab}</h3>
                <p>${hab.descripcion_hab}</p>
                <p><strong>Disponible:</strong> ${hab.cantidad ? 'Sí': 'Sí'}</p>
                <p><strong>Precio:</strong> $${hab.precio}</p>
                <button onclick="abrirModal(${i})">Ver más</button>
            </div>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", obtenerHabitacion);
