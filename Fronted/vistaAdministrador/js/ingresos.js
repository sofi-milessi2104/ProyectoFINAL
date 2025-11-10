const response = await fetch("../../Backend/routes/ingresos.php");

async function cargarIngresosMes() {
    try {
        const res = await fetch(`${API_BASE}?action=mes`);
        const data = await res.json();
        console.log("mes:", data);
        // actualizar DOM...
    } catch (e) {
        console.error("Error cargando ingresos:", e);
    }
}

async function cargarGraficoIngresos() {
    try {
        const res = await fetch(`${API_BASE}?action=por_mes`);
        const data = await res.json();
        console.log("por_mes:", data);
        // procesar y dibujar gráfico...
    } catch (e) {
        console.error("Error cargando gráfico:", e);
    }
}
