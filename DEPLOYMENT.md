# Deployment en Railway con Caddy

Este proyecto está configurado para ser desplegado en Railway usando Caddy como servidor web.

## 🚀 Configuración

### Archivos de Deployment

- **Dockerfile**: Construcción multi-etapa (build con Node.js, servidor con Caddy)
- **Caddyfile**: Configuración de Caddy para servir la SPA de React
- **railway.json**: Configuración específica de Railway
- **.dockerignore**: Archivos a excluir del build de Docker

## 📦 Pasos para Desplegar en Railway

### 1. Preparar el Proyecto

Asegúrate de que tu proyecto esté en un repositorio Git (GitHub, GitLab, etc.).

```bash
git add .
git commit -m "Add Caddy configuration for Railway deployment"
git push
```

### 2. Crear Proyecto en Railway

1. Ve a [Railway.app](https://railway.app/)
2. Inicia sesión con tu cuenta de GitHub
3. Haz clic en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Elige tu repositorio

### 3. Configuración Automática

Railway detectará automáticamente:
- El `Dockerfile` y construirá la imagen
- El `railway.json` para configuraciones adicionales
- Asignará automáticamente una variable `PORT` (Caddy la usará)

### 4. Variables de Entorno (Opcional)

Si necesitas agregar variables de entorno:
1. Ve a tu proyecto en Railway
2. Click en "Variables"
3. Agrega las variables necesarias (ej: API_URL, etc.)

**Nota:** La variable `PORT` es asignada automáticamente por Railway, no la configures manualmente.

## 🛠️ Desarrollo Local

### Ejecutar en desarrollo
```bash
npm run dev
```

### Construir para producción
```bash
npm run build
```

### Probar build localmente con Docker

```bash
# Construir la imagen
docker build -t petstore-app .

# Ejecutar el contenedor
docker run -p 3000:3000 petstore-app
```

Visita http://localhost:3000

## 🔧 Características de la Configuración

### Caddy

- ✅ HTTPS automático (Railway provee el certificado)
- ✅ Compresión Gzip/Zstd
- ✅ Headers de seguridad (HSTS, X-Frame-Options, etc.)
- ✅ SPA routing (redirección a index.html)
- ✅ Logs a stdout para Railway

### Docker Multi-Stage Build

- ✅ Imagen optimizada (solo archivos necesarios en producción)
- ✅ Etapa 1: Build con Node.js
- ✅ Etapa 2: Servidor ligero con Caddy
- ✅ Imagen final pequeña (~50MB)

## 📝 Notas Importantes

1. **SPA Routing**: El Caddyfile está configurado para manejar el routing de React Router correctamente
2. **Puerto Dinámico**: Railway asigna el puerto dinámicamente, Caddy lo lee de la variable `PORT`
3. **Health Checks**: Caddy responde automáticamente en la raíz `/`
4. **Logs**: Los logs de Caddy se envían a stdout para visualización en Railway

## 🐛 Troubleshooting

### El build falla en Railway
- Verifica que todos los archivos estén commiteados
- Revisa los logs de Railway en la pestaña "Deployments"

### La aplicación no carga
- Verifica que el build local funcione: `npm run build`
- Asegúrate de que `dist` se genera correctamente

### Errores 404 en rutas
- El Caddyfile ya está configurado con `try_files` para SPAs
- Verifica que las rutas en React Router estén correctas

## 📚 Recursos

- [Railway Documentation](https://docs.railway.app/)
- [Caddy Documentation](https://caddyserver.com/docs/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

