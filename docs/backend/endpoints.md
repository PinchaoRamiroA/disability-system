# API Endpoints Reference

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with credentials |
| POST | `/auth/register` | Register new user |
| POST | `/auth/refresh` | Refresh access token |

## Medical Leaves (Incapacidades)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/incapacidades` | List with filters & pagination |
| POST | `/incapacidades` | Create new disability |
| GET | `/incapacidades/{id}` | Get by ID |
| PUT | `/incapacidades/{id}` | Update |
| DELETE | `/incapacidades/{id}` | Archive (soft delete) |
| PATCH | `/incapacidades/{id}/estado` | Change status |
| GET | `/incapacidades/{id}/historial` | Get change history |
| GET | `/incapacidades/{id}/plazos` | Get deadlines |
| POST | `/incapacidades/{id}/transcribir` | Register transcription |
| PATCH | `/incapacidades/{id}/transcripcion` | Update transcription status |
| GET | `/incapacidades/transcripciones/pendientes` | List pending transcriptions |
| GET | `/incapacidades/tipos/{id}/documentos-requeridos` | Get required documents |
| GET | `/incapacidades/entidades` | List all entities |
| GET | `/incapacidades/estados` | List all statuses |
| GET | `/incapacidades/tipos` | List all types |

## Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/incapacidades/{id}/documentos` | List documents |
| POST | `/incapacidades/{id}/documentos` | Create document |
| POST | `/incapacidades/{id}/documentos/upload` | Upload binary file |
| POST | `/incapacidades/{id}/documentos/url` | Get pre-signed URL |
| PATCH | `/documentos/{id}/validar` | Validate/reject |
| DELETE | `/documentos/{id}` | Delete |

## Collections (Cobros)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cobros/pagos` | List payments |
| POST | `/cobros/pagos` | Register payment |
| GET | `/cobros/pagos/{id}` | Get payment |
| PUT | `/cobros/pagos/{id}` | Update payment |
| DELETE | `/cobros/pagos/{id}` | Delete payment |
| PATCH | `/cobros/pagos/{id}/conciliar` | Reconcile payment |
| GET | `/cobros/seguimientos` | List follow-ups |
| POST | `/cobros/seguimientos` | Create follow-up |
| GET | `/cobros/seguimientos/{id}` | Get follow-up |
| PUT | `/cobros/seguimientos/{id}` | Update follow-up |

## Portfolio (Cartera)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cartera/estadisticas` | Get statistics |
| GET | `/cartera/resumen-entidad` | Summary by entity |
| GET | `/cartera/vencida` | Overdue payments |
| GET | `/cartera/alertas-vencimiento` | Expiration alerts |
| GET | `/cartera/incapacidades/{id}/proximo-estado` | Suggested next state |

## Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notificaciones` | List notifications |
| POST | `/notificaciones` | Create notification |
| GET | `/notificaciones/{id}` | Get notification |
| DELETE | `/notificaciones/{id}` | Delete |
| PATCH | `/notificaciones/{id}/leida` | Mark as read |
| PATCH | `/notificaciones/marcar-todas-leidas` | Mark all as read |
| GET | `/notificaciones/no-leidas/count` | Unread count |

## Catalogs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/catalogos/tipos-documento` | Document types |
| GET | `/catalogos/estados-documento` | Document states |
| GET | `/catalogos/tipos-pago` | Payment types |

## Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reportes` | Generate report |
| GET | `/reportes/resumen-ejecutivo` | Executive summary |
| GET | `/reportes/vencimientos` | Expired disabilities |
| GET | `/reportes/entidades/{id}` | Entity-specific report |