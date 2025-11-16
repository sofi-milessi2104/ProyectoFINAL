// 🌀 Carrusel principal
var swiper = new Swiper(".swiper-container", {
  spaceBetween: 30,
  effect: "fade",
  loop: true,
  autoplay: {
    delay: 3500,
    disableonInteraction: false,
  },
});

// 🌀 Carrusel reseñas
var swiper = new Swiper(".swiper-reseñas", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
  },
});

document.addEventListener("DOMContentLoaded", () => {
  // Limpiar formulario si venimos de habDisponible
  const formDisponibilidad = document.getElementById('formDisponibilidad');
  if (formDisponibilidad && !localStorage.getItem('busquedaDisponibilidad')) {
    formDisponibilidad.reset();
  }
  
  const loginLink = document.getElementById("loginLink");
  const userMenuContainer = document.getElementById("userMenuContainer");
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");

  // Intentamos obtener datos del usuario guardado
  let sesionUser = null;
  try {
    sesionUser = JSON.parse(localStorage.getItem("sesionUser"));
  } catch (e) {
    console.error("Error leyendo sesión del usuario:", e);
  }

  // Si hay sesión activa
  if (sesionUser && sesionUser.email) {
    loginLink.style.display = "none"; // ocultar botón login
    userMenuContainer.style.display = "inline-block"; // mostrar avatar

    // Inicial del nombre
    const inicial = sesionUser.nombre
      ? sesionUser.nombre.charAt(0).toUpperCase()
      : sesionUser.email.charAt(0).toUpperCase();

    userAvatar.textContent = inicial;
    userEmail.textContent = sesionUser.email;

    // Abrir/cerrar menú
    userAvatar.addEventListener("click", () => {
      userDropdown.classList.toggle("hidden");
    });

    // Cerrar sesión
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("sesionUser");
      alert("Sesión cerrada correctamente.");
      location.reload();
    });

    // Cerrar el menú si clickea afuera
    document.addEventListener("click", (e) => {
      if (!userMenuContainer.contains(e.target)) {
        userDropdown.classList.add("hidden");
      }
    });
  } else {
    // No hay sesión, mostrar login
    loginLink.style.display = "inline-block";
    userMenuContainer.style.display = "none";
  }
});



//Disponibilidad de habitaciones

const formDisponibilidad = document.getElementById('formDisponibilidad');

if (formDisponibilidad) {
    formDisponibilidad.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const fechaInicio = document.getElementById('fecha_inicio').value;
        const fechaFin = document.getElementById('fecha_fin').value;
        const adultos = document.getElementById('adultos').value;
        const ninos = document.getElementById('ninos').value;

        // Validar que las fechas estén completas
        if (!fechaInicio || !fechaFin) {
            alert('Por favor, selecciona ambas fechas');
            return;
        }

        // Validar que la fecha de salida sea posterior a la de entrada
        if (new Date(fechaFin) <= new Date(fechaInicio)) {
            alert('La fecha de salida debe ser posterior a la fecha de entrada');
            return;
        }

        try {
            const response = await fetch('../Backend/routes/habDisponibles.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                })
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            if (data.success) {
                // Guardar en localStorage las fechas y habitaciones disponibles
                localStorage.setItem('busquedaDisponibilidad', JSON.stringify({
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin,
                    adultos: adultos,
                    ninos: ninos,
                    habitaciones: data.habitaciones || []
                }));
                window.location.href = 'habDisponible.html';
            } else {
                alert('No se pudo obtener disponibilidad: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al consultar disponibilidad. Por favor, inténtelo de nuevo.');
        }
    });
}

// Botones de reserva de las tarjetas estáticas en index.html
document.addEventListener("DOMContentLoaded", () => {
    const reservarButtons = document.querySelectorAll('a[href="reserva.html"]');
    
    reservarButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Buscar la tarjeta padre para obtener el tipo de habitación
            const card = this.closest('.card');
            if (!card) return;
            
            const tipoHab = card.querySelector('h5').textContent.trim();
            
            // Mapeo de nombres a IDs y precios según la base de datos
            const habitacionesMap = {
                'Suite': { id: 1, precio: 3.438 },
                'River Suite': { id: 2, precio: 6.849 },
                'Loft': { id: 3, precio: 10.273 },
                'River Loft': { id: 4, precio: 13.755 },
                'Super Loft': { id: 5, precio: 17.123 }
            };
            
            const habInfo = habitacionesMap[tipoHab];
            if (!habInfo) {
                console.error('No se encontró información para:', tipoHab);
                window.location.href = 'reserva.html';
                return;
            }
            
            // Guardar información de la habitación en localStorage
            localStorage.setItem('reservaTemp', JSON.stringify({
                id_habitacion: habInfo.id,
                tipo_habitacion: tipoHab,
                precio: habInfo.precio,
                fecha_inicio: null,
                fecha_fin: null,
                adultos: 1,
                ninos: 0
            }));
            
            // Redirigir a reserva
            window.location.href = 'reserva.html';
        });
    });
});
