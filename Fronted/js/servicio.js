async function obtenerServicio() {
    try{
        const respuesta=await fetch("../Backend/routes/api.php?url=servicio");
        const servicio=await respuesta.json();
        console.log(servicio);
        const contenedor=document.getElementById("contenedor-servicio");
        contenedor.innerHTML=crearCards(servicio);

    }catch(error){
        console.error("Error al ontener servicio" + error);
    }
}

function crearCardsServicios(servicios) {
    return servicios.map(serv => `
        <div class="card-servicio">
            <div class="img-servicio">
                <img src="../Fronted/img/${serv.imagen}" alt="${serv.tipo_servicio}">
            </div>
            <div class="info-servicio">
                <div class="cat-servicio">${serv.tipo_servicio}</div>
                <h2 class="title-servicio">${serv.tipo_servicio}</h2>
                <p class="desc-servicio">${serv.descripcion_servicio}</p>
                <div class="bottom-servicio">
                    <button class="btn-servicio" data-id="${serv.id_servicio}">
                        <span>Ver más</span>
                        <svg class="icon-servicio" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4"/>
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <path d="M16 10a4 4 0 01-8 0"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

obtenerServicio();
