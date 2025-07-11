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
