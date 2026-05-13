import { z } from 'zod';

export const DocumentoSchema = z.object({
  id_documento: z.number(),
  id_incapacidad: z.number(),
  tipo: z.string(),
  nombre_archivo: z.string(),
  url: z.string(),
  estado: z.string(),
  validado: z.boolean().nullable(),
  observaciones: z.string().nullable(),
  created_at: z.string(),
});

export type Documento = z.infer<typeof DocumentoSchema>;

export const DocumentoListResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    items: z.array(DocumentoSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    total_pages: z.number(),
  }),
});

export type DocumentoListResponse = z.infer<typeof DocumentoListResponseSchema>;

export const CreateDocumentoRequestSchema = z.object({
  id_incapacidad: z.number(),
  tipo: z.string(),
  nombre_archivo: z.string(),
  url: z.string(),
});

export type CreateDocumentoRequest = z.infer<typeof CreateDocumentoRequestSchema>;

export const ValidateDocumentoRequestSchema = z.object({
  validado: z.boolean(),
  observaciones: z.string().optional(),
});

export type ValidateDocumentoRequest = z.infer<typeof ValidateDocumentoRequestSchema>;

export const PreSignedUrlRequestSchema = z.object({
  nombre: z.string(),
  formato: z.string(),
  tipo: z.string(),
});

export type PreSignedUrlRequest = z.infer<typeof PreSignedUrlRequestSchema>;

export const PreSignedUrlResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    upload_url: z.string(),
    file_url: z.string(),
  }),
});

export type PreSignedUrlResponse = z.infer<typeof PreSignedUrlResponseSchema>;