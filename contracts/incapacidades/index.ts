import { z } from 'zod';

export const EstadoSchema = z.object({
  id_estado: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  permite_transicion: z.boolean(),
});

export type Estado = z.infer<typeof EstadoSchema>;

export const TipoIncapacidadSchema = z.object({
  id_tipo: z.number(),
  nombre: z.string(),
  documentos_requeridos: z.array(z.string()),
});

export type TipoIncapacidad = z.infer<typeof TipoIncapacidadSchema>;

export const EntidadSchema = z.object({
  id_entidad: z.number(),
  nombre: z.string(),
  tipo: z.enum(['EPS', 'ARL']),
  plazo_transcripcion_dias: z.number(),
  tiempo_maximo_pago_dias: z.number(),
  canal_atencion: z.string(),
  canales_atencion: z.array(z.string()),
  requiere_transcripcion: z.boolean(),
});

export type Entidad = z.infer<typeof EntidadSchema>;

export const IncapacidadSchema = z.object({
  id_incapacidad: z.number(),
  id_usuario: z.number(),
  canal_recepcion: z.string(),
  titulo: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  origen: z.string(),
  fecha_radicacion: z.string().nullable(),
  fecha_pago: z.string().nullable(),
  observaciones: z.string().nullable(),
  estado: EstadoSchema,
  tipo: TipoIncapacidadSchema,
  entidad: EntidadSchema,
  created_at: z.string(),
  updated_at: z.string(),
});

export type Incapacidad = z.infer<typeof IncapacidadSchema>;

export const IncapacidadListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(IncapacidadSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
  }),
});

export type IncapacidadListResponse = z.infer<typeof IncapacidadListResponseSchema>;

export const CreateIncapacidadRequestSchema = z.object({
  id_usuario: z.number().optional(),
  id_tipo: z.number(),
  id_entidad: z.number(),
  titulo: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  origen: z.string(),
  canal_recepcion: z.string(),
  fecha_radicacion: z.string().optional(),
  fecha_pago: z.string().optional(),
  observaciones: z.string().optional(),
});

export type CreateIncapacidadRequest = z.infer<typeof CreateIncapacidadRequestSchema>;

export const UpdateIncapacidadRequestSchema = CreateIncapacidadRequestSchema.partial();

export type UpdateIncapacidadRequest = z.infer<typeof UpdateIncapacidadRequestSchema>;

export const ChangeEstadoRequestSchema = z.object({
  id_estado: z.number(),
  observaciones: z.string().optional(),
});

export type ChangeEstadoRequest = z.infer<typeof ChangeEstadoRequestSchema>;

export const TranscribirRequestSchema = z.object({
  fecha_transcripcion: z.string(),
  numero_radicado: z.string(),
  observaciones: z.string().optional(),
});

export type TranscribirRequest = z.infer<typeof TranscribirRequestSchema>;

export const UpdateTranscripcionRequestSchema = z.object({
  estado_transcripcion: z.enum(['pendiente', 'en_proceso', 'completado', 'vencida']),
});

export type UpdateTranscripcionRequest = z.infer<typeof UpdateTranscripcionRequestSchema>;

export const TranscripcionSchema = z.object({
  id_transcripcion: z.number(),
  id_incapacidad: z.number(),
  fecha_transcripcion: z.string(),
  numero_radicado: z.string(),
  estado_transcripcion: z.string(),
  observaciones: z.string().nullable(),
  created_at: z.string(),
});

export type Transcripcion = z.infer<typeof TranscripcionSchema>;

export const HistorialSchema = z.object({
  id_historial: z.number(),
  id_incapacidad: z.number(),
  id_estado_anterior: z.number().nullable(),
  id_estado_nuevo: z.number(),
  id_usuario: z.number(),
  observaciones: z.string().nullable(),
  created_at: z.string(),
  estado_anterior: EstadoSchema.nullable(),
  estado_nuevo: EstadoSchema,
});

export type Historial = z.infer<typeof HistorialSchema>;

export const PlazoSchema = z.object({
  id_incapacidad: z.number(),
  tipo_plazo: z.string(),
  fecha_limite: z.string(),
  dias_restantes: z.number(),
  estado: z.string(),
  descripcion: z.string(),
});

export type Plazo = z.infer<typeof PlazoSchema>;