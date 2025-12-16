# API v2 Documentation - Sioma Dashboard

## Tabla de Contenidos

- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
  - [Autenticación](#endpoints-de-autenticación)
  - [Administración de Usuarios Admin](#administración-de-usuarios-admin)
  - [Administración de Dispositivos](#administración-de-dispositivos)
  - [Dispositivos](#dispositivos)
  - [Trabajadores (Workers)](#trabajadores-workers)
  - [Marcas de Tiempo (Timestamps)](#marcas-de-tiempo-timestamps)
  - [Sincronización de Asistencia](#sincronización-de-asistencia)
  - [Sincronización de Auditoría](#sincronización-de-auditoría)
  - [Sincronización de Métricas](#sincronización-de-métricas)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Error](#códigos-de-error)

---

## Información General

**Base URL:** `/api`

**Versión:** 2.0

**Formato de Datos:** JSON

**Codificación:** UTF-8

**Framework:** FastAPI

---

## Autenticación

La API utiliza dos tipos de autenticación basados en JWT (JSON Web Tokens):

### 1. Autenticación de Administradores

- **Tipo:** Bearer Token
- **Header:** `Authorization: Bearer <token>`
- **Obtención:** Endpoint `/api/admin/login`
- **Payload del Token:**
  ```json
  {
    "sub": "admin@example.com"
  }
  ```

### 2. Autenticación de Dispositivos

- **Tipo:** Bearer Token
- **Header:** `Authorization: Bearer <token>`
- **Obtención:** Endpoint `/api/devices/register`
- **Payload del Token:**
  ```json
  {
    "tenant_id": "ACME",
    "device_id": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```

### Headers Adicionales

- **X-Tenant-ID:** Requerido en endpoints multi-tenant para validar el tenant_id contra el token JWT

---

## Endpoints

### Endpoints de Autenticación

#### POST `/api/admin/login`

Autenticación de usuarios administradores.

**Autenticación:** No requerida

**Content-Type:** `application/x-www-form-urlencoded`

**Parámetros del Body:**

| Campo      | Tipo   | Requerido | Descripción                         |
|------------|--------|-----------|-------------------------------------|
| username   | string | Sí        | Email del administrador             |
| password   | string | Sí        | Contraseña del administrador        |

**Respuesta Exitosa (200 OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Respuestas de Error:**

| Código | Descripción                                    |
|--------|------------------------------------------------|
| 401    | Credenciales incorrectas                       |
| 400    | Usuario inactivo                               |

**Ejemplo de Uso:**

```bash
curl -X POST "http://localhost:8000/api/admin/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=securepassword"
```

---

### Administración de Usuarios Admin

#### POST `/api/admin/users`

Crea un nuevo usuario administrador.

**Autenticación:** Bearer Token (Admin)

**Request Body:**

```json
{
  "email": "newadmin@example.com",
  "password": "securepassword123"
}
```

**Respuesta Exitosa (201 Created):**

```json
{
  "email": "newadmin@example.com",
  "hashed_password": "$2b$12$...",
  "is_active": true,
  "created_at": 1706140800000
}
```

**Respuestas de Error:**

| Código | Descripción                  |
|--------|------------------------------|
| 400    | Email ya registrado          |
| 401    | No autenticado               |

---

#### GET `/api/admin/users`

Obtiene la lista de todos los usuarios administradores.

**Autenticación:** Bearer Token (Admin)

**Respuesta Exitosa (200 OK):**

```json
[
  {
    "email": "admin@example.com",
    "hashed_password": "$2b$12$...",
    "is_active": true,
    "created_at": 1706140800000
  },
  {
    "email": "admin2@example.com",
    "hashed_password": "$2b$12$...",
    "is_active": false,
    "created_at": 1706140900000
  }
]
```

---

#### GET `/api/admin/users/{email}`

Obtiene un usuario administrador específico por email.

**Autenticación:** Bearer Token (Admin)

**Parámetros de Ruta:**

| Campo | Tipo   | Descripción             |
|-------|--------|-------------------------|
| email | string | Email del administrador |

**Respuesta Exitosa (200 OK):**

```json
{
  "email": "admin@example.com",
  "hashed_password": "$2b$12$...",
  "is_active": true,
  "created_at": 1706140800000
}
```

**Respuestas de Error:**

| Código | Descripción            |
|--------|------------------------|
| 404    | Usuario no encontrado  |

---

#### PUT `/api/admin/users/{email}`

Actualiza la información de un usuario administrador.

**Autenticación:** Bearer Token (Admin)

**Parámetros de Ruta:**

| Campo | Tipo   | Descripción             |
|-------|--------|-------------------------|
| email | string | Email del administrador |

**Request Body:**

```json
{
  "is_active": false
}
```

**Respuesta Exitosa (200 OK):**

```json
{
  "email": "admin@example.com",
  "hashed_password": "$2b$12$...",
  "is_active": false,
  "created_at": 1706140800000
}
```

**Respuestas de Error:**

| Código | Descripción            |
|--------|------------------------|
| 404    | Usuario no encontrado  |

---

#### DELETE `/api/admin/users/{email}`

Elimina un usuario administrador.

**Autenticación:** Bearer Token (Admin)

**Parámetros de Ruta:**

| Campo | Tipo   | Descripción             |
|-------|--------|-------------------------|
| email | string | Email del administrador |

**Respuesta Exitosa (204 No Content):**

Sin contenido.

**Respuestas de Error:**

| Código | Descripción            |
|--------|------------------------|
| 404    | Usuario no encontrado  |

---

### Administración de Dispositivos

#### POST `/api/admin/activation-codes`

Crea un nuevo código de activación para dispositivos.

**Autenticación:** Bearer Token (Admin)

**Request Body:**

```json
{
  "code": "ACME-ABC123",
  "description": "Tablet para entrada principal - Acme Corp",
  "expires_at": 1706227200000
}
```

**Campos del Request:**

| Campo       | Tipo    | Requerido | Descripción                                          |
|-------------|---------|-----------|------------------------------------------------------|
| code        | string  | Sí        | Código de activación en formato "TENANT-CODE"        |
| description | string  | Sí        | Descripción del código de activación                 |
| expires_at  | integer | No        | Timestamp en milisegundos de expiración (opcional)   |

**Respuesta Exitosa (201 Created):**

```json
{
  "code": "ACME-ABC123",
  "tenant_id": "ACME",
  "status": "pending",
  "created_at": 1706140800000,
  "expires_at": 1706227200000,
  "description": "Tablet para entrada principal - Acme Corp"
}
```

**Respuestas de Error:**

| Código | Descripción                                           |
|--------|-------------------------------------------------------|
| 422    | Formato de código inválido (debe ser "TENANT-CODE")   |
| 401    | No autenticado                                        |

---

#### GET `/api/admin/devices`

Lista todos los dispositivos registrados de un tenant.

**Autenticación:** Bearer Token (Admin)

**Headers Requeridos:**

| Header       | Tipo   | Descripción                 |
|--------------|--------|-----------------------------|
| X-Tenant-ID  | string | ID del tenant               |

**Respuesta Exitosa (200 OK):**

```json
{
  "devices": [
    {
      "device_id": "550e8400-e29b-41d4-a716-446655440000",
      "device_name": "Tablet Entrada Principal",
      "device_model": "Samsung Galaxy Tab A7",
      "registered_at": 1706140800000,
      "last_sync_at": 1706227200000,
      "is_active": true,
      "pending_records": 0
    }
  ]
}
```

**Respuestas de Error:**

| Código | Descripción                         |
|--------|-------------------------------------|
| 400    | Header X-Tenant-ID no proporcionado |
| 401    | No autenticado                      |

---

#### PUT `/api/admin/devices/{device_id}/deactivate`

Desactiva un dispositivo específico.

**Autenticación:** Bearer Token (Admin)

**Parámetros de Ruta:**

| Campo     | Tipo   | Descripción        |
|-----------|--------|--------------------|
| device_id | string | ID del dispositivo |

**Headers Requeridos:**

| Header       | Tipo   | Descripción                 |
|--------------|--------|-----------------------------|
| X-Tenant-ID  | string | ID del tenant               |

**Request Body:**

```json
{
  "reason": "Dispositivo extraviado"
}
```

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Dispositivo desactivado correctamente"
}
```

**Respuestas de Error:**

| Código | Descripción                                  |
|--------|----------------------------------------------|
| 400    | Header X-Tenant-ID no proporcionado          |
| 404    | Dispositivo no encontrado o ya desactivado   |
| 500    | Error al desactivar dispositivo              |

---

### Dispositivos

#### POST `/api/devices/register`

Registra un nuevo dispositivo usando un código de activación.

**Autenticación:** No requerida

**Request Body:**

```json
{
  "activation_code": "ACME-ABC123",
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_name": "Tablet Entrada Principal",
  "device_model": "Samsung Galaxy Tab A7",
  "device_manufacturer": "Samsung",
  "android_version": "13"
}
```

**Campos del Request:**

| Campo                | Tipo   | Requerido | Descripción                      |
|----------------------|--------|-----------|----------------------------------|
| activation_code      | string | Sí        | Código de activación válido      |
| device_id            | string | Sí        | UUID del dispositivo             |
| device_name          | string | Sí        | Nombre del dispositivo           |
| device_model         | string | Sí        | Modelo del dispositivo           |
| device_manufacturer  | string | Sí        | Fabricante del dispositivo       |
| android_version      | string | Sí        | Versión de Android               |

**Respuesta Exitosa (201 Created):**

```json
{
  "success": true,
  "data": {
    "device_id": "550e8400-e29b-41d4-a716-446655440000",
    "tenant_id": "ACME",
    "device_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_expires_at": null,
    "is_active": true,
    "registered_at": 1706140800000
  }
}
```

**Respuestas de Error:**

| Código | Descripción                                             |
|--------|---------------------------------------------------------|
| 400    | Código de activación inválido, usado o expirado        |
| 409    | Dispositivo ya registrado                               |
| 422    | Formato de activation_code inválido                     |

**Notas:**
- El token de dispositivo no tiene expiración por defecto (`token_expires_at: null`)
- El código de activación se marca como "usado" después del registro
- El `tenant_id` se extrae del `activation_code` (formato: "TENANT-CODE")

---

#### GET `/api/devices/status`

Obtiene el estado del dispositivo autenticado.

**Autenticación:** Bearer Token (Device)

**Respuesta Exitosa (200 OK):**

```json
{
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_name": "Tablet Entrada Principal",
  "is_active": true,
  "last_sync_at": 1706227200000,
  "pending_records": 0
}
```

**Respuestas de Error:**

| Código | Descripción                |
|--------|----------------------------|
| 404    | Dispositivo no encontrado  |
| 403    | Dispositivo desactivado    |
| 401    | No autenticado             |

**Notas:**
- El campo `pending_records` es un placeholder (siempre retorna 0)

---

#### GET `/api/devices`

Obtiene la lista de todos los dispositivos registrados.

**Autenticación:** No requerida

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "device_id": "550e8400-e29b-41d4-a716-446655440000",
      "device_name": "Tablet Entrada Principal",
      "device_model": "Samsung Galaxy Tab A7",
      "device_manufacturer": "Samsung",
      "android_version": "13",
      "is_active": true,
      "registered_at": 1706140800000,
      "last_sync_at": 1706227200000,
      "tenant_id": "ACME"
    }
  ]
}
```

**Respuestas de Error:**

| Código | Descripción                     |
|--------|---------------------------------|
| 500    | Error al obtener dispositivos   |

---

### Trabajadores (Workers)

#### POST `/api/workers`

Registra un nuevo trabajador con 7 imágenes faciales.

**Autenticación:** No requerida

**Content-Type:** `multipart/form-data`

**Campos del Form:**

| Campo              | Tipo   | Requerido | Descripción                                    |
|--------------------|--------|-----------|------------------------------------------------|
| personal_data_json | string | Sí        | JSON con datos personales del trabajador       |
| images             | file[] | Sí        | Exactamente 7 imágenes faciales                |

**Estructura de personal_data_json:**

```json
{
  "id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "document_id": "12345678",
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@example.com"
}
```

**Campos de personal_data:**

| Campo       | Tipo   | Requerido | Descripción                                      |
|-------------|--------|-----------|--------------------------------------------------|
| id          | string | No        | ID del trabajador (generado automáticamente)     |
| document_id | string | Sí        | Número de documento de identidad                 |
| first_name  | string | Sí        | Nombre del trabajador                            |
| last_name   | string | Sí        | Apellido del trabajador                          |
| email       | string | Sí        | Email válido del trabajador                      |

**Respuesta Exitosa (201 Created):**

```json
{
  "id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "document_id": "12345678",
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@example.com",
  "image_urls": [
    "https://s3.amazonaws.com/bucket/worker-550e8400.../image-0.jpg",
    "https://s3.amazonaws.com/bucket/worker-550e8400.../image-1.jpg",
    "https://s3.amazonaws.com/bucket/worker-550e8400.../image-2.jpg",
    "https://s3.amazonaws.com/bucket/worker-550e8400.../image-3.jpg",
    "https://s3.amazonaws.com/bucket/worker-550e8400.../image-4.jpg",
    "https://s3.amazonaws.com/bucket/worker-550e8400.../image-5.jpg",
    "https://s3.amazonaws.com/bucket/worker-550e8400.../image-6.jpg"
  ],
  "created_at": "2024-01-25T12:00:00"
}
```

**Respuestas de Error:**

| Código | Descripción                                |
|--------|--------------------------------------------|
| 400    | Formato JSON inválido o no son 7 imágenes  |
| 500    | Error al subir imágenes o guardar datos    |

**Ejemplo de Uso:**

```bash
curl -X POST "http://localhost:8000/api/workers" \
  -F "personal_data_json={\"document_id\":\"12345678\",\"first_name\":\"Juan\",\"last_name\":\"Pérez\",\"email\":\"juan.perez@example.com\"}" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "images=@image3.jpg" \
  -F "images=@image4.jpg" \
  -F "images=@image5.jpg" \
  -F "images=@image6.jpg" \
  -F "images=@image7.jpg"
```

**Notas:**
- Las imágenes se suben a S3 antes de guardar el registro
- El timestamp `created_at` está en formato ISO 8601
- Si falla el guardado en DynamoDB, las imágenes en S3 no se eliminan automáticamente (TODO)

---

#### GET `/api/workers`

Obtiene la lista de todos los trabajadores registrados.

**Autenticación:** No requerida

**Respuesta Exitosa (200 OK):**

```json
[
  {
    "id": "worker-550e8400-e29b-41d4-a716-446655440000",
    "document_id": "12345678",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan.perez@example.com",
    "image_urls": [
      "https://s3.amazonaws.com/bucket/worker-550e8400.../image-0.jpg",
      "..."
    ],
    "created_at": "2024-01-25T12:00:00"
  }
]
```

**Respuestas de Error:**

| Código | Descripción                      |
|--------|----------------------------------|
| 500    | Error al obtener trabajadores    |

---

#### GET `/api/workers/{worker_id}`

Obtiene un trabajador específico por su ID.

**Autenticación:** No requerida

**Parámetros de Ruta:**

| Campo     | Tipo   | Descripción          |
|-----------|--------|----------------------|
| worker_id | string | ID del trabajador    |

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "document_id": "12345678",
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@example.com",
  "image_urls": [
    "https://s3.amazonaws.com/bucket/worker-550e8400.../image-0.jpg",
    "..."
  ],
  "created_at": "2024-01-25T12:00:00"
}
```

**Respuestas de Error:**

| Código | Descripción                  |
|--------|------------------------------|
| 404    | Trabajador no encontrado     |
| 500    | Error al obtener trabajador  |

---

#### PUT `/api/workers/{worker_id}`

Actualiza la información de un trabajador.

**Autenticación:** No requerida

**Parámetros de Ruta:**

| Campo     | Tipo   | Descripción          |
|-----------|--------|----------------------|
| worker_id | string | ID del trabajador    |

**Request Body:**

```json
{
  "first_name": "Juan Carlos",
  "last_name": "Pérez García",
  "email": "juancarlos.perez@example.com"
}
```

**Campos del Request (todos opcionales):**

| Campo      | Tipo   | Descripción                  |
|------------|--------|------------------------------|
| first_name | string | Nuevo nombre del trabajador  |
| last_name  | string | Nuevo apellido               |
| email      | string | Nuevo email                  |

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "document_id": "12345678",
  "first_name": "Juan Carlos",
  "last_name": "Pérez García",
  "email": "juancarlos.perez@example.com",
  "image_urls": [
    "..."
  ],
  "created_at": "2024-01-25T12:00:00"
}
```

**Respuestas de Error:**

| Código | Descripción                       |
|--------|-----------------------------------|
| 400    | No se proporcionó datos a cambiar |
| 404    | Trabajador no encontrado          |
| 500    | Error al actualizar trabajador    |

---

#### DELETE `/api/workers/{worker_id}`

Elimina un trabajador.

**Autenticación:** No requerida

**Parámetros de Ruta:**

| Campo     | Tipo   | Descripción          |
|-----------|--------|----------------------|
| worker_id | string | ID del trabajador    |

**Respuesta Exitosa (204 No Content):**

Sin contenido.

**Respuestas de Error:**

| Código | Descripción                  |
|--------|------------------------------|
| 404    | Trabajador no encontrado     |
| 500    | Error al eliminar trabajador |

---

### Marcas de Tiempo (Timestamps)

#### POST `/api/timestamps`

Registra una nueva marca de tiempo (entrada/salida) para un trabajador.

**Autenticación:** No requerida

**Request Body:**

```json
{
  "worker_id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "event_type": "entry"
}
```

**Campos del Request:**

| Campo      | Tipo   | Requerido | Descripción                     |
|------------|--------|-----------|---------------------------------|
| worker_id  | string | Sí        | ID del trabajador               |
| event_type | string | Sí        | Tipo de evento: "entry" o "exit"|

**Respuesta Exitosa (201 Created):**

```json
{
  "id": "log-550e8400-e29b-41d4-a716-446655440000",
  "worker_id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-25T12:00:00",
  "event_type": "entry"
}
```

**Respuestas de Error:**

| Código | Descripción                         |
|--------|-------------------------------------|
| 500    | Error al registrar marca de tiempo  |

**Notas:**
- El timestamp se genera automáticamente con la hora UTC actual
- El ID se genera automáticamente en formato "log-{uuid}"

---

#### GET `/api/timestamps`

Obtiene una lista de marcas de tiempo, opcionalmente filtrada por worker_id.

**Autenticación:** No requerida

**Parámetros de Query:**

| Campo     | Tipo   | Requerido | Descripción                            |
|-----------|--------|-----------|----------------------------------------|
| worker_id | string | No        | Filtrar por ID de trabajador específico|

**Respuesta Exitosa (200 OK):**

```json
[
  {
    "id": "log-550e8400-e29b-41d4-a716-446655440000",
    "worker_id": "worker-550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-25T12:00:00",
    "event_type": "entry"
  },
  {
    "id": "log-660e8400-e29b-41d4-a716-446655440000",
    "worker_id": "worker-550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-25T18:00:00",
    "event_type": "exit"
  }
]
```

**Respuestas de Error:**

| Código | Descripción                                |
|--------|--------------------------------------------|
| 501    | GSI no existe (error de infraestructura)   |
| 500    | Error al obtener marcas de tiempo          |

**Ejemplo de Uso:**

```bash
# Obtener todas las marcas de tiempo
curl "http://localhost:8000/api/timestamps"

# Filtrar por worker_id
curl "http://localhost:8000/api/timestamps?worker_id=worker-550e8400-e29b-41d4-a716-446655440000"
```

---

#### GET `/api/timestamps/{timestamp_id}`

Obtiene una marca de tiempo específica por su ID.

**Autenticación:** No requerida

**Parámetros de Ruta:**

| Campo        | Tipo   | Descripción                |
|--------------|--------|----------------------------|
| timestamp_id | string | ID de la marca de tiempo   |

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "log-550e8400-e29b-41d4-a716-446655440000",
  "worker_id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-25T12:00:00",
  "event_type": "entry"
}
```

**Respuestas de Error:**

| Código | Descripción                      |
|--------|----------------------------------|
| 404    | Marca de tiempo no encontrada    |
| 500    | Error al obtener marca de tiempo |

---

#### PUT `/api/timestamps/{timestamp_id}`

Actualiza una marca de tiempo.

**Autenticación:** No requerida

**Parámetros de Ruta:**

| Campo        | Tipo   | Descripción                |
|--------------|--------|----------------------------|
| timestamp_id | string | ID de la marca de tiempo   |

**Request Body:**

```json
{
  "event_type": "exit"
}
```

**Campos del Request:**

| Campo      | Tipo   | Requerido | Descripción                        |
|------------|--------|-----------|-------------------------------------|
| event_type | string | No        | Nuevo tipo de evento: "entry" o "exit"|

**Respuesta Exitosa (200 OK):**

```json
{
  "id": "log-550e8400-e29b-41d4-a716-446655440000",
  "worker_id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-25T12:00:00",
  "event_type": "exit"
}
```

**Respuestas de Error:**

| Código | Descripción                           |
|--------|---------------------------------------|
| 400    | No se proporcionó datos a cambiar     |
| 404    | Marca de tiempo no encontrada         |
| 500    | Error al actualizar marca de tiempo   |

---

#### DELETE `/api/timestamps/{timestamp_id}`

Elimina una marca de tiempo.

**Autenticación:** No requerida

**Parámetros de Ruta:**

| Campo        | Tipo   | Descripción                |
|--------------|--------|----------------------------|
| timestamp_id | string | ID de la marca de tiempo   |

**Respuesta Exitosa (204 No Content):**

Sin contenido.

**Respuestas de Error:**

| Código | Descripción                      |
|--------|----------------------------------|
| 404    | Marca de tiempo no encontrada    |
| 500    | Error al eliminar marca de tiempo|

---

### Sincronización de Asistencia

#### POST `/api/attendance/sync`

Sincroniza registros de asistencia desde dispositivos al servidor.

**Autenticación:** Bearer Token (Device)

**Headers Requeridos:**

| Header       | Tipo   | Descripción                 |
|--------------|--------|-----------------------------|
| X-Tenant-ID  | string | ID del tenant               |

**Request Body:**

```json
{
  "records": [
    {
      "local_id": 1,
      "employee_id": "EMP001",
      "type": "ENTRY",
      "timestamp": 1706140800000,
      "confidence": 0.95,
      "liveness_passed": true,
      "device_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": 1706140800000
    },
    {
      "local_id": 2,
      "employee_id": "EMP002",
      "type": "EXIT",
      "timestamp": 1706144400000,
      "confidence": 0.98,
      "liveness_passed": true,
      "device_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": 1706144400000
    }
  ]
}
```

**Campos del Request:**

| Campo            | Tipo    | Requerido | Descripción                                  |
|------------------|---------|-----------|----------------------------------------------|
| records          | array   | Sí        | Lista de registros a sincronizar (máx 100)   |
| local_id         | integer | Sí        | ID local del registro en el dispositivo      |
| employee_id      | string  | Sí        | ID del empleado                              |
| type             | string  | Sí        | Tipo de registro: "ENTRY" o "EXIT"           |
| timestamp        | integer | Sí        | Timestamp del registro en milisegundos       |
| confidence       | float   | Sí        | Nivel de confianza del reconocimiento facial |
| liveness_passed  | boolean | Sí        | Si pasó la prueba de vivacidad               |
| device_id        | string  | Sí        | ID del dispositivo                           |
| created_at       | integer | Sí        | Timestamp de creación en milisegundos        |

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "synced_count": 1,
  "synced_records": [
    {
      "local_id": 1,
      "server_id": "550e8400-e29b-41d4-a716-446655440000",
      "synced_at": 1706140900000
    }
  ],
  "conflicts": [
    {
      "local_id": 2,
      "reason": "DUPLICATE_TIMESTAMP",
      "message": "An existing record for this employee is too close to this timestamp.",
      "existing_record": {
        "record_id": "660e8400-e29b-41d4-a716-446655440000",
        "employee_id": "EMP002",
        "timestamp": 1706144400000
      }
    }
  ],
  "errors": []
}
```

**Campos de la Respuesta:**

| Campo          | Tipo    | Descripción                                         |
|----------------|---------|-----------------------------------------------------|
| success        | boolean | Siempre true                                        |
| synced_count   | integer | Cantidad de registros sincronizados exitosamente    |
| synced_records | array   | Lista de registros sincronizados                    |
| conflicts      | array   | Lista de registros con conflictos                   |
| errors         | array   | Lista de registros con errores                      |

**Respuestas de Error:**

| Código | Descripción                                               |
|--------|-----------------------------------------------------------|
| 400    | Header X-Tenant-ID no proporcionado                       |
| 403    | Tenant ID en token no coincide con X-Tenant-ID header     |
| 413    | Payload demasiado grande (máximo 100 registros)           |
| 401    | No autenticado                                            |

**Tipos de Conflictos:**

- **DUPLICATE_TIMESTAMP:** Ya existe un registro muy cercano en el tiempo para ese empleado

**Tipos de Errores:**

- **DEVICE_ID_MISMATCH:** El device_id en el registro no coincide con el dispositivo autenticado
- **SERVER_ERROR:** Error del servidor al procesar el registro

**Notas:**
- Los registros se procesan individualmente
- Si un registro tiene error, no afecta a los demás
- Los duplicados se detectan buscando registros con timestamps cercanos (mismo empleado)
- Se valida que el tenant_id del token coincida con el header X-Tenant-ID
- Se valida que cada registro provenga del dispositivo autenticado

---

### Sincronización de Auditoría

#### POST `/api/audit/sync`

Sincroniza registros de auditoría desde dispositivos al servidor.

**Autenticación:** Bearer Token (Device)

**Request Body:**

```json
{
  "audits": [
    {
      "local_id": 1,
      "attendance_id": "550e8400-e29b-41d4-a716-446655440000",
      "action": "MANUAL_CORRECTION",
      "employee_id_detected": "EMP001",
      "employee_id_actual": "EMP002",
      "performed_by_user_id": "admin@example.com",
      "reason": "Reconocimiento facial incorrecto",
      "metadata": "{\"confidence\": 0.45}",
      "timestamp": 1706140800000
    },
    {
      "local_id": 2,
      "attendance_id": null,
      "action": "DEVICE_REBOOT",
      "employee_id_detected": null,
      "employee_id_actual": null,
      "performed_by_user_id": null,
      "reason": null,
      "metadata": "{\"reason\": \"system_update\"}",
      "timestamp": 1706144400000
    }
  ]
}
```

**Campos del Request:**

| Campo                 | Tipo    | Requerido | Descripción                                   |
|-----------------------|---------|-----------|-----------------------------------------------|
| audits                | array   | Sí        | Lista de registros de auditoría               |
| local_id              | integer | Sí        | ID local del registro en el dispositivo       |
| attendance_id         | string  | No        | ID de asistencia relacionada (puede ser null) |
| action                | string  | Sí        | Acción de auditoría                           |
| employee_id_detected  | string  | No        | ID del empleado detectado (puede ser null)    |
| employee_id_actual    | string  | No        | ID del empleado real (puede ser null)         |
| performed_by_user_id  | string  | No        | ID del usuario que realizó la acción          |
| reason                | string  | No        | Razón de la acción                            |
| metadata              | string  | No        | Metadatos en formato JSON string              |
| timestamp             | integer | Sí        | Timestamp en milisegundos                     |

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "synced_count": 2,
  "synced_audits": [
    {
      "local_id": 1,
      "server_id": "660e8400-e29b-41d4-a716-446655440000",
      "synced_at": 1706140900000
    },
    {
      "local_id": 2,
      "server_id": "770e8400-e29b-41d4-a716-446655440000",
      "synced_at": 1706140900000
    }
  ]
}
```

**Campos de la Respuesta:**

| Campo         | Tipo    | Descripción                                      |
|---------------|---------|--------------------------------------------------|
| success       | boolean | Siempre true                                     |
| synced_count  | integer | Cantidad de auditorías sincronizadas             |
| synced_audits | array   | Lista de auditorías sincronizadas con server_id  |

**Respuestas de Error:**

| Código | Descripción       |
|--------|-------------------|
| 401    | No autenticado    |

**Notas:**
- Los registros de auditoría pueden o no estar relacionados con un registro de asistencia
- Cuando `attendance_id` es null, se usa el `audit_id` generado para construir la clave primaria
- El `tenant_id` y `device_id` se extraen del token JWT automáticamente
- Todos los registros se procesan en lote

---

### Sincronización de Métricas

#### POST `/api/attendance/metrics/sync`

Sincroniza métricas detalladas de reconocimiento facial desde dispositivos al servidor para análisis y evaluación del modelo.

**Autenticación:** Bearer Token (Device)

**Request Body:**

```json
{
  "metrics": [
    {
      "local_id": 1,
      "attendance_record_id": "550e8400-e29b-41d4-a716-446655440000",
      "employee_id": "worker-123",
      "employee_id_number": "EMP001",
      "timestamp": 1706140800000,
      "recognition_successful": true,
      "rejected_by_user": false,
      "overall_quality": 0.95,
      "blur_score": 0.88,
      "brightness_score": 0.92,
      "confidence": 0.94,
      "euclidean_distance": 0.15,
      "embedding_index": 3,
      "processing_time_ms": 245,
      "face_size_score": 0.85,
      "pose_score": 0.90,
      "head_euler_angle_x": 2.5,
      "head_euler_angle_y": -1.8,
      "head_euler_angle_z": 0.3,
      "used_faiss": true,
      "threshold_used": 0.88
    },
    {
      "local_id": 2,
      "attendance_record_id": null,
      "employee_id": null,
      "employee_id_number": null,
      "timestamp": 1706141000000,
      "recognition_successful": false,
      "rejected_by_user": true,
      "overall_quality": 0.82,
      "blur_score": 0.75,
      "brightness_score": 0.88,
      "confidence": null,
      "euclidean_distance": null,
      "embedding_index": null,
      "processing_time_ms": 189,
      "face_size_score": 0.78,
      "pose_score": 0.85,
      "head_euler_angle_x": -5.2,
      "head_euler_angle_y": 3.1,
      "head_euler_angle_z": -0.8,
      "used_faiss": true,
      "threshold_used": null
    }
  ]
}
```

**Campos del Request:**

| Campo                 | Tipo    | Requerido | Descripción                                          |
|-----------------------|---------|-----------|------------------------------------------------------|
| metrics               | array   | Sí        | Lista de métricas de reconocimiento                  |
| local_id              | integer | Sí        | ID local del registro en el dispositivo              |
| attendance_record_id  | string  | No        | ID de asistencia relacionada (null si fue rechazado) |
| employee_id           | string  | No        | ID del empleado reconocido (null si falló)           |
| employee_id_number    | string  | No        | Número de empleado (null si falló)                   |
| timestamp             | integer | Sí        | Timestamp en milisegundos                            |
| recognition_successful| boolean | Sí        | true = exitoso, false = rechazado                    |
| rejected_by_user      | boolean | Sí        | true si usuario presionó "No soy yo"                 |
| **Métricas de Calidad (Prioridad Alta)** |   |           |                                                      |
| overall_quality       | float   | Sí        | Score combinado de calidad (0.0-1.0)                 |
| blur_score            | float   | Sí        | Nitidez de la imagen (0.0-1.0)                       |
| brightness_score      | float   | Sí        | Calidad de iluminación (0.0-1.0)                     |
| confidence            | float   | No        | Similitud coseno (0.0-1.0), null si no hubo match    |
| euclidean_distance    | float   | No        | Distancia euclidiana, null si no hubo match          |
| embedding_index       | integer | No        | Índice del embedding que matcheó, null si no match   |
| processing_time_ms    | integer | Sí        | Tiempo total de procesamiento (milisegundos)         |
| **Métricas de Captura (Prioridad Media)** |  |           |                                                      |
| face_size_score       | float   | Sí        | Tamaño del rostro (0.0-1.0)                          |
| pose_score            | float   | Sí        | Calidad de la pose (0.0-1.0)                         |
| head_euler_angle_x    | float   | Sí        | Pitch: arriba/abajo (-90 a +90)                      |
| head_euler_angle_y    | float   | Sí        | Yaw: izquierda/derecha (-90 a +90)                   |
| head_euler_angle_z    | float   | Sí        | Roll: inclinación (-90 a +90)                        |
| used_faiss            | boolean | Sí        | true si usó FAISS, false si búsqueda lineal          |
| threshold_used        | float   | No        | Umbral usado para decisión, null si no hubo match    |

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "synced_count": 2,
  "synced_metrics": [
    {
      "local_id": 1,
      "server_id": "metrics-550e8400-e29b-41d4-a716-446655440000",
      "synced_at": 1706140900000
    },
    {
      "local_id": 2,
      "server_id": "metrics-660e8400-e29b-41d4-a716-446655440000",
      "synced_at": 1706140900000
    }
  ]
}
```

**Campos de la Respuesta:**

| Campo          | Tipo    | Descripción                                        |
|----------------|---------|----------------------------------------------------|
| success        | boolean | Siempre true                                       |
| synced_count   | integer | Cantidad de métricas sincronizadas                 |
| synced_metrics | array   | Lista de métricas sincronizadas con server_id      |

**Respuestas de Error:**

| Código | Descripción       |
|--------|-------------------|
| 401    | No autenticado    |
| 422    | Datos inválidos   |

**Estructura en DynamoDB:**

```
PK: tenant_id#device_id
SK: METRICS#{metrics_id}

Atributos:
- tenant_id: string
- device_id: string
- metrics_id: string (UUID)
- local_id: number
- attendance_record_id: string | null
- employee_id: string | null
- employee_id_number: string | null
- timestamp: number
- recognition_successful: boolean
- rejected_by_user: boolean
- metrics: {
    overall_quality: number,
    blur_score: number,
    brightness_score: number,
    confidence: number | null,
    euclidean_distance: number | null,
    embedding_index: number | null,
    processing_time_ms: number,
    face_size_score: number,
    pose_score: number,
    head_euler_angles: {
      x: number,
      y: number,
      z: number
    },
    used_faiss: boolean,
    threshold_used: number | null
  }
- synced_at: number
```

**GSI (Global Secondary Index) Recomendados:**

1. **EmployeeMetricsIndex:**
   - PK: `tenant_id#employee_id`
   - SK: `timestamp`
   - Uso: Consultar métricas por empleado ordenadas por tiempo

2. **RecognitionStatusIndex:**
   - PK: `tenant_id#recognition_successful`
   - SK: `timestamp`
   - Uso: Filtrar por éxito/rechazo de reconocimiento

3. **RejectionIndex:**
   - PK: `tenant_id#rejected_by_user`
   - SK: `timestamp`
   - Uso: Analizar rechazos de usuarios

**Notas:**
- Las métricas se registran tanto para reconocimientos exitosos como fallidos
- Cuando `rejected_by_user = true`, indica que el usuario presionó el botón "No soy yo"
- Cuando `recognition_successful = false`, los campos de match (confidence, euclidean_distance, etc.) son `null`
- El `tenant_id` y `device_id` se extraen del token JWT automáticamente
- Todos los registros se procesan en lote
- Las métricas permiten evaluar el comportamiento del modelo en producción y detectar patrones de error

**Casos de Uso:**
- Analizar precisión del modelo por empleado, hora del día, condiciones de luz, etc.
- Detectar empleados con problemas de reconocimiento recurrentes
- Identificar patrones en rechazos de usuarios
- Optimizar umbrales de confianza basados en datos reales
- Evaluar impacto de cambios en el preprocesamiento de imágenes
- Monitorear tiempos de procesamiento y performance

---

#### GET `/api/attendance/metrics`

Obtiene métricas de reconocimiento facial con filtros opcionales para análisis y evaluación del modelo.

**Autenticación:** Bearer Token (Admin)

**Headers Requeridos:**

| Header       | Tipo   | Descripción                 |
|--------------|--------|-----------------------------|
| X-Tenant-ID  | string | ID del tenant               |

**Parámetros de Query (todos opcionales):**

| Campo                  | Tipo    | Descripción                                              |
|------------------------|---------|----------------------------------------------------------|
| device_id              | string  | Filtrar por dispositivo específico                       |
| employee_id            | string  | Filtrar por empleado específico                          |
| recognition_successful | boolean | Filtrar por éxito/fallo del reconocimiento (true/false)  |
| rejected_by_user       | boolean | Filtrar por rechazo del usuario (true/false)             |
| start_timestamp        | integer | Timestamp de inicio en milisegundos                      |
| end_timestamp          | integer | Timestamp de fin en milisegundos                         |
| limit                  | integer | Máximo de registros a retornar (default: 100, máx: 1000) |

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "count": 2,
  "metrics": [
    {
      "metrics_id": "550e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "ACME",
      "device_id": "device-550e8400-e29b-41d4-a716-446655440000",
      "local_id": 1,
      "attendance_record_id": "attendance-550e8400-e29b-41d4-a716-446655440000",
      "employee_id": "worker-123",
      "employee_id_number": "EMP001",
      "timestamp": 1706140800000,
      "recognition_successful": true,
      "rejected_by_user": false,
      "metrics": {
        "overall_quality": 0.95,
        "blur_score": 0.88,
        "brightness_score": 0.92,
        "confidence": 0.94,
        "euclidean_distance": 0.15,
        "embedding_index": 3,
        "processing_time_ms": 245,
        "face_size_score": 0.85,
        "pose_score": 0.90,
        "head_euler_angles": {
          "x": 2.5,
          "y": -1.8,
          "z": 0.3
        },
        "used_faiss": true,
        "threshold_used": 0.88
      },
      "synced_at": 1706140900000
    },
    {
      "metrics_id": "660e8400-e29b-41d4-a716-446655440000",
      "tenant_id": "ACME",
      "device_id": "device-550e8400-e29b-41d4-a716-446655440000",
      "local_id": 2,
      "attendance_record_id": null,
      "employee_id": null,
      "employee_id_number": null,
      "timestamp": 1706141000000,
      "recognition_successful": false,
      "rejected_by_user": true,
      "metrics": {
        "overall_quality": 0.82,
        "blur_score": 0.75,
        "brightness_score": 0.88,
        "confidence": null,
        "euclidean_distance": null,
        "embedding_index": null,
        "processing_time_ms": 189,
        "face_size_score": 0.78,
        "pose_score": 0.85,
        "head_euler_angles": {
          "x": -5.2,
          "y": 3.1,
          "z": -0.8
        },
        "used_faiss": true,
        "threshold_used": null
      },
      "synced_at": 1706140900000
    }
  ]
}
```

**Campos de la Respuesta:**

| Campo          | Tipo    | Descripción                                        |
|----------------|---------|----------------------------------------------------|
| success        | boolean | Siempre true                                       |
| count          | integer | Cantidad de métricas retornadas                    |
| metrics        | array   | Lista de métricas con detalles completos           |

**Estructura de cada métrica:**

| Campo                 | Tipo    | Descripción                                          |
|-----------------------|---------|------------------------------------------------------|
| metrics_id            | string  | ID único de la métrica                               |
| tenant_id             | string  | ID del tenant                                        |
| device_id             | string  | ID del dispositivo                                   |
| local_id              | integer | ID local del registro en el dispositivo              |
| attendance_record_id  | string  | ID de asistencia relacionada (null si fue rechazado) |
| employee_id           | string  | ID del empleado reconocido (null si falló)           |
| employee_id_number    | string  | Número de empleado (null si falló)                   |
| timestamp             | integer | Timestamp en milisegundos                            |
| recognition_successful| boolean | true = exitoso, false = rechazado                    |
| rejected_by_user      | boolean | true si usuario presionó "No soy yo"                 |
| metrics               | object  | Objeto con métricas detalladas (ver abajo)           |
| synced_at             | integer | Timestamp de sincronización en milisegundos          |

**Estructura del objeto metrics:**

| Campo                 | Tipo    | Descripción                                          |
|-----------------------|---------|------------------------------------------------------|
| overall_quality       | float   | Score combinado de calidad (0.0-1.0)                 |
| blur_score            | float   | Nitidez de la imagen (0.0-1.0)                       |
| brightness_score      | float   | Calidad de iluminación (0.0-1.0)                     |
| confidence            | float   | Similitud coseno (0.0-1.0), null si no hubo match    |
| euclidean_distance    | float   | Distancia euclidiana, null si no hubo match          |
| embedding_index       | integer | Índice del embedding que matcheó, null si no match   |
| processing_time_ms    | integer | Tiempo total de procesamiento (milisegundos)         |
| face_size_score       | float   | Tamaño del rostro (0.0-1.0)                          |
| pose_score            | float   | Calidad de la pose (0.0-1.0)                         |
| head_euler_angles     | object  | Ángulos de la cabeza (x, y, z)                       |
| used_faiss            | boolean | true si usó FAISS, false si búsqueda lineal          |
| threshold_used        | float   | Umbral usado para decisión, null si no hubo match    |

**Respuestas de Error:**

| Código | Descripción                         |
|--------|-------------------------------------|
| 400    | Header X-Tenant-ID no proporcionado |
| 401    | No autenticado                      |
| 500    | Error al obtener métricas           |

**Ejemplo de Uso:**

```bash
# Obtener todas las métricas del tenant
curl -X GET "http://localhost:8000/api/attendance/metrics?limit=100" \
  -H "Authorization: Bearer {admin_token}" \
  -H "X-Tenant-ID: ACME"

# Filtrar por dispositivo específico
curl -X GET "http://localhost:8000/api/attendance/metrics?device_id=device-550e8400&limit=50" \
  -H "Authorization: Bearer {admin_token}" \
  -H "X-Tenant-ID: ACME"

# Filtrar por empleado específico
curl -X GET "http://localhost:8000/api/attendance/metrics?employee_id=worker-123" \
  -H "Authorization: Bearer {admin_token}" \
  -H "X-Tenant-ID: ACME"

# Solo reconocimientos fallidos
curl -X GET "http://localhost:8000/api/attendance/metrics?recognition_successful=false" \
  -H "Authorization: Bearer {admin_token}" \
  -H "X-Tenant-ID: ACME"

# Solo rechazos de usuarios
curl -X GET "http://localhost:8000/api/attendance/metrics?rejected_by_user=true" \
  -H "Authorization: Bearer {admin_token}" \
  -H "X-Tenant-ID: ACME"

# Rango de fechas
curl -X GET "http://localhost:8000/api/attendance/metrics?start_timestamp=1706140800000&end_timestamp=1706227200000" \
  -H "Authorization: Bearer {admin_token}" \
  -H "X-Tenant-ID: ACME"

# Combinación de filtros
curl -X GET "http://localhost:8000/api/attendance/metrics?employee_id=worker-123&recognition_successful=false&limit=50" \
  -H "Authorization: Bearer {admin_token}" \
  -H "X-Tenant-ID: ACME"
```

**Notas:**
- Requiere autenticación de administrador (no de dispositivo)
- El header `X-Tenant-ID` es obligatorio
- Si no se especifica `device_id` ni `employee_id`, retorna todas las métricas del tenant
- Los filtros `recognition_successful` y `rejected_by_user` se aplican en memoria después de la consulta
- Los filtros de timestamp se aplican según el método de consulta:
  - Por empleado: usa GSI con range key en timestamp (más eficiente)
  - Por dispositivo: filtra en memoria
  - Sin filtros: filtra en memoria durante el scan
- El límite máximo es 1000 registros por solicitud
- Los valores `Decimal` de DynamoDB se convierten automáticamente a `float` en la respuesta

**Casos de Uso:**
- Dashboard de administración para monitoreo de precisión del modelo
- Análisis de patrones de reconocimiento por empleado, dispositivo o período de tiempo
- Identificación de empleados con alta tasa de rechazo
- Evaluación de condiciones ambientales (iluminación, calidad de imagen)
- Optimización de umbrales basada en métricas históricas
- Auditoría de performance del sistema de reconocimiento facial

---

## Modelos de Datos

### AdminUser

```json
{
  "email": "admin@example.com",
  "hashed_password": "$2b$12$...",
  "is_active": true,
  "created_at": 1706140800000
}
```

### ActivationCode

```json
{
  "code": "ACME-ABC123",
  "tenant_id": "ACME",
  "status": "pending",
  "created_at": 1706140800000,
  "expires_at": 1706227200000,
  "description": "Tablet para entrada principal",
  "used_at": null,
  "used_by_device_id": null
}
```

**Estados posibles:**
- `pending`: Código disponible para uso
- `used`: Código ya utilizado

### Device

```json
{
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "ACME",
  "device_name": "Tablet Entrada Principal",
  "device_model": "Samsung Galaxy Tab A7",
  "device_manufacturer": "Samsung",
  "android_version": "13",
  "activation_code": "ACME-ABC123",
  "device_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "is_active": true,
  "registered_at": 1706140800000,
  "last_sync_at": 1706227200000,
  "deactivated_at": null,
  "deactivation_reason": null
}
```

### Worker

```json
{
  "id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "document_id": "12345678",
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@example.com",
  "image_urls": [
    "https://s3.amazonaws.com/bucket/worker-id/image-0.jpg",
    "https://s3.amazonaws.com/bucket/worker-id/image-1.jpg",
    "https://s3.amazonaws.com/bucket/worker-id/image-2.jpg",
    "https://s3.amazonaws.com/bucket/worker-id/image-3.jpg",
    "https://s3.amazonaws.com/bucket/worker-id/image-4.jpg",
    "https://s3.amazonaws.com/bucket/worker-id/image-5.jpg",
    "https://s3.amazonaws.com/bucket/worker-id/image-6.jpg"
  ],
  "created_at": "2024-01-25T12:00:00"
}
```

### TimeLog

```json
{
  "id": "log-550e8400-e29b-41d4-a716-446655440000",
  "worker_id": "worker-550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-25T12:00:00",
  "event_type": "entry"
}
```

**Tipos de evento:**
- `entry`: Entrada
- `exit`: Salida

### AttendanceRecord

```json
{
  "tenant_id#employee_id": "ACME#EMP001",
  "record_id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "ACME",
  "local_id": 1,
  "employee_id": "EMP001",
  "type": "ENTRY",
  "timestamp": 1706140800000,
  "confidence": 0.95,
  "liveness_passed": true,
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": 1706140800000,
  "synced_at": 1706140900000,
  "sync_status": "synced"
}
```

**Tipos de registro:**
- `ENTRY`: Entrada
- `EXIT`: Salida

**Estados de sincronización:**
- `synced`: Registro sincronizado exitosamente

### AuditRecord

```json
{
  "tenant_id#attendance_id": "ACME#550e8400-e29b-41d4-a716-446655440000",
  "audit_id": "660e8400-e29b-41d4-a716-446655440000",
  "tenant_id": "ACME",
  "device_id": "550e8400-e29b-41d4-a716-446655440000",
  "local_id": 1,
  "attendance_id": "550e8400-e29b-41d4-a716-446655440000",
  "action": "MANUAL_CORRECTION",
  "employee_id_detected": "EMP001",
  "employee_id_actual": "EMP002",
  "performed_by_user_id": "admin@example.com",
  "reason": "Reconocimiento facial incorrecto",
  "metadata": "{\"confidence\": 0.45}",
  "timestamp": 1706140800000,
  "synced_at": 1706140900000
}
```

**Acciones comunes:**
- `MANUAL_CORRECTION`: Corrección manual de asistencia
- `DEVICE_REBOOT`: Reinicio del dispositivo
- `ATTENDANCE_DELETED`: Eliminación de registro de asistencia
- `EMPLOYEE_OVERRIDE`: Sobrescritura de empleado detectado

---

## Códigos de Error

### Códigos HTTP Utilizados

| Código | Nombre                | Uso                                                      |
|--------|-----------------------|----------------------------------------------------------|
| 200    | OK                    | Operación exitosa                                        |
| 201    | Created               | Recurso creado exitosamente                              |
| 204    | No Content            | Eliminación exitosa                                      |
| 400    | Bad Request           | Request inválido o parámetros faltantes                  |
| 401    | Unauthorized          | No autenticado o credenciales inválidas                  |
| 403    | Forbidden             | Autenticado pero sin permisos o dispositivo desactivado  |
| 404    | Not Found             | Recurso no encontrado                                    |
| 409    | Conflict              | Conflicto con estado actual (ej. dispositivo duplicado)  |
| 413    | Payload Too Large     | Payload excede límites (ej. más de 100 registros)        |
| 422    | Unprocessable Entity  | Formato de datos inválido                                |
| 500    | Internal Server Error | Error del servidor                                       |
| 501    | Not Implemented       | Funcionalidad no implementada (ej. GSI faltante)         |

### Estructura de Respuestas de Error

Todas las respuestas de error incluyen un campo `detail` con información descriptiva:

```json
{
  "detail": "Descripción del error"
}
```

**Ejemplos:**

```json
{
  "detail": "Invalid activation code."
}
```

```json
{
  "detail": "X-Tenant-ID header is required."
}
```

```json
{
  "detail": "Tenant ID in token does not match X-Tenant-ID header."
}
```

---

## Convenciones y Notas

### Timestamps

La API utiliza dos formatos de timestamp según el contexto:

1. **Milisegundos (integer):** Para dispositivos, asistencia, auditoría y códigos de activación
   - Ejemplo: `1706140800000`
   - Uso: Mejor precisión para sincronización de dispositivos

2. **ISO 8601 (string):** Para trabajadores y marcas de tiempo
   - Ejemplo: `"2024-01-25T12:00:00"`
   - Uso: Formato estándar para datos de trabajadores

### Multi-tenancy

- Los endpoints que requieren el header `X-Tenant-ID` validan que coincida con el `tenant_id` del token JWT
- El `tenant_id` se extrae del código de activación (formato: "TENANT-CODE")
- Cada dispositivo pertenece a un único tenant

### Autenticación

- Los tokens JWT de administradores contienen el email en el campo `sub`
- Los tokens JWT de dispositivos contienen `tenant_id` y `device_id`
- Los tokens de dispositivos no expiran por defecto

### Límites

- **Sincronización de asistencia:** Máximo 100 registros por request
- **Imágenes de trabajadores:** Exactamente 7 imágenes requeridas

### TODOs Identificados

Los siguientes elementos están marcados como TODOs en el código:

1. **Validación de permisos de admin:** Validar que el admin pertenece al tenant_id solicitado
2. **Conteo de registros pendientes:** Implementar lógica real para `pending_records`
3. **Limpieza de S3:** Agregar lógica para eliminar imágenes de S3 si falla el guardado en DynamoDB
4. **GSI para timestamps:** Implementar Global Secondary Index para consultas por worker_id

---

## Ejemplos de Flujos Completos

### Flujo 1: Registro y Uso de Dispositivo

1. **Admin crea código de activación:**
   ```bash
   POST /api/admin/activation-codes
   {
     "code": "ACME-ABC123",
     "description": "Tablet entrada principal",
     "expires_at": 1706227200000
   }
   ```

2. **Dispositivo se registra:**
   ```bash
   POST /api/devices/register
   {
     "activation_code": "ACME-ABC123",
     "device_id": "550e8400-e29b-41d4-a716-446655440000",
     "device_name": "Tablet Entrada Principal",
     "device_model": "Samsung Galaxy Tab A7",
     "device_manufacturer": "Samsung",
     "android_version": "13"
   }
   # Respuesta incluye device_token
   ```

3. **Dispositivo consulta su estado:**
   ```bash
   GET /api/devices/status
   Headers: Authorization: Bearer {device_token}
   ```

4. **Dispositivo sincroniza asistencia:**
   ```bash
   POST /api/attendance/sync
   Headers:
     Authorization: Bearer {device_token}
     X-Tenant-ID: ACME
   {
     "records": [...]
   }
   ```

### Flujo 2: Gestión de Trabajadores

1. **Registrar trabajador con imágenes:**
   ```bash
   POST /api/workers
   Content-Type: multipart/form-data
   - personal_data_json: {...}
   - images: [7 archivos]
   ```

2. **Consultar trabajadores:**
   ```bash
   GET /api/workers
   ```

3. **Actualizar trabajador:**
   ```bash
   PUT /api/workers/{worker_id}
   {
     "email": "newemail@example.com"
   }
   ```

### Flujo 3: Registro de Asistencia Manual

1. **Registrar entrada:**
   ```bash
   POST /api/timestamps
   {
     "worker_id": "worker-550e8400...",
     "event_type": "entry"
   }
   ```

2. **Consultar marcas de tiempo de un trabajador:**
   ```bash
   GET /api/timestamps?worker_id=worker-550e8400...
   ```

3. **Registrar salida:**
   ```bash
   POST /api/timestamps
   {
     "worker_id": "worker-550e8400...",
     "event_type": "exit"
   }
   ```

---

## Versionado

**Versión Actual:** 2.0

**Historial de Cambios:**
- v2.0: Versión inicial documentada con soporte para multi-tenancy, sincronización de dispositivos y gestión completa de trabajadores

---

## Soporte y Contacto

Para preguntas o problemas con la API, contactar al equipo de desarrollo.

**Base de Datos:** AWS DynamoDB
**Almacenamiento de Archivos:** AWS S3
**Framework:** FastAPI (Python)

---

*Última actualización: 2024-12-15*
