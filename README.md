# Lodge In 

Aplicación web (solo frontend) donde los huéspedes de **Inversiones LR** pueden explorar alojamientos temporales en Colombia, filtrarlos, ver su detalle, cotizar una estadía y registrar una reserva simulada.
<br>
[Link al repositorio GITHUB](https://github.com/judalesa/Lodge-In)
<br>
Proyecto del módulo 2 del curso **Desarrollo de Sistemas de Información III**, Ingeniería de Sistemas, Universidad El Bosque.

## Integrantes

| Nombre | Rol |
| --- | --- |
| Juan David Leal Salazar | Análisis, diseño y desarrollo  |

## Tecnologías

| Tecnología | Versión | Para qué se usa |
| --- | --- | --- |
| Angular | 22.2 | Framework del frontend (componentes standalone, signals, rutas y formularios reactivos) |
| TypeScript | 6.0 | Lenguaje de la aplicación |
| RxJS | 7.8 | Lectura del JSON con `HttpClient` y manejo de flujos de datos |
| Bootstrap | 5.3.8 | Estilos, grilla responsive, carrusel y componentes visuales |
| Bootstrap Icons | 1.13.1 | Íconos |
| Angular CLI | 22.2.2 | Crear, ejecutar y compilar el proyecto |

## Requisitos

- [Node.js](https://nodejs.org/) **22.22.3 o superior** (o 24.15+). Para revisar la versión: `node --version`.
- npm (viene con Node.js).
- [Git](https://git-scm.com/).
- Angular CLI 22 (opcional, para usar el comando `ng`): `npm install -g @angular/cli@22`.

## Instalación

```bash
git clone https://github.com/judalesa/Lodge-In.git
cd Lodge-In
npm install
```

## Ejecución

```bash
ng serve
```

Si no tienes Angular CLI instalado de forma global, usa `npm start`, que hace lo mismo.

Luego abre **http://localhost:4200** en el navegador.

Para generar la versión compilada (queda en la carpeta `dist/`):

```bash
ng build
```

## Funcionalidades

- **Inicio:** nombre y descripción de la plataforma, búsqueda rápida por ciudad y huéspedes, alojamientos destacados (calificación de 4.5 o más) y una sección de "¿Cómo funciona?".
- **Listado de alojamientos:** tarjetas con imagen, nombre, ciudad, tipo, capacidad, precio por noche, calificación y servicios.
- **Filtros:** por ciudad, número de huéspedes, tipo de alojamiento y precio máximo. Se aplican al instante, quedan en la URL y se pueden limpiar. Si no hay resultados se muestra un mensaje.
- **Detalle del alojamiento** (`/alojamientos/:id`): galería de fotos, descripción, ubicación, habitaciones, camas, baños, servicios, reglas, calificación y reseñas.
- **Reseñas:** el huésped puede publicar una reseña con calificación de 1 a 5 estrellas.
- **Cotización:** a partir de las fechas y los huéspedes calcula noches, subtotal, tarifa de limpieza, tarifa de servicio (10 % del subtotal) y total.
- **Reserva simulada:** con una cotización válida se piden nombre y correo, y se crea la reserva con estado `CONFIRMADA` y un código como `R-MG3K9Z2A`.
- **Mis reservas:** tabla con las reservas hechas (alojamiento, ciudad, fechas, huéspedes, total y estado) y un contador en la barra de navegación. Si no hay reservas se muestra un mensaje.
- **Página 404** para rutas o alojamientos que no existen.
- **Diseño responsive:** se adapta a computador, tablet y celular (en celular los filtros se pliegan detrás de un botón).

### Reglas de negocio

| Regla | Dónde se valida |
| --- | --- |
| RN-01 La salida debe ser posterior a la llegada | `rangoFechas()` en `fechas.validators.ts` |
| RN-02 La llegada no puede ser una fecha pasada | `fechaNoPasada()` en `fechas.validators.ts` |
| RN-03 Debe haber al menos 1 huésped | `Validators.min(1)` en `cotizacion-form` |
| RN-04 Los huéspedes no pueden superar la capacidad | `Validators.max(capacidad)` en `cotizacion-form` |
| RN-05 El precio por noche debe ser mayor que cero | `AlojamientoService` descarta los alojamientos con precio 0 |
| RN-06 Solo se cotiza con datos válidos | Botón "Cotizar" deshabilitado y `CotizacionService.calcular()` |
| RN-07 Solo se reserva con una cotización válida | Botón "Reservar" visible solo con cotización y `ReservaService.crear()` |
| RN-08 Tarifa de servicio = 10 % del subtotal | `TARIFA_SERVICIO` en `CotizacionService` |
| RN-09 No se muestran alojamientos inactivos | `AlojamientoService` filtra `activo: true` (también en el detalle por URL) |
| RN-10 Búsqueda sin resultados informa al usuario | Componente `EstadoVacio` en el listado |

## Datos

- Los datos iniciales (alojamientos y reseñas) están en **`public/assets/data/marketplace-data.json`** y las fotos en `public/assets/images/`.
- La interfaz **no importa el JSON directamente**: lo lee `AlojamientoService` con `HttpClient`.
- No hay backend. Las **reservas** y las **reseñas nuevas** se guardan en el `localStorage` del navegador (claves `lodgein.reservas` y `lodgein.resenas`), así que siguen ahí al recargar la página. Si se borra el `localStorage`, se pierden.

## Estructura del proyecto

```
src/app/
├── core/                    Lógica y datos, sin interfaz
│   ├── models/              Interfaces TypeScript (Alojamiento, Reseña, Cotización, Reserva...)
│   ├── services/            AlojamientoService, CotizacionService, ReservaService, ResenaService
│   └── validators/          Validadores de fechas para los formularios
├── shared/components/       Componentes reutilizables
│   ├── navbar/ y footer/    Navegación y pie de página
│   ├── alojamiento-card/    Tarjeta de un alojamiento
│   ├── filtros/             Formulario de filtros del listado
│   ├── estado-vacio/        Mensaje cuando no hay información
│   ├── cotizacion-form/     Formulario de cotización y desglose
│   ├── reserva-form/        Formulario de reserva y confirmación
│   └── resena-form/         Formulario para dejar una reseña
├── pages/                   Una carpeta por ruta
│   ├── inicio/              /
│   ├── listado/             /alojamientos
│   ├── detalle/             /alojamientos/:id
│   ├── mis-reservas/        /mis-reservas
│   └── no-encontrado/       Cualquier otra ruta (404)
├── app.routes.ts            Rutas con carga diferida (lazy loading)
└── app.config.ts            Router, HttpClient e idioma es-CO
public/assets/               JSON de datos e imágenes
docs/                        Documentos del proyecto
```

## Documentación

- [Acta de Constitución del Proyecto](docs/Acta%20de%20Constituci%C3%B3n%20de%20Proyecto.pdf)
- Prototipo en Figma: [Lodge In · Prototipo](https://www.figma.com/design/1HLVLlOeQbjDujNPFNLhtp)
