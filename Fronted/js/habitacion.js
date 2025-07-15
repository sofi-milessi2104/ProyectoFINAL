async function obtenerHabitacion() {
    try{
        const respuesta=await fetch("../Backend/routes/api.php?url=habitacion");
        const habitacion=await respuesta.json();
        console.log(habitacion);
        const contenedor=document.getElementById("contenedor-habitacion");
        contenedor.innerHTML=crearCards()(habitacion);
    }catch(error){
        console.error("Error al obtener las habitaciones" + error);
    }
}

function crearCards(habitaciones) {
    return habitaciones.map(habitacion => `
        <div class="card">
            <div class="tilt">
                <div class="img">
                    <img src="${habitacion.imagen}" alt="${habitacion.tipo_hab}">
                </div>
            </div>
            <div class="info">
                <h2 class="title">${habitacion.tipo_hab}</h2>
                <p class="desc">${habitacion.descripcion}</p>
                <div class="bottom">
                    <div class="price">
                        <span class="new">$${habitacion.precio}</span>
                    </div>
                    <a href="info.html" class="btn">
                        <span>Ver más</span>
                    </a>
                </div>
                <div class="meta">
                    <div class="stock">${habitacion.disponibilidad}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Llama a la función para obtener las habitaciones al cargar la página
document.addEventListener("DOMContentLoaded", obtenerHabitacion);
