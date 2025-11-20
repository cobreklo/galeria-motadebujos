[c:\Users\Claudio\Desktop\galeriamota\README.md]
# Galería Motadebujos

Portfolio web de una artista chilena dedicada a comisiones, cover arts e ilustraciones por encargo. El sitio prioriza una experiencia inmersiva y accesible: carrusel con detalle ampliado, filtros, lightbox optimizado, temas claro/oscuro/sepia y un formulario de contacto listo para recibir solicitudes.

## Demo y Uso
- Local: abre `index.html` (en este repositorio el archivo se llama `index.html`; en tu entorno actual se usa `code.html`).
- GitHub Pages: habilita Pages desde la configuración del repositorio y establece la rama (por ejemplo `main`) como fuente. La web es estática y no requiere build.
- Vercel: importa el repo y despliega como proyecto estático.

## Características
- Carrusel inmersivo:
  - Snap scrolling, controles laterales y puntos de paginación.
  - Centrado preciso del ítem activo y animaciones suaves.
- Lightbox:
  - Detalle con metadata (título, técnica, año, tamaño).
  - Navegación por teclado y swipe en móvil, con botones laterales visibles.
  - Botón “Ver en Instagram” que apunta al perfil del apartado de Redes.
  - En el caso de la imagen del Hero, se abre sin controles de navegación.
- Galería (Grid):
  - Hover con escala del fondo y título que aparece, igual al carrusel.
  - Clic para ver el detalle en el lightbox.
- Filtros:
  - Chips para “Todos / Ilustración / CoverArt / Diseño” que filtran el grid.
- Hero:
  - Animación al scroll (shrink + desplazamiento).
  - Hover y clic para abrir en detalle.
- Temas:
  - Interruptor con ciclo Light/Dark/Sepia y persistencia en `localStorage`.
- Rendimiento:
  - Lazy load del grid y prefetch de imágenes adyacentes en el lightbox.
- Accesibilidad:
  - Focus-trap en el lightbox, ARIA, cierre con `Esc`.
- Contacto:
  - Formulario integrado con FormSubmit.
  - Campos: nombre, email, mensaje e Instagram (opcional).
  - Botón “Cómo cotizar” que despliega guía para solicitar una comisión.
- Secciones:
  - Acerca de mí, Proceso, Testimonios.
- SEO:
  - Metadatos Open Graph y Twitter Cards.
- Conversión:
  - CTA flotante “Solicitar”.

## Estructura
- `index.html` (en tu entorno: `code.html`): contiene todo el marcado, estilos utilitarios y JavaScript vanilla.
- `img/`: carpeta con las obras y assets.

## Contenido dinámico (artworks)
En `index.html` (`code.html`) se centralizan las obras en un arreglo `artworks`:
```js
const artworks = [
  { title: 'Young Lunv', src: './img/yungluna.jpg', alt: '...', year: 2024, tech: 'Ilustración', size: '3000x4000', tags: ['Ilustración'], featured: true },
  // ...
];
```
- `tags`: controla los filtros.
- El carrusel y el grid se renderizan automáticamente desde este arreglo.
- Para añadir una obra, agrega un objeto nuevo con sus datos y coloca el archivo en `img/`.

## Personalización
- Instagram:
  - Perfil en Redes y botón “Ver en Instagram” del lightbox apuntan al mismo enlace. Puedes actualizarlo en `index.html` (`code.html`) buscando `motadebujos`.
- Paleta:
  - Las clases de color (`text-[#1b130f]`, `bg-primary`, etc.) pueden ajustarse para afinar el tema claro/oscuro/sepia.
- Metadatos:
  - Edita los `<meta>` OG/Twitter para título, descripción e imagen.

## Formulario de contacto
- Usa FormSubmit (funciona en GitHub Pages y Vercel).
- En caso de que `fetch` falle (timeout/red), hay un fallback que envía el formulario por submit tradicional.
- Instagram (opcional) se envía como campo adicional.

## Guía para cotizar (desplegable)
- Respeto y comunicación clara.
- Descripción de la idea; el precio se ajusta según alcance.
- Abono del 50% para iniciar.
- Fotos y referencias (outfit, joyas, tatuajes; canción si es cover art).
- Plazo máximo acordado (mínimo 24 h; fecha específica si aplica).

## Desarrollo
- HTML + CSS utilitario + JavaScript vanilla.
- No requiere build ni dependencias.
- Para editar: trabaja sobre `index.html` (`code.html`) y actualiza `artworks`, enlaces y estilos.

## Licencia
Proyecto de portfolio. El contenido visual pertenece a la artista. Ajusta la licencia según tus necesidades antes de publicar.
