# PetStore - React App

Aplicación React para una tienda de mascotas, construida con Vite, React Router y Tailwind CSS.

## 🚀 Stack Tecnológico

- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Tailwind CSS** - Estilos
- **Caddy** - Servidor web para producción

## 📦 Desarrollo Local

### Instalación

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

### Construir para producción

```bash
npm run build
```

### Preview de producción

```bash
npm run preview
```

## 🚢 Deployment

### Railway con Caddy

Este proyecto está configurado para desplegarse en Railway usando Caddy como servidor web.

**Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de deployment.**



## 📁 Estructura del Proyecto

```
src/
  ├── components/     # Componentes reutilizables
  │   └── ui/        # Componentes UI básicos
  ├── context/       # React Context (estado global)
  ├── pages/         # Páginas/Vistas de la aplicación
  └── assets/        # Recursos estáticos
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Preview del build de producción
- `npm run lint` - Ejecuta ESLint

## 📝 Notas

- El proyecto usa React 19 con las últimas características
- Tailwind CSS v4 configurado con Vite plugin
- React Router v7 para enrutamiento
- Optimizado para deployment en Railway con Caddy
