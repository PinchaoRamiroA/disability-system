import { z } from 'zod';

export const PagoSchema = z.object({
  id_pago: z.number(),
  id_incapacidad: z.number(),
  id_entidad: z.number(),
  nombre_entidad: z.string().optional(),
  tipo_pago: z.string(),
  estado_pago: z.string(),
  valor: z.string(),
  fecha_pago: z.string(),
  descripcion: z.string().nullable().optional(),
  periodo_contable: z.string().nullable().optional(),
  conciliado: z.boolean(),
  registrado_por: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Pago = z.infer<typeof PagoSchema>;

export const PagoListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(PagoSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
  }),
});

export type PagoListResponse = z.infer<typeof PagoListResponseSchema>;

export const CreatePagoRequestSchema = z.object({
  id_incapacidad: z.number(),
  id_entidad: z.number(),
  tipo_pago: z.string(),
  estado_pago: z.string().optional(),
  valor: z.string(),
  fecha_pago: z.string(),
  descripcion: z.string().optional(),
  periodo_contable: z.string().optional(),
});

export type CreatePagoRequest = z.infer<typeof CreatePagoRequestSchema>;

export const UpdatePagoRequestSchema = CreatePagoRequestSchema.partial();

export type UpdatePagoRequest = z.infer<typeof UpdatePagoRequestSchema>;

export const ConciliarPagoRequestSchema = z.object({
  conciliado: z.boolean(),
  estado_pago: z.string(),
  descripcion: z.string().optional(),
});

export type ConciliarPagoRequest = z.infer<typeof ConciliarPagoRequestSchema>;

export const SeguimientoSchema = z.object({
  id_seguimiento: z.number(),
  id_incapacidad: z.number(),
  tipo_seguimiento: z.string(),
  descripcion: z.string().nullable().optional(),
  fecha: z.string().optional(),
  fecha_contacto: z.string().optional(),
  resultado: z.string().nullable().optional(),
  resultado_seguimiento: z.string().nullable().optional(),
  gestionado_por: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Seguimiento = z.infer<typeof SeguimientoSchema>;

export const SeguimientoListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(SeguimientoSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
  }),
});

export type SeguimientoListResponse = z.infer<typeof SeguimientoListResponseSchema>;

export const CreateSeguimientoRequestSchema = z.object({
  id_incapacidad: z.number(),
  tipo_seguimiento: z.string(),
  descripcion: z.string().optional(),
  resultado: z.string().optional(),
  fecha: z.string().optional(),
  fecha_contacto: z.string().optional(),
});

export type CreateSeguimientoRequest = z.infer<typeof CreateSeguimientoRequestSchema>;