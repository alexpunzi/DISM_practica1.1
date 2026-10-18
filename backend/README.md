# ⏱️ API Registro Horario — Práctica 1 DISM

Sistema de **registro horario** para gestionar los fichajes de los trabajadores de una organización y llevar el control de las horas y los trabajos realizados.

> Universidad de Alicante · Ingeniería Multimedia · **DISM** (Dispositivos e Infraestructura de Sistemas Multimedia) · Curso 2026-2027

---

## 📐 Arquitectura

```
┌──────────────┐      ┌───────────────┐
│  AppAdmin    │      │  AppUsuarios  │      Ionic + Angular
│  (Ionic)     │      │  (Ionic)      │
└──────┬───────┘      └───────┬───────┘
       │      HTTP / JSON     │
       └──────────┬───────────┘
                  ▼
        ┌───────────────────┐
        │  Servicios REST   │      Node.js + Express
        │  (OpenAPI 3)      │      http://localhost:8080/v1
        └─────────┬─────────┘
                  ▼
        ┌───────────────────┐
        │   MySQL (api_dism)│      XAMPP
        └───────────────────┘
```

Las dos apps comparten datos exclusivamente a través de los servicios REST. El backend se diseñó primero con **OpenAPI** y su esqueleto se generó con `openapi-generator` (`nodejs-express-server`), sobre el que se añadió la lógica de negocio.

## 📁 Estructura del repositorio

```
DISM_practica1.1/
├── AppAdmin/            # App Ionic de administración (usuarios, trabajos, fichajes)
├── backend/             # Servicios REST (Node.js + Express + OpenAPI)
│   ├── api/openapi.yaml #   contrato de la API
│   ├── services/        #   lógica de negocio y consultas SQL
│   ├── controllers/     #   controladores generados
│   └── utils/db.js      #   pool de conexión a MySQL
├── codigo.yaml          # Diseño OpenAPI de partida
└── openapitools.json    # Configuración del generador
```

## 🧰 Tecnologías

| Capa | Tecnologías |
|---|---|
| Frontend | Ionic 9, Angular 22 (componentes standalone), Ionicons, Leaflet |
| Backend | Node.js, Express, express-openapi-validator, swagger-ui-express, mysql2, winston |
| Base de datos | MySQL / MariaDB (XAMPP) |
| Diseño de API | OpenAPI 3 + openapi-generator |

## ✅ Requisitos previos

- [Node.js](https://nodejs.org/) y npm
- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL) o cualquier MySQL local
- Ionic CLI: `npm install -g @ionic/cli`

## 🚀 Puesta en marcha

### 1. Base de datos

Con MySQL arrancado, crea la base de datos `api_dism` desde phpMyAdmin o la consola:

```sql
CREATE DATABASE IF NOT EXISTS api_dism CHARACTER SET utf8mb4;
USE api_dism;

CREATE TABLE usuarios (
  IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
  Nombre    VARCHAR(100) NOT NULL,
  Usuario   VARCHAR(50),
  Clave     VARCHAR(50)
);

CREATE TABLE trabajos (
  IdTrabajo INT AUTO_INCREMENT PRIMARY KEY,
  Nombre    VARCHAR(200) NOT NULL
);

CREATE TABLE fichajes (
  IdFichaje              INT AUTO_INCREMENT PRIMARY KEY,
  FechaHoraEntrada       DATETIME,
  FechaHoraSalida        DATETIME,
  HorasTrabajadas        INT,
  IdTrabajo              INT,
  IdUsuario              INT,
  GeolocalizacionLatitud  FLOAT,
  GeolocalizacionLongitud FLOAT
);

CREATE TABLE apikey (
  idKey INT AUTO_INCREMENT PRIMARY KEY,
  `Key` VARCHAR(50) NOT NULL
);
```

La conexión se configura en `backend/utils/db.js` (por defecto `localhost`, usuario `root`, sin contraseña, base `api_dism`). Si tu MySQL tiene clave, cámbiala ahí.

### 2. Backend

```bash
cd backend
npm install
npm start
```

- API: `http://localhost:8080/v1`
- Documentación interactiva (Swagger UI): `http://localhost:8080/api-docs`

### 3. AppAdmin

```bash
cd AppAdmin
npm install
ionic serve        # o: npm start
```

Se abre en `http://localhost:8100` (o `4200` con `ng serve`). La URL del backend está en `AppAdmin/src/app/services/api.ts`.

> ⚠️ Arranca **primero** MySQL y el backend; si no, el panel mostrará «Backend Desconectado».

## 🔌 Endpoints de la API

Base: `http://localhost:8080/v1`

| Recurso | Método | Ruta | Descripción |
|---|---|---|---|
| Usuarios | `GET` | `/usuarios` | Listar usuarios |
| | `POST` | `/usuarios` | Crear usuario |
| | `GET` | `/usuarios/{id}` | Obtener usuario |
| | `PUT` | `/usuarios/{id}` | Actualizar usuario |
| | `DELETE` | `/usuarios/{id}` | Borrar usuario |
| Trabajos | `GET` | `/trabajos` | Listar trabajos |
| | `POST` | `/trabajos` | Crear trabajo |
| | `GET` | `/trabajos/{id}` | Obtener trabajo |
| | `PUT` | `/trabajos/{id}` | Actualizar trabajo |
| | `DELETE` | `/trabajos/{id}` | Borrar trabajo |
| Fichajes | `GET` | `/fichajes?idUsuario=&fechaInicio=&fechaFin=` | Listar fichajes con filtros opcionales |
| | `POST` | `/fichajes` | Registrar entrada (con geolocalización) |
| | `PUT` | `/fichajes/{id}` | Cerrar fichaje (fecha-hora de salida) |
| | `GET` | `/fichajes/activo/{idUsuario}` | Fichaje abierto de un usuario |
| ApiKey | `GET` | `/apikey` | Consultar las claves existentes |

El contrato completo está en [`backend/api/openapi.yaml`](backend/api/openapi.yaml).

## 📱 AppAdmin

Panel de administración con menú lateral y página de inicio con métricas.

| Página | Funcionalidad |
|---|---|
| **Inicio** | Estado del backend, contadores (usuarios, trabajos, fichajes en curso) y accesos rápidos |
| **Gestión Usuarios** | Listado y CRUD de usuarios |
| **Gestión Trabajos** | Listado y CRUD de trabajos |
| **Gestión Fichajes** | Listado filtrable por usuario y rango de fechas, con mapa **Leaflet/OpenStreetMap** del punto donde se fichó |

### 🎨 Sistema de colores

Cada módulo tiene un color propio, usado de forma coherente en menú, tarjetas, barras, botones e iconos, y adaptado al **modo claro y oscuro** (sigue el tema del sistema):

| Módulo | Color |
|---|---|
| Usuarios | 🟣 Morado `#b597df` |
| Trabajos | 🟡 Ámbar `#f7d277` |
| Fichajes | 🟢 Verde azulado `#85d5cc` |

Los colores se definen una sola vez en [`AppAdmin/src/theme/variables.scss`](AppAdmin/src/theme/variables.scss) y se usan con `color="usuarios|trabajos|fichajes"` o las clases `text-*` / `bar-*`.

## 🗺️ Estado y hoja de ruta

- [x] Base de datos y servicios REST (Usuarios, Trabajos, Fichajes, ApiKey)
- [x] AppAdmin: gestión de usuarios, trabajos y fichajes con mapa
- [x] Tema coherente claro/oscuro
- [ ] **AppUsuarios**: registrar fichaje (entrada/salida con geolocalización) y consultar fichajes
- [ ] Login con validación contra la tabla de usuarios *(optativo)*
- [ ] Validación de peticiones mediante **ApiKey** *(optativo)*
- [ ] Versión **PWA** *(optativo)*

## 📦 Entrega

El proyecto se entrega en ZIP por UACloud **sin la carpeta `node_modules`**, junto con una memoria con los pasos de puesta en marcha.

| Entrega | Contenido |
|---|---|
| 1 | AppAdmin, BD, servicios web y aspectos básicos |
| 2 | AppUsuarios y aspectos básicos y optativos de ambas apps |

## 👤 Autor

**Alex Punzano Gil** — Ingeniería Multimedia, Universidad de Alicante