# Preca - Precalificación de Inquilinos

Sitio web oficial de **Preca** (Servicios Inmobiliarios Jucerama SA de CV), empresa líder en precalificación de inquilinos en México.

## Acerca del Proyecto

Este sitio web profesional ofrece información sobre los servicios especializados de precalificación de inquilinos, cursos de capacitación, y recursos para propietarios e inmobiliarias en todo México.

## Tecnologías Utilizadas

- **Vite** - Build tool y dev server
- **React 18** - Librería de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes de UI
- **Framer Motion** - Animaciones
- **React Router** - Navegación

## Requisitos Previos

- Node.js 16 o superior
- npm o bun

## Instalación

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# Navegar al directorio del proyecto
cd preca-website

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:8080`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Genera el build de producción
- `npm run build:dev` - Genera el build en modo desarrollo
- `npm run preview` - Previsualiza el build de producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

```
preca-website/
├── public/          # Archivos estáticos
│   └── courses/     # PDFs de cursos
├── src/
│   ├── components/  # Componentes React
│   │   ├── sections/  # Secciones de la página
│   │   └── ui/        # Componentes de UI reutilizables
│   ├── pages/       # Páginas de la aplicación
│   ├── hooks/       # React hooks personalizados
│   └── lib/         # Utilidades
└── ...
```

## Despliegue

### Build de Producción

```bash
npm run build
```

Los archivos optimizados se generarán en el directorio `dist/`.

### Opciones de Hosting

El sitio puede desplegarse en cualquier servicio de hosting estático:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Características

- ✅ Diseño responsive y moderno
- ✅ Modo claro/oscuro
- ✅ Optimizado para SEO
- ✅ Animaciones suaves
- ✅ Accesibilidad (a11y)
- ✅ Formulario de contacto
- ✅ Información de cursos descargables
- ✅ Sección de asesores

## Contacto

**Preca - Servicios Inmobiliarios Jucerama SA de CV**

- Email: contacto@preca.com.mx
- Sitio web: https://preca.com.mx
- Teléfono: +52 55 1234 5678

## Licencia

© 2024 Preca. Todos los derechos reservados.
