async function obtenerAdministradores() {
    try {
        const respuesta = await fetch("../Backend/routes/api.php?url=administrador");
        const administradores = await respuesta.json();
        console.log(administradores);
        agregarEventoForm(); 
        console.log(administradores);
    } catch (error) {
        console.error("Error al obtener los administradores: " + error);
    }


}