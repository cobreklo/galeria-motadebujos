# Galería Motadebujos

Portafolio de arte en una sola página con un carrusel inmersivo y un visor de imágenes a pantalla completa. Construido con Tailwind vía CDN, sin dependencias adicionales.

## Características Principales
- Carrusel horizontal con `snap-center`, controles `Anterior/Siguiente` y desplazamiento con easing.
- Auto-snap al finalizar el scroll manual para centrar la tarjeta más cercana.
- Efecto inmersivo: escala, brillo y sombra sutil basadas en la posición de la tarjeta.
- Lightbox para ampliar imágenes al hacer clic, con cierre por botón, clic fuera y tecla `Esc`.
- Diseño responsive y estilizado con Tailwind, sin configuración de build.

## Estructura del Proyecto
- `code.html`: único archivo principal que contiene el HTML, estilos y scripts.
- `img/`: carpeta con las imágenes usadas en la galería.

Secciones en `code.html`:
- Hero: presentación y llamada a ver la galería.
- Galería: carrusel inmersivo con tarjetas (`code.html:96` para el título, `code.html:99` para el contenedor `#galleryTrack`).
- Contacto: formulario simple (`code.html:153`).
- Redes: enlaces sociales (`code.html:179`).

## Requisitos
- Navegador moderno (Chrome, Edge, Firefox, Safari).
- No requiere instalación ni servidor; basta abrir el archivo `code.html`.

## Cómo Ejecutar
- Doble clic en `code.html` para abrirlo en el navegador.
- Opcional (servidor local):
  - Node: `npx serve .`
  - Python: `python -m http.server`
  - Luego visita `http://localhost:8000` o el puerto que corresponda.

## Personalización Rápida
- Colores, tipografías y radios:
  - Ajusta el bloque de configuración de Tailwind en `code.html:13-33`.
- Añadir/editar tarjetas:
  - Duplica un bloque `.gallery-card` dentro de `#galleryTrack` y cambia la URL en `style='background-image: url("./img/...")'` y el título dentro del `<p>`.
- Tamaño de tarjetas:
  - Modifica las clases de ancho `w-[220px] md:w-[260px] lg:w-[300px]` en cada `.gallery-card`.
- Intensidad del efecto inmersivo:
  - Ajusta los cálculos en el script (escala/brillo/sombra) dentro de `active()` (`code.html:211+`), por ejemplo cambiando límites y divisores.

## Carrusel: Detalles Técnicos
- Contenedor: `#galleryTrack` (`code.html:99`) con `overflow-x-auto`, `snap-mandatory` y ocultación de barra de scroll.
- Controles: `#prevBtn` y `#nextBtn` (`code.html:98,149`) con transición y escala al hover.
- Alineación de bordes:
  - Se insertan separadores invisibles al inicio y al final para que la primera y última imagen puedan centrarse correctamente.
- Easing personalizado:
  - El desplazamiento por botones usa una animación con easing cúbico para mayor suavidad.

## Lightbox
- Overlay: `#lightbox` al final del `body` (`code.html:206-209`).
- Apertura:
  - Al hacer clic en una tarjeta, se extrae la URL del `background-image` y se muestra en el `<img id="lightboxImg">`.
- Cierre:
  - Botón `close`, clic fuera del contenido o `Escape`.

## Accesibilidad
- Texto alternativo:
  - Usa `data-alt` en cada `.gallery-card` para describir la imagen (se pasa al `alt` del lightbox).
- Navegación con teclado:
  - Lightbox cerrable con `Esc`. Se puede extender para focos y roles ARIA si se requiere.

## Buenas Prácticas con Imágenes
- Comprime imágenes (JPEG/WEBP) y usa resoluciones acordes (ej. 1200–1600px lado mayor).
- Nombra archivos con sentido y evita espacios.
- Mantén la carpeta `img/` organizada por colecciones si crece el catálogo.

## Despliegue
- Al ser estático, puedes subirlo a:
  - GitHub Pages (pon `code.html` como `index.html`).
  - Netlify, Vercel o cualquier hosting estático.
- Asegúrate de subir la carpeta `img/` junto al HTML.

## Referencias de Código
- Configuración Tailwind: `c:\Users\Claudio\Desktop\galeriamota\code.html:13`
- Contenedor del carrusel: `c:\Users\Claudio\Desktop\galeriamota\code.html:99`
- Botones de navegación: `c:\Users\Claudio\Desktop\galeriamota\code.html:98,149`
- Lightbox: `c:\Users\Claudio\Desktop\galeriamota\code.html:206-209`
- Script del carrusel y lightbox: `c:\Users\Claudio\Desktop\galeriamota\code.html:211-231`

## Licencia
- Sin licencia especificada. Si lo deseas, añade una sección de licencia (MIT, CC, etc.) según tus preferencias.

## Créditos
- Arte y diseño: Motadebujos.
- Tecnologías: Tailwind CSS vía CDN.
