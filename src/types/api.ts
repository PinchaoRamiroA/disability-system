export interface ApiError {
	code: string
	details?: Record<string, unknown>
}

export interface ApiResponse<T> {
	success: boolean
	message?: string
	data: T
	error?: ApiError
}

export interface ApiErrorResponse {
	success: false
	message: string
	error: ApiError
}

export interface PaginatedData<T> {
	items: T[]
	total: number
	page: number
	limit: number
	total_pages: number
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>

export type ISODate = string
export type ISODateTime = string
export type DecimalString = string

export interface Role {
	id: number
	nombre: string
	permisos: string[]
}

export interface AuthUser {
	id: number
	nombre: string
	correo: string
	numero_celular: string
	direccion: string
	numero_documento: string
	estado: boolean
	rol: Role
	created_at: ISODateTime
}

export interface LoginRequest {
	email: string
	password: string
}

export interface RegisterRequest {
	nombre: string
	email: string
	password: string
	numero_documento: string
	numero_celular: string
	direccion: string
}

export interface TokenPayload {
	access_token: string
	refresh_token: string
	token_type: 'Bearer' | string
	expires_in: number
}

export interface LoginData extends TokenPayload {
	user: AuthUser
}

export interface RefreshTokenRequest {
	refresh_token: string
}

export type RefreshTokenData = TokenPayload

export type LoginResponse = ApiResponse<LoginData>
export type RegisterResponse = ApiResponse<AuthUser>
export type RefreshTokenResponse = ApiResponse<RefreshTokenData>

export interface EstadoIncapacidad {
	id_estado: number
	nombre: string
	descripcion: string
	permite_transicion: boolean
}

export interface TipoIncapacidad {
	id_tipo: number
	nombre: string
	documentos_requeridos: string[]
}

export type TipoEntidad = 'EPS' | 'ARL' | string

export interface Entidad {
	id_entidad: number
	nombre: string
	tipo: TipoEntidad
	plazo_transcripcion_dias: number
	tiempo_maximo_pago_dias: number
	canal_atencion?: string
	canales_atencion?: string[]
	requiere_transcripcion: boolean
}

export type OrigenIncapacidad =
	| 'enfermedad_general'
	| 'accidente_laboral'
	| 'enfermedad_laboral'
	| 'licencia_maternidad'
	| 'licencia_paternidad'
	| string

export type CanalRecepcion =
	| 'email'
	| 'presencial'
	| 'virtual'
	| 'whatsapp'
	| string

export type EstadoTranscripcion =
	| 'pendiente'
	| 'en_proceso'
	| 'completado'
	| 'vencida'
	| string

export interface Incapacidad {
    id_incapacidad: number
    id_usuario: number
    canal_recepcion: CanalRecepcion
    titulo: string
    fecha_inicio: ISODate
    fecha_fin: ISODate
    origen: OrigenIncapacidad
    fecha_radicacion?: ISODate | null
    fecha_pago?: ISODate | null
    observaciones?: string | null
    estado: EstadoIncapacidad
    tipo: TipoIncapacidad
    entidad: Entidad
    empleado?: AuthUser
    documentos?: Documento[]
    created_at: ISODateTime
    updated_at: ISODateTime
}

export interface IncapacidadFilters {
	id_usuario?: number
	id_estado?: number
	id_tipo?: number
	id_entidad?: number
	origen?: OrigenIncapacidad
	canal_recepcion?: CanalRecepcion
	search?: string
	page?: number
	limit?: number
}

export interface CreateIncapacidadRequest {
	id_empleado: number
	id_tipo: number
	id_entidad: number
	titulo: string
	fecha_inicio: ISODate
	fecha_fin: ISODate
	canal_recepcion: CanalRecepcion
	fecha_radicacion?: ISODate
	fecha_pago?: ISODate
	observaciones?: string
}

export type UpdateIncapacidadRequest = Partial<CreateIncapacidadRequest>

export interface ChangeEstadoIncapacidadRequest {
	id_estado: number
	observaciones?: string
}

export interface HistorialIncapacidad {
	id_historial: number
	id_incapacidad: number
	estado_anterior?: EstadoIncapacidad | null
	estado_nuevo: EstadoIncapacidad
	observaciones?: string | null
	created_at: ISODateTime
	usuario?: AuthUser
}

export interface PlazosIncapacidad {
	id_incapacidad: number
	fecha_limite_transcripcion?: ISODate | null
	fecha_limite_pago?: ISODate | null
	dias_restantes_transcripcion?: number | null
	dias_restantes_pago?: number | null
	transcripcion_vencida: boolean
	pago_vencido: boolean
}

export interface TranscribirIncapacidadRequest {
	fecha_transcripcion: ISODate
	numero_radicado: string
	observaciones?: string
}

export interface UpdateTranscripcionRequest {
	estado_transcripcion: EstadoTranscripcion
}

export interface TranscripcionesPendientesFilters {
	estado?: EstadoTranscripcion
	page?: number
	limit?: number
}

export type ListIncapacidadesResponse = PaginatedResponse<Incapacidad>
export type IncapacidadResponse = ApiResponse<Incapacidad>
export type HistorialIncapacidadResponse = ApiResponse<HistorialIncapacidad[]>
export type PlazosIncapacidadResponse = ApiResponse<PlazosIncapacidad>
export type EntidadesResponse = ApiResponse<Entidad[]>
export type EstadosIncapacidadResponse = ApiResponse<EstadoIncapacidad[]>
export type TiposIncapacidadResponse = ApiResponse<TipoIncapacidad[]>
export type DocumentosRequeridosResponse = ApiResponse<string[]>

export type EstadoDocumento =
	| 'pendiente'
	| 'validado'
	| 'rechazado'
	| string

export interface Documento {
	id_documento: number
	id_incapacidad: number
	tipo: string
	nombre_archivo: string
	url: string
	estado?: EstadoDocumento
	validado?: boolean
	observaciones?: string | null
	created_at?: ISODateTime
	updated_at?: ISODateTime
}

export interface DocumentoFilters {
	id_incapacidad: number
	estado?: EstadoDocumento
	tipo?: string
	page?: number
	limit?: number
}

export interface CreateDocumentoRequest {
	id_incapacidad: number
	tipo: string
	nombre_archivo: string
	url: string
}

export interface UploadDocumentoUrlRequest {
	nombre: string
	formato: string
	tipo: string
}

export interface UploadDocumentoUrlData {
	url: string
	fields?: Record<string, string>
	key?: string
}

export interface ValidarDocumentoRequest {
	validado: boolean
	observaciones?: string
}

export type ListDocumentosResponse = PaginatedResponse<Documento>
export type DocumentoResponse = ApiResponse<Documento>
export type UploadDocumentoUrlResponse = ApiResponse<UploadDocumentoUrlData>

export type TipoPago = 'prima' | string
export type EstadoPago = 'pendiente' | 'conciliado' | 'pagado' | string

export interface Pago {
	id_pago: number
	id_incapacidad: number
	id_entidad: number
	nombre_entidad?: string
	tipo_pago: TipoPago
	estado_pago: EstadoPago
	conciliado: boolean
	valor: DecimalString
	fecha_pago?: ISODate | null
	descripcion?: string | null
	periodo_contable?: string | null
	incapacidad?: Incapacidad
	entidad?: Entidad
	created_at?: ISODateTime
	updated_at?: ISODateTime
}

export interface PagoFilters {
	id_incapacidad?: number
	id_entidad?: number
	tipo_pago?: TipoPago
	estado_pago?: EstadoPago
	conciliado?: boolean
	page?: number
	limit?: number
}

export interface CreatePagoRequest {
	id_incapacidad: number
	id_entidad: number
	tipo_pago: TipoPago
	estado_pago: EstadoPago
	valor: DecimalString
	fecha_pago: ISODate
	descripcion?: string
	periodo_contable?: string
}

export type UpdatePagoRequest = Partial<CreatePagoRequest>

export interface ConciliarPagoRequest {
	conciliado: boolean
	estado_pago: EstadoPago
	descripcion?: string
}

export type TipoSeguimiento =
	| 'persuasivo'
	| 'coercitivo'
	| 'juridico'
	| string

export interface SeguimientoCobro {
	id_seguimiento: number
	id_incapacidad: number
	tipo_seguimiento: TipoSeguimiento
	descripcion: string
	fecha_contacto: ISODate
	incapacidad?: Incapacidad
	created_at?: ISODateTime
	updated_at?: ISODateTime
}

export interface SeguimientoFilters {
	id_incapacidad?: number
	tipo_seguimiento?: TipoSeguimiento
	page?: number
	limit?: number
}

export interface CreateSeguimientoRequest {
	id_incapacidad: number
	tipo_seguimiento: TipoSeguimiento
	descripcion: string
	fecha_contacto: ISODate
}

export type UpdateSeguimientoRequest = Partial<CreateSeguimientoRequest>

export type ListPagosResponse = PaginatedResponse<Pago>
export type PagoResponse = ApiResponse<Pago>
export type ListSeguimientosResponse = PaginatedResponse<SeguimientoCobro>
export type SeguimientoResponse = ApiResponse<SeguimientoCobro>

export interface CarteraEstadisticas {
	total_cartera: DecimalString
	total_pagado: DecimalString
	total_pendiente: DecimalString
	total_vencido: DecimalString
	cantidad_incapacidades: number
	cantidad_pagos_pendientes: number
}

export interface ResumenEntidad {
	entidad: Entidad
	total_cartera: DecimalString
	total_pagado: DecimalString
	total_pendiente: DecimalString
	total_vencido: DecimalString
	cantidad_incapacidades: number
}

export interface CarteraVencida {
	id_incapacidad: number
	incapacidad: Incapacidad
	entidad: Entidad
	valor_pendiente: DecimalString
	dias_vencidos: number
	fecha_vencimiento: ISODate
}

export interface AlertaVencimiento {
	id_incapacidad: number
	incapacidad: { id: number; titulo: string } | Incapacidad
	nombre_entidad: string
	tipo_alerta: string
	fecha_vencimiento: ISODate
	dias_restantes: number
	prioridad: 'Alto' | 'Medio' | 'Bajo' | 'Crítico' | string
	mensaje: string
}

export interface AlertasVencimientoFilters {
	dias_minimos?: number
}

export interface ProximoEstado {
	id_estado: number
	nombre: string
	motivo?: string
}

export type CarteraEstadisticasResponse = ApiResponse<CarteraEstadisticas>
export type ResumenEntidadResponse = ApiResponse<ResumenEntidad[]>
export type CarteraVencidaResponse = ApiResponse<CarteraVencida[]>
export type AlertasVencimientoResponse = ApiResponse<AlertaVencimiento[]>
export type ProximoEstadoResponse = ApiResponse<ProximoEstado>

export type TipoNotificacion = 'recordatorio' | string

export interface Notificacion {
	id_notificacion: number
	id_usuario: number
	id_incapacidad?: number | null
	titulo: string
	mensaje: string
	tipo_notificacion: TipoNotificacion
	leida: boolean
	created_at?: ISODateTime
	updated_at?: ISODateTime
	incapacidad?: Incapacidad
	usuario?: AuthUser
}

export interface NotificacionFilters {
	id_usuario?: number
	id_incapacidad?: number
	tipo_notificacion?: TipoNotificacion
	leida?: boolean
	page?: number
	limit?: number
}

export interface CreateNotificacionRequest {
	id_usuario: number
	id_incapacidad?: number
	titulo: string
	mensaje: string
	tipo_notificacion: TipoNotificacion
}

export interface CountNoLeidas {
	count: number
}

export type ListNotificacionesResponse = PaginatedResponse<Notificacion>
export type NotificacionResponse = ApiResponse<Notificacion>
export type CountNoLeidasResponse = ApiResponse<CountNoLeidas>

export interface CatalogoItem {
	id: number
	nombre: string
	descripcion?: string
}

export type TiposDocumentoResponse = ApiResponse<CatalogoItem[]>
export type EstadosDocumentoResponse = ApiResponse<CatalogoItem[]>
export type TiposPagoResponse = ApiResponse<CatalogoItem[]>

export type TipoReporte = 'incapacidades' | 'ausentismo' | 'cartera' | string

export interface GenerateReporteRequest {
	tipo_reporte: TipoReporte
	fecha_inicio: ISODate
	fecha_fin: ISODate
	id_entidad?: number
	agrupar_por?: string
}

export interface ReporteEntidadRequest {
	tipo_reporte: TipoReporte
	fecha_inicio: ISODate
	fecha_fin: ISODate
}

export interface ReporteData {
	tipo_reporte: TipoReporte
	fecha_inicio: ISODate
	fecha_fin: ISODate
	items: Record<string, unknown>[]
	resumen?: Record<string, unknown>
}

export interface ResumenEjecutivo {
	incapacidades_activas: number
	pendientes: number
	pagadas: number
	rechazadas: number
	total_cartera: DecimalString
	total_pagado: DecimalString
	alertas_vencimiento: number
}

export interface ReporteVencimientosFilters {
	dias_minimos?: number
}

export type ReporteResponse = ApiResponse<ReporteData>
export type ResumenEjecutivoResponse = ApiResponse<ResumenEjecutivo>
export type ReporteVencimientosResponse = ApiResponse<CarteraVencida[]>
