# Database Schema

## Core Tables

### usuarios

| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| nombre | string | Full name |
| correo | string | Email (unique) |
| numero_celular | string | Phone number |
| direccion | string | Address |
| numero_documento | string | Document number |
| estado | boolean | Active status |
| id_rol | int | FK to roles |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Update date |

### roles

| Column | Type | Description |
|--------|------|-------------|
| id | int | Primary key |
| nombre | string | Role name |
| permisos | json | Permission array |

### incapacidades

| Column | Type | Description |
|--------|------|-------------|
| id_incapacidad | int | Primary key |
| id_usuario | int | FK to usuarios |
| id_estado | int | FK to estados |
| id_tipo | int | FK to tipos_incapacidad |
| id_entidad | int | FK to entidades |
| canal_recepcion | string | Reception channel |
| titulo | string | Title |
| fecha_inicio | date | Start date |
| fecha_fin | date | End date |
| origen | string | Origin type |
| fecha_radicacion | date | Filing date |
| fecha_pago | date | Payment date |
| observaciones | text | Notes |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Update date |

### estados

| Column | Type | Description |
|--------|------|-------------|
| id_estado | int | Primary key |
| nombre | string | State name |
| descripcion | string | Description |
| permite_transicion | boolean | Allows transitions |

### tipos_incapacidad

| Column | Type | Description |
|--------|------|-------------|
| id_tipo | int | Primary key |
| nombre | string | Type name |
| documentos_requeridos | json | Required documents array |

### entidades

| Column | Type | Description |
|--------|------|-------------|
| id_entidad | int | Primary key |
| nombre | string | Entity name |
| tipo | string | EPS or ARL |
| plazo_transcripcion_dias | int | Transcription deadline |
| tiempo_maximo_pago_dias | int | Max payment days |
| canal_atencion | string | Primary channel |
| canales_atencion | json | Available channels |
| requiere_transcripcion | boolean | Requires transcription |

### documentos

| Column | Type | Description |
|--------|------|-------------|
| id_documento | int | Primary key |
| id_incapacidad | int | FK to incapacidades |
| tipo | string | Document type |
| nombre_archivo | string | Filename |
| url | string | File URL |
| estado | string | Document state |
| validado | boolean | Validation status |
| observaciones | string | Validation notes |
| created_at | timestamp | Creation date |

### pagos

| Column | Type | Description |
|--------|------|-------------|
| id_pago | int | Primary key |
| id_incapacidad | int | FK to incapacidades |
| id_entidad | int | FK to entidades |
| tipo_pago | string | Payment type |
| estado_pago | string | Payment state |
| valor | decimal | Amount |
| fecha_pago | date | Payment date |
| descripcion | string | Description |
| periodo_contable | string | Accounting period |
| conciliado | boolean | Reconciliation status |
| created_at | timestamp | Creation date |

### seguimientos

| Column | Type | Description |
|--------|------|-------------|
| id_seguimiento | int | Primary key |
| id_incapacidad | int | FK to incapacidades |
| tipo_seguimiento | string | Follow-up type |
| descripcion | string | Description |
| fecha_contacto | date | Contact date |
| created_at | timestamp | Creation date |

### notificaciones

| Column | Type | Description |
|--------|------|-------------|
| id_notificacion | int | Primary key |
| id_usuario | int | FK to usuarios |
| id_incapacidad | int | FK to incapacidades |
| titulo | string | Title |
| mensaje | string | Message |
| tipo_notificacion | string | Notification type |
| leida | boolean | Read status |
| created_at | timestamp | Creation date |

### historial_incapacidades

| Column | Type | Description |
|--------|------|-------------|
| id_historial | int | Primary key |
| id_incapacidad | int | FK to incapacidades |
| id_estado_anterior | int | Previous state |
| id_estado_nuevo | int | New state |
| id_usuario | int | User who made change |
| observaciones | string | Change notes |
| created_at | timestamp | Change date |

### transcripciones

| Column | Type | Description |
|--------|------|-------------|
| id_transcripcion | int | Primary key |
| id_incapacidad | int | FK to incapacidades |
| fecha_transcripcion | date | Transcription date |
| numero_radicado | string | Radication number |
| estado_transcripcion | string | Transcription state |
| observaciones | string | Notes |
| created_at | timestamp | Creation date |