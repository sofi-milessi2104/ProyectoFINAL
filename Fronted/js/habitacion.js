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
    return habitaciones.map(hab => `
        <div class="card">
            <img src="../img/18.jpeg" alt="River loft" class="card-img">
            <div class="card-body">
                <h3>${hab.tipo_hab}</h3>
                <p>${hab.descripcion_hab}</p>
                <p><strong>Disponible:</strong> ${hab.cantidad}</p>
                <p><strong>Precio:</strong> $${parseFloat(hab.precio).toFixed(2)}</p>
            </div>
        </div>
    `).join("");
}

document.addEventListener("DOMContentLoaded", obtenerHabitacion);
