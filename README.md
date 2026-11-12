# Pearlhost Dashboard

Dashboard responsive para la gestión y monitoreo de servidores, diseñado como una SPA (Single Page Application) con una interfaz moderna para visualizar el estado general del sistema.

## Descripción

Pearlhost es una aplicación frontend de control y supervisión de infraestructura. Permite ver de forma clara información como:

- uso de CPU y memoria RAM
- servidores activos
- alertas del sistema
- tráfico de red
- detalle de servidores por entorno
- configuración de preferencias del usuario

La aplicación está desarrollada con HTML, CSS y JavaScript, y se enfoca en una experiencia visual agradable y adaptable a distintos tamaños de pantalla.

## Características

- Dashboard principal con métricas rápidas
- Vista de servidores y estado operativo
- Panel de alertas y monitoreo
- Gráfico de tráfico de red
- Modo oscuro y modo claro
- Diseño responsivo para desktop y móvil
- Navegación con sidebar y diálogo de configuración

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- LocalStorage para persistencia del tema

## Estructura del proyecto

```text
Práctica_Integral_Dashboard_SPA_Responsivo/
├── Dashboard.html
├── Dashboard.css
├── Servidores.html
├── Servidores.css
├── Configuracion.css
├── Configurar_Servidor.css
├── Añadir_Servidor.css
├── Cancelar_Servidor.css
├── index.html
├── script.js
└── README.md
```

## Cómo ejecutar la aplicación

### Opción 1: abrir directamente

1. Ve a la carpeta del proyecto.
2. Abre el archivo `index.html` en tu navegador.
3. La página redirigirá automáticamente a la vista principal del dashboard.

### Opción 2: usar un servidor local

Si quieres servir la aplicación desde un entorno más realista, puedes ejecutar:

```bash
cd "ruta\a\tu\proyecto\Práctica_Integral_Dashboard_SPA_Responsivo"
python -m http.server 8000
```

Luego abre esta URL en tu navegador:

```text
http://localhost:8000
```

También puedes usar la extensión Live Server de VS Code para cargar la app rápidamente.

## Uso

- En la vista principal puedes revisar el estado de CPU, RAM y servidores.
- Desde la barra lateral puedes navegar a la sección de servidores.
- El botón de configuración permite cambiar preferencias visuales del sistema.
- El modo oscuro se guarda localmente en el navegador.

## Notas

Este proyecto es una interfaz frontend estática; no incluye backend ni conexión a base de datos en este momento. Está pensado como una maqueta o práctica de diseño y dashboard administrativo.

## Autor

Proyecto desarrollado para la práctica integral de diseño de interfaces web.

## Licencia

Este proyecto se entrega con fines educativos y de práctica académica.
