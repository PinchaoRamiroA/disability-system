import { z } from 'zod';

export const EstadisticasCarteraSchema = z.object({
  total_vencido: z.number(),
  total_pendiente: z.number(),
  total_pagado: z.number(),
  cantidad_incapacidades_activas: z.number(),
  promedio_dias_pago: z.number(),
  entidades: z.array(z.object({
    id_entidad: z.number(),
    nombre: z.string(),
    total_vencido: z.number(),
    total_pendiente: z.number(),
    cantidad: z.number(),
  })),
});

export type EstadisticasCartera = z.infer<typeof EstadisticasCarteraSchema>;

export const ResumenEntidadSchema = z.object({
  id_entidad: z.number(),
  nombre_entidad: z.string(),
  tipo: z.string(),
  total_vencido: z.string(),
  total_pendiente: z.string(),
  total_pagado: z.string(),
  cantidad_vencidas: z.number(),
  cantidad_pendientes: z.number(),
  cantidad_pagadas: z.number(),
});

export type ResumenEntidad = z.infer<typeof ResumenEntidadSchema>;

export const AlertaVencimientoSchema = z.object({
  id_incapacidad: z.number(),
  titulo: z.string(),
  fecha_inicio: z.string(),
  fecha_fin: z.string(),
  dias_vencidos: z.number(),
  entidad: z.string(),
  valor_aproximado: z.string().nullable(),
});

export type AlertaVencimiento = z.infer<typeof AlertaVencimientoSchema>;

export const ProximoEstadoSchema = z.object({
  id_incapacidad: z.number(),
  estado_actual: z.string(),
  estado_sugerido: z.string(),
  acciones_recomendadas: z.array(z.string()),
  razon: z.string(),
});

export type ProximoEstado = z.infer<typeof ProximoEstadoSchema>;

export const CarteraVencidaResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(z.object({
      id_incapacidad: z.number(),
      titulo: z.string(),
      entidad: z.string(),
      fecha_fin: z.string(),
      dias_vencidos: z.number(),
      valor: z.string().nullable(),
    })),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
  }),
});

export type CarteraVencidaResponse = z.infer<typeof CarteraVencidaResponseSchema>;