import { z } from 'zod';

export const NotificacionSchema = z.object({
  id_notificacion: z.number(),
  id_usuario: z.number(),
  id_incapacidad: z.number().nullable(),
  titulo: z.string(),
  mensaje: z.string(),
  tipo_notificacion: z.string(),
  leida: z.boolean(),
  created_at: z.string(),
});

export type Notificacion = z.infer<typeof NotificacionSchema>;

export const NotificacionListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(NotificacionSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
  }),
});

export type NotificacionListResponse = z.infer<typeof NotificacionListResponseSchema>;

export const CreateNotificacionRequestSchema = z.object({
  id_usuario: z.number(),
  id_incapacidad: z.number().optional(),
  titulo: z.string(),
  mensaje: z.string(),
  tipo_notificacion: z.string(),
});

export type CreateNotificacionRequest = z.infer<typeof CreateNotificacionRequestSchema>;

export const UnreadCountResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    count: z.number(),
  }),
});

export type UnreadCountResponse = z.infer<typeof UnreadCountResponseSchema>;