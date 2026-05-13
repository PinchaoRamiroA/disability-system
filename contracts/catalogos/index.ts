import { z } from "zod";

/* ================================
 * Catalogo estado documento
 * ================================ */

export const EstadoDocumentoSchema = z.object({
  id_estado_documento: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  color: z.enum(["gray", "orange", "yellow", "red", "green"]),
});

export const CatalogoEstadoDocumentoSchema = z.object({
  success: z.boolean(),
  data: z.array(EstadoDocumentoSchema),
  message: z.string(),
});

export type EstadoDocumento = z.infer<typeof EstadoDocumentoSchema>;
export type CatalogoEstadoDocumento = z.infer<
  typeof CatalogoEstadoDocumentoSchema
>;

/* ================================
 * Catalogo tipo documento
 * ================================ */

export const TipoDocumentoSchema = z.object({
  id_tipo_documento: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
  requerido: z.boolean(),
});

export const CatalogoTipoDocumentoSchema = z.object({
  success: z.boolean(),
  data: z.array(TipoDocumentoSchema),
  message: z.string(),
});

export type TipoDocumento = z.infer<typeof TipoDocumentoSchema>;
export type CatalogoTipoDocumento = z.infer<
  typeof CatalogoTipoDocumentoSchema
>;

/* ================================
 * Catalogo tipos de pago
 * ================================ */

export const TipoPagoSchema = z.object({
  id_tipo_pago: z.number(),
  nombre: z.string(),
  descripcion: z.string(),
});

export const CatalogoTipoPagoSchema = z.object({
  success: z.boolean(),
  data: z.array(TipoPagoSchema),
  message: z.string(),
});

export type TipoPago = z.infer<typeof TipoPagoSchema>;
export type CatalogoTipoPago = z.infer<typeof CatalogoTipoPagoSchema>;