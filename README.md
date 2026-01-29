# 🏥 Sistema de Gestión de Beneficiarios

Sistema web completo para la gestión de beneficiarios de programas sociales multi-país, desarrollado con React, TypeScript, ASP.NET Core y SQL Server.


## 🚀 Tecnologías Utilizadas

### Frontend
- ⚛️ React 19 + TypeScript
- 🎨 Tailwind CSS
- 📡 Axios para peticiones HTTP
- 🔥 React Hot Toast para notificaciones
- 🛣️ React Router DOM para navegación
- ⚡ Vite como build tool

### Backend
- 🔷 ASP.NET Core 10 Web API
- 💾 SQL Server 2025 Express
- 📦 Dapper para acceso a datos
- 🔧 Stored Procedures

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [.NET SDK 10.0](https://dotnet.microsoft.com/download)
- [SQL Server 2025 Express](https://www.microsoft.com/es-es/sql-server/sql-server-downloads)
- [SQL Server Management Studio (SSMS)](https://aka.ms/ssmsfullsetup)
- [Git](https://git-scm.com/)


## 📥 Instalación

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/TU_USUARIO/
cd proyecto 


### 2️⃣ Configurar la Base de Datos

1. Abrir **SQL Server Management Studio (SSMS)**
2. Conectarse a: `localhost\SQLEXPRESS`
3. Abrir el archivo `baseDeDatos.sql`
4. Ejecutar el script completo (F5)

Esto creará:
- ✅ Base de datos: `GestionBeneficiariosDB`
- ✅ Tablas: `DocumentoIdentidad` y `Beneficiario`
- ✅ 6 documentos de ejemplo (DNI, Pasaporte, etc.)
- ✅ 4 beneficiarios de ejemplo
- ✅ 7 Stored Procedures


### 3️⃣ Configurar el Backend
```bash
# Navegar a la carpeta del backend
cd backendWebApi

# Restaurar dependencias
dotnet restore

# Configurar connection string (si es necesario)
# Editar appsettings.json y ajustar:
# - Server (por defecto: localhost\SQLEXPRESS)
# - Password (si usas autenticación SQL)

# Ejecutar el backend
dotnet run


El backend del API estará disponible en:
- 🌐 HTTP: `http://localhost:5122`
- 📖 Swagger: `http://localhost:5122/swagger`



### 4️⃣ Configurar el Frontend
```bash
# Abrir NUEVA TERMINAL
# Navegar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```


El frontend estará disponible en:
- 🌐 `http://localhost:5173`



## 🎯 Uso del Sistema

### Acceso Principal

1. Abrir el navegador en: `http://localhost:5173`
2. Verás la lista de beneficiarios existentes


-----------------------------------

## 🐛 Solución de Problemas

### Error: No se puede conectar a SQL Server
```bash
# Verificar que SQL Server esté corriendo
# Abrir Services (services.msc)
# Buscar: SQL Server (SQLEXPRESS)
# Estado debe ser: Running
```

**Solución:**
- Editar `backendWebApi/appsettings.json`
- Ajustar el `ConnectionString` con tus credenciales


### Error: CORS bloqueado

**Solución:**
- Verificar que el backend esté corriendo en `http://localhost:5122`
- Verificar que `Program.cs` tenga `app.UseCors("AllowFrontend")`

### Error: Port already in use

**Frontend:**
```bash
# Cambiar puerto en vite.config.ts
server: { port: 3000 }
```

**Backend:**
```bash
# Cambiar puerto en launchSettings.json
"applicationUrl": "http://localhost:NUEVO_PUERTO"
```
