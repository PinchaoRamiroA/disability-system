# API Endpoints Reference

> Base path: `/api/v1` (defined in `internal/shared/router/router.go` → `V1()`).
> All endpoints below are prefixed with `/api/v1`. Example: `POST /api/v1/auth/login`.
> Auth: `/auth/*` and `GET /health*` are public. All other `/api/v1/*` groups require `JWT Authenticate()`; most also require `LoadActor()` permissions middleware. `/usuarios` and `/roles` additionally require `RequireRole(...)`.
> Source of truth verified against: `internal/app/routes.go`, `internal/app/dependencies.go` (`InitAuth`), and each module's `adapters/http/register.go`.

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
| GET | `/incapacidades/estados` | List all statuses |
| GET | `/incapacidades/tipos` | List all types |
| GET | `/incapacidades/entidades` | List all entities |
| GET | `/incapacidades/transcripciones/pendientes` | List pending transcriptions |
| GET | `/incapacidades/tipos/{tipo_id}/documentos-requeridos` | Get required documents by type |
| GET | `/incapacidades/{id}` | Get by ID |
| PUT | `/incapacidades/{id}` | Update |
| DELETE | `/incapacidades/{id}` | Archive (soft delete) |
| PATCH | `/incapacidades/{id}/estado` | Change status |
| GET | `/incapacidades/{id}/historial` | Get change history |
| GET | `/incapacidades/{id}/plazos` | Get deadlines |
| POST | `/incapacidades/{id}/transcribir` | Register transcription |
| PATCH | `/incapacidades/{id}/transcripcion` | Update transcription status (mark in-process) |

> Note: static routes (`/estados`, `/tipos`, `/entidades`, `/transcripciones/pendientes`) are registered before `/:id` — keep that order to avoid Gin conflicts.

## Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/incapacidades/{id}/documentos` | List documents |
| POST | `/incapacidades/{id}/documentos` | Create/upload document (same handler as `upload`) |
| POST | `/incapacidades/{id}/documentos/upload` | Upload binary file (alias of above, same `Subir` handler) |
| PATCH | `/documentos/{id}/validar` | Validate/reject |
| DELETE | `/documentos/{id}` | Delete |

> Removed vs previous version: `POST /incapacidades/{id}/documentos/url` (pre-signed URL) does not exist in `incapacidades/adapters/http/register.go` — no route registered. `Subir` currently handles both document creation paths.

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
| GET | `/notificaciones/no-leidas/count` | Unread count |
| PATCH | `/notificaciones/marcar-todas-leidas` | Mark all as read |
| GET | `/notificaciones/{id}` | Get notification |
| PATCH | `/notificaciones/{id}/leida` | Mark as read |
| DELETE | `/notificaciones/{id}` | Delete |

> Note: `/no-leidas/count` and `/marcar-todas-leidas` are registered before `/:id` to avoid shadowing.

## Users & Roles

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/usuarios` | List users | `Administrador`, `admin`, `Gestión Humana`, `SG-SST`, `Recepcionista` |
| GET | `/usuarios/{id}` | Get user | Authenticated |
| POST | `/usuarios` | Create user | `Administrador`, `admin`, `Gestión Humana` |
| PUT | `/usuarios/{id}` | Update user | `Administrador`, `admin`, `Gestión Humana` |
| PATCH | `/usuarios/{id}/estado` | Enable/disable user | `Administrador`, `admin`, `Gestión Humana` |
| POST | `/usuarios/{id}/rol` | Assign role | `Administrador`, `admin` |
| POST | `/usuarios/{id}/password` | Change password | `Administrador`, `admin` |
| DELETE | `/usuarios/{id}` | Delete user | `Administrador`, `admin` |
| GET | `/roles` | List roles | `Administrador`, `admin`, `Gestión Humana` |
| GET | `/roles/{id}` | Get role | `Administrador`, `admin`, `Gestión Humana` |
| POST | `/roles` | Create role | `Administrador`, `admin` |
| PUT | `/roles/{id}` | Update role | `Administrador`, `admin` |
| DELETE | `/roles/{id}` | Delete role | `Administrador`, `admin` |

## Catalogs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/catalogos/tipos-documento` | Document types |
| GET | `/catalogos/estados-documento` | Document states |
| GET | `/catalogos/tipos-pago` | Payment types |

## Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reportes` | Generate report (generic, filtered by body) |
| GET | `/reportes/incapacidades` | Disabilities report (same `GenerarReporte` handler) |
| GET | `/reportes/ausentismo` | Absenteeism report (same `GenerarReporte` handler) |
| GET | `/reportes/cartera` | Portfolio report (same `GenerarReporte` handler) |
| GET | `/reportes/resumen-ejecutivo` | Executive summary |
| GET | `/reportes/vencimientos` | Expired disabilities |
| GET | `/reportes/entidades/{entidad_id}` | Entity-specific report |

## Audit (Auditoría)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auditoria` | List audit entries (filters & pagination) |
| GET | `/auditoria/usuario/{id}` | List entries by user |

## Health & Docs (outside `/api/v1`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Readiness check |
| GET | `/health/live` | Liveness check |
| GET | `/health/ready` | Readiness check |
| GET | `/swagger/*any` | Swagger UI |
