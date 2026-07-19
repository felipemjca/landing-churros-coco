/*
  JavaScript de Churros Coco — solo 3 bloques, cada uno hace UNA cosa.
  Está comentado asumiendo que es la primera vez que leés JavaScript.

  1. Menú móvil (abrir/cerrar la navegación en el celular)
  2. Revelado progresivo al hacer scroll (las secciones "aparecen")
  3. Año automático en el pie de página

  Todo lo demás de la página (acordeones, mapas, botones de WhatsApp)
  funciona con HTML puro, sin JavaScript: menos código que mantener.
*/

/* =========================================================
   1. MENÚ MÓVIL
   ========================================================= */

// document.querySelector busca en la página UN elemento que coincida con el
// selector que le pasamos (igual que en CSS). Acá: el botón hamburguesa.
const botonMenu = document.querySelector('.nav-principal__toggle');

// addEventListener = "agregar un escuchador de eventos": le decimos al botón
// "cuando pase un 'click', ejecutá esta función".
if (botonMenu) {
  botonMenu.addEventListener('click', () => {
    // Leemos si el menú ya estaba abierto (aria-expanded="true") o no.
    const estaAbierto = botonMenu.getAttribute('aria-expanded') === 'true';

    // Lo cambiamos al valor contrario. Este atributo hace dos cosas a la vez:
    // el CSS muestra/oculta la lista según su valor, y el lector de pantalla
    // anuncia el cambio de estado ("expandido"/"contraído") automáticamente.
    botonMenu.setAttribute('aria-expanded', String(!estaAbierto));
  });

  // Detalle de usabilidad: si tocás un link del menú (por ejemplo "Menú"),
  // el menú desplegable se cierra solo en vez de quedar tapando la página.
  const linksDelMenu = document.querySelectorAll('.nav-principal__lista a');
  linksDelMenu.forEach((link) => {
    link.addEventListener('click', () => {
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
}

/* =========================================================
   2. REVELADO PROGRESIVO AL HACER SCROLL
   ========================================================= */

// querySelectorAll trae TODOS los elementos que coincidan (querySelector trae
// solo el primero). Buscamos los que tengan el atributo data-reveal.
const elementosParaRevelar = document.querySelectorAll('[data-reveal]');

// matchMedia le pregunta al navegador por preferencias del sistema del
// visitante. Si activó "reducir movimiento" (hay gente a la que las
// animaciones le producen mareo real), no animamos nada.
const prefiereMenosMovimiento = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefiereMenosMovimiento) {
  // Mostramos todo de una, sin animación de entrada.
  elementosParaRevelar.forEach((elemento) => {
    elemento.classList.add('es-visible');
  });
} else {
  // IntersectionObserver es un "sensor": le decimos qué elementos vigilar y
  // nos avisa cuando alguno entra en la pantalla.
  const sensorDeScroll = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        // isIntersecting es true cuando el elemento ya se ve en pantalla.
        if (entrada.isIntersecting) {
          entrada.target.classList.add('es-visible');
          // Ya se mostró: dejamos de vigilarlo para no gastar recursos.
          sensorDeScroll.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.12 } // "visible" = se ve al menos un 12% del elemento
  );

  elementosParaRevelar.forEach((elemento) => {
    sensorDeScroll.observe(elemento);
  });
}

/* =========================================================
   3. AÑO AUTOMÁTICO EN EL PIE
   Para no editar el "© 2026" a mano cada enero.
   ========================================================= */
const elementoAnio = document.querySelector('#anio-actual');

if (elementoAnio) {
  // new Date() crea la fecha actual; getFullYear() devuelve solo el año.
  elementoAnio.textContent = new Date().getFullYear();
}
