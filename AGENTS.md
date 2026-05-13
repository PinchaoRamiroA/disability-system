# Frontend Integration Guide

This document provides information for frontend developers on how to connect to the disability management system API.

## Base URL

```
Development: http://localhost:8080/api/v1
Production: Configured via environment variable
```

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require JWT authentication.

### Authorization Header

Include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### Endpoints

#### POST /auth/login
Login with credentials to get access and refresh tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "user": {
      "id": 1,
      "nombre": "John Doe",
      "correo": "user@example.com",
      "numero_celular": "1234567890",
      "direccion": "Address",
      "numero_documento": "12345678",
      "estado": true,
      "rol": {
        "id": 1,
        "nombre": "admin",
        "permisos": ["read", "write", "delete"]
      },
      "created_at": "2024-01-01T00:00:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

#### POST /auth/register
Register a new user in the system.

**Request:**
```json
{
  "nombre": "John Doe",
  "email": "user@example.com",
  "password": "your_password",
  "numero_documento": "12345678",
  "numero_celular": "1234567890",
  "direccion": "Address"
}
```

**Response (201):** Returns the created user object.

#### POST /auth/refresh
Obtain new tokens using a refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

---

## Standard Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "OK",
  "data": { ... },
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

### Pagination Response

List endpoints return paginated data:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  }
}
```

---

## Endpoints by Module

### Incapacidades (Disabilities)

#### GET /incapacidades
List all disabilities with filters and pagination.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id_usuario | int | Filter by user ID |
| id_estado | int | Filter by status ID |
| id_tipo | int | Filter by type ID |
| id_entidad | int | Filter by entity ID (EPS/ARL) |
| origen | string | Filter by origin |
| canal_recepcion | string | Filter by reception channel |
| page | int | Page number (default: 1) |
| limit | int | Items per page (default: 20) |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id_incapacidad": 1,
        "id_usuario": 1,
        "canal_recepcion": "email",
        "titulo": "Incapacidad por enfermedad",
        "fecha_inicio": "2024-01-01",
        "fecha_fin": "2024-01-15",
        "origen": "enfermedad_general",
        "fecha_radicacion": "2024-01-02",
        "fecha_pago": "2024-01-20",
        "observaciones": "Some notes",
        "estado": {
          "id_estado": 1,
          "nombre": "pendiente",
          "descripcion": "Pendiente de transcripción",
          "permite_transicion": true
        },
        "tipo": {
          "id_tipo": 1,
          "nombre": "Enfermedad General",
          "documentos_requeridos": ["certificado", "historia_clinica"]
        },
        "entidad": {
          "id_entidad": 1,
          "nombre": "EPS Sanitas",
          "tipo": "EPS",
          "plazo_transcripcion_dias": 3,
          "tiempo_maximo_pago_dias": 30,
          "canal_atencion": "presencial",
          "canales_atencion": ["presencial", "virtual"],
          "requiere_transcripcion": true
        },
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5
  }
}
```

#### POST /incapacidades
Create a new disability record.

**Request:**
```json
{
  "id_tipo": 1,
  "id_entidad": 1,
  "titulo": "Incapacidad por enfermedad",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-01-15",
  "origen": "enfermedad_general",
  "canal_recepcion": "email",
  "fecha_radicacion": "2024-01-02",
  "fecha_pago": "2024-01-20",
  "observaciones": "Optional notes"
}
```

#### GET /incapacidades/{id}
Get a specific disability by ID.

#### PUT /incapacidades/{id}
Update a disability record.

#### DELETE /incapacidades/{id}
Archive a disability (soft delete).

#### PATCH /incapacidades/{id}/estado
Change the status of a disability.

**Request:**
```json
{
  "id_estado": 2,
  "observaciones": "Optional notes"
}
```

#### GET /incapacidades/{id}/historial
Get the history of changes for a disability.

#### GET /incapacidades/{id}/plazos
Get deadlines and expiration alerts for a disability.

#### POST /incapacidades/{id}/transcribir
Register the transcription of a disability to the EPS/ARL.

**Request:**
```json
{
  "fecha_transcripcion": "2024-01-03",
  "numero_radicado": "RAD-001",
  "observaciones": "Notes"
}
```

#### PATCH /incapacidades/{id}/transcripcion
Mark the transcription status as "in progress".

**Request:**
```json
{
  "estado_transcripcion": "en_proceso"
}
```

#### GET /incapacidades/transcripciones/pendientes
List disabilities with pending transcription.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| estado | string | Transcription status (pendiente, en_proceso, completado, vencida) |
| page | int | Page number |
| limit | int | Items per page |

#### GET /incapacidades/tipos/{tipo_id}/documentos-requeridos
Get required documents for a disability type.

#### GET /incapacidades/entidades
List all EPS and ARL entities.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_entidad": 1,
      "nombre": "EPS Sanitas",
      "tipo": "EPS",
      "plazo_transcripcion_dias": 3,
      "tiempo_maximo_pago_dias": 30,
      "requiere_transcripcion": true
    }
  ]
}
```

#### GET /incapacidades/estados
List all available statuses.

#### GET /incapacidades/tipos
List all disability types.

---

### Documentos (Documents)

#### GET /incapacidades/{id}/documentos
List documents for a disability.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id_incapacidad | int | Disability ID (required) |
| estado | string | Filter by status |
| tipo | string | Filter by document type |
| page | int | Page number |
| limit | int | Items per page |

#### POST /incapacidades/{id}/documentos
Upload a document for a disability.

**Request:**
```json
{
  "id_incapacidad": 1,
  "tipo": "certificado",
  "nombre_archivo": "certificado.pdf",
  "url": "https://..."
}
```

#### POST /incapacidades/{id}/documentos/upload
Upload a binary file (multipart/form-data).

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| file | file | PDF/JPG/PNG file (max 10MB) |
| tipo | string | Document type |

#### POST /incapacidades/{id}/documentos/url
Generate a pre-signed URL for uploading documents to R2 storage.

**Request:**
```json
{
  "nombre": "certificado.pdf",
  "formato": "application/pdf",
  "tipo": "certificado"
}
```

#### PATCH /documentos/{id}/validar
Validate or reject a document.

**Request:**
```json
{
  "validado": true,
  "observaciones": "Document approved"
}
```

#### DELETE /documentos/{id}
Delete a document.

---

### Cobros (Collections)

#### GET /cobros/pagos
List payments with filters.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id_incapacidad | int | Filter by disability |
| id_entidad | int | Filter by entity |
| tipo_pago | string | Filter by payment type |
| estado_pago | string | Filter by payment status |
| conciliado | bool | Filter by reconciliation status |
| page | int | Page number |
| limit | int | Items per page |

#### POST /cobros/pagos
Register a new payment from EPS/ARL.

**Request:**
```json
{
  "id_incapacidad": 1,
  "id_entidad": 1,
  "tipo_pago": "prima",
  "estado_pago": "pendiente",
  "valor": "1500000",
  "fecha_pago": "2024-01-20",
  "descripcion": "Payment description",
  "periodo_contable": "2024-01"
}
```

#### GET /cobros/pagos/{id}
Get a specific payment by ID.

#### PUT /cobros/pagos/{id}
Update a payment.

#### DELETE /cobros/pagos/{id}
Delete a payment.

#### PATCH /cobros/pagos/{id}/conciliar
Reconcile a payment for accounting.

**Request:**
```json
{
  "conciliado": true,
  "estado_pago": "conciliado",
  "descripcion": "Reconciled"
}
```

#### GET /cobros/seguimientos
List collection follow-ups.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id_incapacidad | int | Filter by disability |
| tipo_seguimiento | string | Filter by follow-up type |
| page | int | Page number |
| limit | int | Items per page |

#### POST /cobros/seguimientos
Register a collection follow-up.

**Request:**
```json
{
  "id_incapacidad": 1,
  "tipo_seguimiento": "persuasivo",
  "descripcion": "Follow-up description",
  "fecha_contacto": "2024-01-15"
}
```

#### GET /cobros/seguimientos/{id}
Get a specific follow-up by ID.

#### PUT /cobros/seguimientos/{id}
Update a follow-up.

---

### Cartera (Portfolio)

#### GET /cartera/estadisticas
Get general portfolio statistics.

#### GET /cartera/resumen-entidad
Get collection summary grouped by entity.

#### GET /cartera/vencida
List overdue payments.

#### GET /cartera/alertas-vencimiento
List expiration alerts.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| dias_minimos | int | Minimum days of expiration |

#### GET /cartera/incapacidades/{id}/proximo-estado
Get suggested next state based on collection actions.

---

### Notificaciones (Notifications)

#### GET /notificaciones
List user notifications.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id_usuario | int | Filter by user |
| id_incapacidad | int | Filter by disability |
| tipo_notificacion | string | Filter by notification type |
| leida | bool | Filter by read status |
| page | int | Page number |
| limit | int | Items per page |

#### POST /notificaciones
Create a new notification.

**Request:**
```json
{
  "id_usuario": 1,
  "id_incapacidad": 1,
  "titulo": "Notification title",
  "mensaje": "Notification message",
  "tipo_notificacion": "recordatorio"
}
```

#### GET /notificaciones/{id}
Get a specific notification by ID.

#### DELETE /notificaciones/{id}
Delete a notification.

#### PATCH /notificaciones/{id}/leida
Mark a notification as read.

#### PATCH /notificaciones/marcar-todas-leidas
Mark all notifications as read.

#### GET /notificaciones/no-leidas/count
Get count of unread notifications.

---

### Catalogos (Catalogs)

#### GET /catalogos/tipos-documento
List all document types.

#### GET /catalogos/estados-documento
List all document states.

#### GET /catalogos/tipos-pago
List all payment types.

---

### Reportes (Reports)

#### POST /reportes
Generate a report (disabilities, absenteeism, or portfolio).

**Request:**
```json
{
  "tipo_reporte": "incapacidades",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-12-31",
  "id_entidad": 1,
  "agrupar_por": "mes"
}
```

#### GET /reportes/resumen-ejecutivo
Get executive summary with general metrics.

#### GET /reportes/vencimientos
Generate report of expired disabilities.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| dias_minimos | int | Minimum days of expiration |

#### GET /reportes/entidades/{entidad_id}
Generate a specific report for an entity (EPS/ARL).

**Request:**
```json
{
  "tipo_reporte": "incapacidades",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-12-31"
}
```

---

## Authentication Flow

### Login Flow
1. Call `/auth/login` with email and password
2. Store `access_token` and `refresh_token` securely
3. Include `access_token` in the `Authorization` header for all authenticated requests

### Token Refresh Flow
1. When `access_token` expires (check `expires_in`)
2. Call `/auth/refresh` with the `refresh_token`
3. Update stored tokens with the new ones

### Logout Flow
1. Clear stored tokens from local storage/state

---

## Error Handling

### HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized (invalid or expired token) |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 413 | Payload too large |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

---

## Best Practices

### Authentication
- Store tokens securely (httpOnly cookies preferred or secure localStorage)
- Implement token refresh before expiration
- Handle 401 responses by attempting refresh or redirecting to login

### API Requests
- Use proper loading states
- Handle errors gracefully with user-friendly messages
- Implement retry logic for transient failures

### Date Formats
- Dates are in ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM:SSZ`

### Pagination
- Always handle paginated responses
- Implement infinite scroll or pagination UI
- Default page size is 20

### File Upload
- Maximum file size is 10MB
- Supported formats: PDF, JPG, PNG
- Use multipart/form-data for binary uploads

---

## Environment Variables

Required frontend environment variables:
```
VITE_API_URL=http://localhost:8080/api/v1
```