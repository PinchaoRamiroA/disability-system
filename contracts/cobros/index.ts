import { z } from 'zod';

export const PagoSchema = z.object({
  id_pago: z.number(),
  id_incapacidad: z.number(),
  id_entidad: z.number(),
  tipo_pago: z.string(),
  estado_pago: z.string(),
  valor: z.string(),
  fecha_pago: z.string(),
  descripcion: z.string().nullable(),
  periodo_contable: z.string().nullable(),
  conciliado: z.boolean(),
  created_at: z.string(),
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
  estado_pago: z.string(),
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
  descripcion: z.string(),
  fecha_contacto: z.string(),
  created_at: z.string(),
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
  descripcion: z.string(),
  fecha_contacto: z.string(),
});

export type CreateSeguimientoRequest = z.infer<typeof CreateSeguimientoRequestSchema>;