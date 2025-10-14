var swiper = new Swiper(".swiper-container", {
 spaceBetween: 30,
 effect: "fade",
 loop: true,
 autoplay: {
    delay: 3500,
    disableonInteraction: false,
 }
 });

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
      slidesPerView: "auto",
      slidesPerView: 3,
      loop: true,
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
        320: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },

    });


    // Inicializar Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'es',
    includedLanguages: 'en,es,fr,de,it,pt',
    layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL
  }, 'google_translate_element');
}

// Cargar script de Google Translate
function loadGoogleTranslate() {
  const script = document.createElement('script');
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(script);
}

// Mostrar/ocultar dropdown
function toggleDropdown() {
  const dropdown = document.getElementById('languageDropdown');
  dropdown.classList.toggle('show');
}

// Cambiar idioma
function changeLanguage(lang) {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
  toggleDropdown(); // Cerrar dropdown
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('languageDropdown');
  const button = document.querySelector('.language-btn');

  if (!button.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.classList.remove('show');
  }
});

// Cargar Google Translate cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadGoogleTranslate);


  