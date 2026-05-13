import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
  nombre: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  numero_documento: z.string().min(1),
  numero_celular: z.string().min(1),
  direccion: z.string().min(1),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export const RolSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  permisos: z.array(z.string()),
});

export type Rol = z.infer<typeof RolSchema>;

export const UserSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  correo: z.string(),
  numero_celular: z.string(),
  direccion: z.string(),
  numero_documento: z.string(),
  estado: z.boolean(),
  rol: RolSchema,
  created_at: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: UserSchema,
    access_token: z.string(),
    refresh_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
  }),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const RefreshResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    token_type: z.string(),
    expires_in: z.number(),
  }),
});

export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;