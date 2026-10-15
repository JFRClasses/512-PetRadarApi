# Pet Radar API

API REST para reportar y consultar **mascotas perdidas**, construida con **NestJS 11** sobre **Node 22 (alpine)**.

- Registro e inicio de sesión de usuarios con **JWT**.
- Alta y listado de mascotas perdidas con ubicación geográfica (**PostGIS**).
- Notificación por **correo electrónico** (Nodemailer) al registrar una mascota perdida.
- Caché con **Redis**.

> La imagen **no funciona sola**: necesita una base de datos **PostgreSQL con PostGIS** y un servidor **Redis**. La forma recomendada de levantarla es con **Docker Compose**.

---

## Inicio rápido

```bash
docker pull juanfr97/512-pet-radar-api:latest
```

### 1. Crea un archivo `.env`

```env
MAILER_SERVICE=gmail
MAILER_USER=tu-correo@gmail.com
MAILER_PASSWORD=tu-app-password
MAPBOX_TOKEN=tu-token-de-mapbox

DB_TYPE=postgres
DB_HOST=postgres
DB_PORT=5432
DB_NAME=petradar
DB_USER=postgres
DB_PASSWORD=postgres

REDIS_HOST=redis
REDIS_PORT=6379
```

> `DB_HOST` y `REDIS_HOST` deben coincidir con el **nombre del servicio** en el `compose.yaml` (`postgres` y `redis`).

### 2. Crea un archivo `compose.yaml`

```yaml
services:

  pet-radar-api:
    image: juanfr97/512-pet-radar-api:latest
    container_name: pet-radar-api
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgis/postgis:16-master
    container_name: pet-radar-db
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: pet-radar-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### 3. Levanta los servicios

```bash
docker compose up -d
```

### 4. Ejecuta las migraciones (solo la primera vez)

Las tablas no se crean automáticamente. Con los contenedores arriba, corre:

```bash
docker compose exec pet-radar-api npx typeorm migration:run -d dist/db/data-source.js
```

La API queda disponible en **http://localhost:3000**.

---

## Variables de entorno

Todas son **obligatorias**; si falta alguna, el contenedor no arranca.

| Variable          | Descripción                                         | Ejemplo              |
| ----------------- | --------------------------------------------------- | -------------------- |
| `MAILER_SERVICE`  | Servicio de correo de Nodemailer                    | `gmail`              |
| `MAILER_USER`     | Cuenta que envía los correos                        | `tu-correo@gmail.com`|
| `MAILER_PASSWORD` | Contraseña o *app password* de la cuenta            | `abcd efgh ijkl mnop`|
| `MAPBOX_TOKEN`    | Token de Mapbox para los mapas del correo           | `pk.eyJ1Ijo...`      |
| `DB_TYPE`         | Tipo de base de datos                               | `postgres`           |
| `DB_HOST`         | Host de PostgreSQL                                  | `postgres`           |
| `DB_PORT`         | Puerto de PostgreSQL                                | `5432`               |
| `DB_NAME`         | Nombre de la base de datos                          | `petradar`           |
| `DB_USER`         | Usuario de la base de datos                         | `postgres`           |
| `DB_PASSWORD`     | Contraseña de la base de datos                      | `postgres`           |
| `REDIS_HOST`      | Host de Redis                                       | `redis`              |
| `REDIS_PORT`      | Puerto de Redis                                     | `6379`               |

---

## Endpoints

| Método | Ruta             | Auth         | Descripción                          |
| ------ | ---------------- | ------------ | ------------------------------------ |
| GET    | `/`              | —            | Verificación de que la API responde  |
| POST   | `/auth/register` | —            | Registra un usuario y devuelve token |
| POST   | `/auth/login`    | —            | Inicia sesión y devuelve token       |
| GET    | `/lost-pets`     | Bearer token | Lista las mascotas perdidas          |
| POST   | `/lost-pets`     | Bearer token | Reporta una mascota perdida          |

### Ejemplos

**Registro**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "secreto123",
    "isPetAlertEnabled": true,
    "radius": 5,
    "lat": 21.8818,
    "lon": -102.2916
  }'
```

**Login**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "juan@example.com", "password": "secreto123" }'
```

**Reportar mascota perdida**

```bash
curl -X POST http://localhost:3000/lost-pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "type": "Perro",
    "name": "Firulais",
    "lat": 21.8818,
    "lon": -102.2916,
    "phone": "4491234567",
    "race": "Labrador",
    "age": 3,
    "color": "Café",
    "ownerName": "Juan Pérez"
  }'
```

---

## Comandos útiles

```bash
docker compose logs -f pet-radar-api
docker compose down
docker compose down -v
```

`down -v` elimina también los volúmenes (se pierden los datos de PostgreSQL y Redis).

---

## Detalles de la imagen

- **Base:** `node:22-alpine`
- **Puerto expuesto:** `3000`
- **Comando:** `node dist/main`
- **Tag:** `latest` (se publica automáticamente con GitHub Actions en cada push a `main`)
