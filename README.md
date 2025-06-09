# EasyCRM Frontend

Este es el frontend de la aplicación EasyCRM, una aplicación web completa con operaciones CRUD para gestionar productos, clientes y pedidos.

## Tecnologías utilizadas

- **React**: Biblioteca para construir interfaces de usuario
- **React Router**: Enrutamiento para aplicaciones React
- **Axios**: Cliente HTTP para hacer peticiones a la API
- **Tailwind CSS**: Framework de CSS utilitario
- **React Icons**: Iconos para React

## Estructura del proyecto

```
src/
├── assets/           # Imágenes y otros archivos estáticos
├── components/       # Componentes reutilizables
├── contexts/         # Contextos de React (Auth, Cart)
├── pages/            # Páginas/Vistas de la aplicación
├── services/         # Servicios para comunicarse con la API
├── App.jsx           # Componente principal y configuración de rutas
├── main.jsx          # Punto de entrada de la aplicación
└── index.css         # Estilos globales
```

## Funcionalidades principales

- **Autenticación**: Inicio de sesión y cierre de sesión
- **Gestión de productos**: Ver, crear, editar y eliminar productos
- **Carrito de compras**: Añadir productos al carrito
- **Gestión de pedidos**: Ver historial de pedidos y detalles

## Requisitos previos

- Node.js (v14 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd easy_crm_frontend
```

2. Instalar dependencias:
```bash
npm install
# o con yarn
yarn install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con la siguiente configuración:
```
VITE_API_URL=http://localhost:8000/api
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o con yarn
yarn dev
```

## Despliegue

Para construir la aplicación para producción:

```bash
npm run build
# o con yarn
yarn build
```

Los archivos estáticos se generarán en la carpeta `dist/`.

## Conexión con el backend

Este frontend está diseñado para funcionar con el backend de Django ubicado en la carpeta `easycrm_project`. Asegúrate de que el backend esté en funcionamiento antes de iniciar el frontend.

## Mejoras implementadas

1. **Diseño responsive**: La aplicación se adapta a diferentes tamaños de pantalla
2. **Sistema de temas**: Uso de variables de color en Tailwind CSS
3. **Mejoras de accesibilidad**: Atributos ARIA y enfoque en elementos interactivos
4. **Optimización de rendimiento**: Lazy loading de componentes y páginas
5. **Manejo de errores**: Mensajes de error amigables y opciones de reintentar

## Contribución

1. Hacer un fork del proyecto
2. Crear una rama para la nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commit de los cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Hacer push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request
