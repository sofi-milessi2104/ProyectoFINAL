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

// 🧠 Control de sesión del usuario (Login / Logout)
document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.querySelector(".btn-login[href='usuario.html']");
  const navbar = document.querySelector(".navbar .d-flex");

  // Crear botón de cerrar sesión dinámico
  const btnLogout = document.createElement("button");
  btnLogout.textContent = "Cerrar sesión";
  btnLogout.classList.add("btn-login");
  btnLogout.style.display = "none";
  navbar.appendChild(btnLogout);

  // Verificar si hay usuario logueado
  const sesionUser = localStorage.getItem("sesionUser");

  if (sesionUser) {
    // Si hay usuario, ocultamos login y mostramos logout
    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-block";
  } else {
    // Si no hay usuario, mostrar login
    btnLogin.style.display = "inline-block";
    btnLogout.style.display = "none";
  }

  // Cerrar sesión (borrar localStorage)
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("sesionUser");
    alert("Sesión cerrada correctamente");
    location.reload();
  });
});
