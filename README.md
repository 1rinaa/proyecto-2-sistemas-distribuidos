# Proyecto 2 - Catálogo de Superdeportivos con MongoDB Atlas, Netlify Functions y Autenticación JWT

**Estudiante:** Irina Rivera Chavarría  
**Curso:** Sistemas Distribuidos — Licenciatura en Informática  
**Institución:** Universidad Nacional de Costa Rica (UNA)  
**Ciclo:** II Ciclo 2026

---

## 🌐 Enlace del Proyecto Desplegado en Netlify

- **URL de Producción:** `https://catalogoautosdeportivos.netlify.app/autos`

---

## 🏎️ Descripción del Proyecto

Este proyecto es la continuación y evolución del **Proyecto 1 (Catálogos Temáticos)**. Se migró la arquitectura anterior basada en Cloudflare Workers y SQLite/D1 hacia una arquitectura moderna orientada a la nube utilizando:

1. **MongoDB Atlas** como base de datos NoSQL documental alojada en la nube.
2. **Netlify Functions** como plataforma Serverless / FaaS para alojar el API REST.
3. **Autenticación robusta con JSON Web Tokens (JWT)** y hashing de contraseñas con **Bcrypt**.
4. **Frontend SPA en Vue.js** con interceptores automáticos de solicitudes, manejo de expiración de sesión (401) y renderizado condicional de operaciones administrativas.

---

## 👤 Credenciales del Usuario Administrador de Prueba

El sistema incluye un usuario precargado en la colección `usuarios` de MongoDB Atlas para validar inmediatamente la autenticación y las operaciones protegidas:

- **Correo electrónico:** `admin@catalogo.com`
- **Contraseña:** `admin123`
- **Rol:** `admin`

También es posible crear nuevas cuentas en cualquier momento desde la pantalla de **Registro** (`/register`).

---
