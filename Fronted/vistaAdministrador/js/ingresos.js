// Variable para almacenar la URL base del API
const API_BASE = "../../Backend/routes/ingresos.php";

// Objeto de mapeo de números de mes a nombres en español
const NOMBRES_MESES = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

/**
 * Función principal que se ejecuta al cargar la página.
 * Se envuelve en un IIAFE (Immediately-Invoked Async Function Expression)
 * para permitir el uso de 'await' en el cuerpo principal.
 */
(async () => {
    // 1. Cargar y mostrar los ingresos del mes actual
    await cargarIngresosMes(); 
    
    // 2. Cargar los datos anuales y dibujar el gráfico
    await cargarGraficoIngresos();
})();


/**
 * Carga los ingresos del mes actual desde el backend y actualiza el DOM.
 */
async function cargarIngresosMes() {
    try {
        const res = await fetch(`${API_BASE}?action=mes`);
        const data = await res.json();

        if (data.success && data.ingresos_mes !== undefined) {
            console.log("Ingresos del mes:", data.ingresos_mes);
            // Formatear a moneda local (ej: $1.234,50). 
            // Usa 'es-ES' si necesitas el punto como separador de miles.
            const valorFormateado = data.ingresos_mes.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'UYU', // Cambia 'USD' por tu moneda (ej: 'ARS', 'CLP', 'MXN', etc.)
                minimumFractionDigits: 0 // Ajusta si necesitas decimales
            });
            
            document.getElementById('ingresos-mes').innerText = valorFormateado;
        } else {
             document.getElementById('ingresos-mes').innerText = `$0`;
             console.warn("Respuesta de API inesperada para ingresos del mes:", data);
        }

    } catch (e) {
        console.error("Error cargando ingresos del mes:", e);
        document.getElementById('ingresos-mes').innerText = `Error`;
    }
}

/**
 * Carga los datos de ingresos por mes y llama a la función para dibujar el gráfico.
 */
async function cargarGraficoIngresos() {
    try {
        const res = await fetch(`${API_BASE}?action=por_mes`);
        const data = await res.json();
        
        if (data.success && data.ingresos_por_mes) {
            console.log("Ingresos por mes:", data.ingresos_por_mes);
            dibujarGrafico(data.ingresos_por_mes);
        } else {
            console.error("No se recibieron datos de ingresos para el gráfico.");
        }
    } catch (e) {
        console.error("Error cargando datos para el gráfico:", e);
    }
}

/**
 * Procesa los datos y dibuja el gráfico de barras.
 * @param {Array<Object>} ingresosData - Array de objetos {mes: int, total: float}.
 */
function dibujarGrafico(ingresosData) {
    const ctx = document.getElementById('graficoIngresos').getContext('2d');
    
    // 1. Preparar las etiquetas (meses) y los datos (totales)
    const etiquetas = [];
    const totales = [];

    // Llenamos las etiquetas con los nombres de mes y los datos con los totales
    ingresosData.forEach(item => {
        // Los meses en DB son 1-12. El array NOMBRES_MESES es 0-11, por eso restamos 1.
        if (item.mes >= 1 && item.mes <= 12) {
             etiquetas.push(NOMBRES_MESES[item.mes - 1]);
             totales.push(item.total);
        }
    });

    // 2. Crear la configuración del gráfico
    new Chart(ctx, {
        type: 'bar', // Tipo de gráfico: barras
        data: {
            labels: etiquetas, // Eje X: Ene, Feb, Mar, etc.
            datasets: [{
                label: 'Ingresos Mensuales',
                data: totales, // Eje Y: Valores de ingresos
                backgroundColor: 'rgba(54, 162, 235, 0.7)', // Color de las barras
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monto de Ingresos'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Ocultar la leyenda si solo hay una serie
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            // Formatear el valor dentro del tooltip como moneda
                            label += context.parsed.y.toLocaleString('es-ES', {
                                style: 'currency',
                                currency: 'UYU', // Cambia 'USD' por tu moneda
                                minimumFractionDigits: 0
                            });
                            return label;
                        }
                    }
                }
            }
        }
    });
}