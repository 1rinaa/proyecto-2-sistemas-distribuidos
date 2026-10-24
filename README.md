# Proyecto 2 - Catálogo de Superdeportivos con MongoDB Atlas, Netlify Functions y Autenticación JWT

**Estudiante:** Irina Rivera Chavarría  
**Curso:** Sistemas Distribuidos — Licenciatura en Informática  
**Institución:** Universidad Nacional de Costa Rica (UNA)  
**Ciclo:** II Ciclo 2026  

---

## 🌐 Enlace del Proyecto Desplegado en Netlify

- **URL de Producción:** `https://tu-sitio-en-netlify.netlify.app` *(actualizar con tu enlace generado en Netlify)*

---

## 🏎️ Descripción del Proyecto

Este proyecto es la continuación y evolución del **Proyecto 1 (Catálogos Temáticos)**. Se migró la arquitectura anterior basada en Cloudflare Workers y SQLite/D1 hacia una arquitectura moderna orientada a la nube utilizando:

1. **MongoDB Atlas** como base de datos NoSQL documental alojada en la nube.
2. **Netlify Functions** como plataforma Serverless / FaaS para alojar el API REST.
3. **Autenticación robusta con JSON Web Tokens (JWT)** y hashing de contraseñas con **Bcrypt**.
4. **Frontend SPA en Vue.js** con interceptores automáticos de solicitudes, manejo de expiración de sesión (401) y renderizado condicional de operaciones administrativas.

---

## ⚙️ Variables de Entorno Requeridas

Para el funcionamiento del sistema en Netlify (o de manera local), se deben configurar las siguientes variables de entorno (en Netlify: **Site configuration > Environment variables**):

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `MONGODB_URI` | Cadena de conexión a MongoDB Atlas con acceso a la base de datos | `mongodb+srv://<usuario>:<password>@cluster0.neewsnt.mongodb.net/catalogo_autos?retryWrites=true&w=majority` |
| `JWT_SECRET` | Clave secreta para la firma y verificación de tokens JWT | `super_secreto_jwt_catalogo_autos_distribuidos_2026_key` |

> ⚠️ **Nota de Seguridad:** Siguiendo las directrices del curso, los archivos `.env` y las cadenas con credenciales reales no se incluyen en el repositorio ni en el paquete de entrega `.zip`. Se incluye el archivo de plantilla `.env.example`.

---

## 👤 Credenciales del Usuario Administrador de Prueba

El sistema incluye un usuario precargado en la colección `usuarios` de MongoDB Atlas para validar inmediatamente la autenticación y las operaciones protegidas:

- **Correo electrónico:** `admin@catalogo.com`
- **Contraseña:** `admin123`
- **Rol:** `admin`

También es posible crear nuevas cuentas en cualquier momento desde la pantalla de **Registro** (`/register`).

---

## 🛠️ Estructura del Proyecto

```text
Proyecto 2/
├── .env.example                     # Plantilla de variables de entorno
├── .gitignore                       # Ignora node_modules, .env y dist
├── netlify.toml                     # Configuración de compilación, funciones y redirecciones
├── package.json                     # Dependencias backend/serverless y scripts de migración
├── netlify/
│   └── functions/                   # Funciones Serverless (FaaS)
│       ├── auth.js                  # Registro, login y verificación de identidad
│       ├── autos.js                 # CRUD de autos con lookup relacional y protección JWT
│       ├── fabricantes.js           # CRUD de fabricantes protegido con JWT
│       ├── categorias.js            # CRUD de categorías protegido con JWT
│       └── utils/
│           ├── db.js                # Conexión persistente y en caché a MongoDB Atlas
│           ├── auth.js              # Firma y verificación de tokens Bearer JWT
│           └── response.js          # Encabezados CORS y helpers JSON
├── frontend/
│   └── catalogo-autos-frontend/     # Aplicación cliente Vue.js
│       ├── src/
│       │   ├── views/
│       │   │   ├── LoginView.vue    # Pantalla de inicio de sesión
│       │   │   ├── RegisterView.vue # Pantalla de registro de usuario
│       │   │   ├── AutosView.vue    # Catálogo principal con acciones condicionadas
│       │   │   ├── FabricantesView.vue
│       │   │   └── CategoriasView.vue
│       │   ├── store/index.js       # Vuex Store con manejo de sesión y token
│       │   └── main.js              # Interceptores de Axios para Bearer y 401
├── data/                            # Datos originales en CSV (conservados del Proyecto 1)
│   ├── autos.csv                    # 20 documentos con especificaciones e imágenes
│   ├── fabricantes.csv              # 17 documentos con logos y sitios web
│   └── categorias.csv               # 19 documentos de especificaciones de motor
└── scripts/
    ├── seed-mongodb.js              # Script de migración y población de MongoDB Atlas
    └── test-functions.js            # Pruebas automatizadas de funciones y JWT
```

---

## 🚀 Despliegue en Netlify

### Opción A: Despliegue desde Repositorio Git (GitHub / GitLab)
1. Subir el proyecto a tu repositorio de GitHub.
2. Iniciar sesión en [Netlify](https://app.netlify.com/) y seleccionar **Add new site > Import an existing project**.
3. Seleccionar el repositorio.
4. Netlify detectará automáticamente el archivo [netlify.toml](netlify.toml):
   - **Base directory:** `frontend/catalogo-autos-frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. En la sección **Environment variables**, agregar:
   - `MONGODB_URI`
   - `JWT_SECRET`
6. Hacer clic en **Deploy Site**.

---

## 🧪 Pruebas Locales del Sistema

1. **Instalar dependencias:**
   ```bash
   npm install
   cd frontend/catalogo-autos-frontend && npm install && cd ../..
   ```

2. **Cargar o resetear la base de datos MongoDB Atlas:**
   ```bash
   npm run seed
   ```

3. **Ejecutar suite de pruebas de Netlify Functions y JWT:**
   ```bash
   node scripts/test-functions.js
   ```

4. **Compilar el frontend:**
   ```bash
   npm run build
   ```
