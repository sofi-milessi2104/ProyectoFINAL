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
  spaceBetween: 30,
  effect: "fade",
  loop: true,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },

  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 3,
  coverflowEffect: {  
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
  },
  breakpoints: {
    320: { slidesPerView: 1 },
    640: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
  },
});

document.addEventListener("DOMContentLoaded", () => {
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
