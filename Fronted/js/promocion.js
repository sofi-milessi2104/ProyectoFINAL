async function obtenerPromocion() {
    try{
        const respuesta=await fetch("../Backend/routes/api.php?url=promocion");
        const promocion=await respuesta.json();
        console.log(promocion);
        const contenedor=document.getElementById ("contenedor-promocion");
        contenedor.innerHTML=crearCards(promocion);

    }catch (error){
        console.error("Error al obtener promocion" + error);
    }
    }

function crearCards(promociones) {
    return promociones.map((promo, i) => `
        <div class="card">
            <img src="../Fronted/img/${promo.img_promo}" alt="${promo.tipo_promo}" class="card-img">
            <div class="card-body">
                <h3>${promo.tipo_promo}</h3>
                <p>${promo.descripcion_promo}</p>
                <p><strong>Precio:</strong> $${promo.precio_promo}</p>
                <button class="btn-reserva-promocion">Reservar</button>
            </div>
        </div>
    `).join("");
}


obtenerPromocion();
