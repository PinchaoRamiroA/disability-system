import { apiClient } from '@/lib/api/axios'
import type {
    Notificacion,
    CreateNotificacionRequest,
} from '@/contracts/notificaciones'

export interface ListarNotificacionesParams {
    id_usuario?: number
    id_incapacidad?: number
    tipo_notificacion?: string
    leida?: boolean
    page?: number
    limit?: number
}

export interface NotificacionesListResponse {
    items: Notificacion[]
    total: number
    page: number
    limit: number
}

/**
 * Consulta el listado de notificaciones del usuario autenticado
 */
export async function getNotificaciones(
    params?: ListarNotificacionesParams
): Promise<NotificacionesListResponse> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: Notificacion[] | {
                items?: Notificacion[]
                data?: Notificacion[]
                total?: number
                page?: number
                limit?: number
            }
            pagination?: {
                total: number
                page: number
                limit: number
            }
            total?: number
            page?: number
            limit?: number
        }>('/notificaciones', { params })

        const resData = response.data

        if (Array.isArray(resData?.data)) {
            return {
                items: resData.data,
                total: resData.pagination?.total ?? resData.total ?? resData.data.length,
                page: resData.pagination?.page ?? resData.page ?? 1,
                limit: resData.pagination?.limit ?? resData.limit ?? 20,
            }
        }

        if (resData?.data && typeof resData.data === 'object') {
            const innerItems = resData.data.items || resData.data.data || []
            return {
                items: innerItems,
                total: resData.data.total ?? resData.pagination?.total ?? innerItems.length,
                page: resData.data.page ?? resData.pagination?.page ?? 1,
                limit: resData.data.limit ?? resData.pagination?.limit ?? 20,
            }
        }

        return { items: [], total: 0, page: 1, limit: 20 }
    } catch {
        return { items: [], total: 0, page: 1, limit: 20 }
    }
}

/**
 * Obtiene el conteo numérico de notificaciones no leídas
 */
export async function getUnreadNotificationsCount(): Promise<number> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: { count?: number; total?: number }
        }>('/notificaciones/no-leidas/count')

        return response.data?.data?.count ?? response.data?.data?.total ?? 0
    } catch {
        return 0
    }
}

/**
 * Marca una notificación individual como leída
 */
export async function markNotificationAsRead(id: number | string): Promise<boolean> {
    try {
        const response = await apiClient.patch<{ success: boolean }>(
            `/notificaciones/${id}/leida`
        )
        return response.data?.success ?? true
    } catch {
        return false
    }
}

/**
 * Marca todas las notificaciones pendientes del usuario como leídas
 */
export async function markAllNotificationsAsRead(): Promise<boolean> {
    try {
        const response = await apiClient.patch<{ success: boolean }>(
            '/notificaciones/marcar-todas-leidas'
        )
        return response.data?.success ?? true
    } catch {
        return false
    }
}

/**
 * Crea una notificación en el sistema (ej. alerta de vencimiento de transcripción)
 */
export async function crearNotificacion(
    data: CreateNotificacionRequest
): Promise<Notificacion | null> {
    try {
        const response = await apiClient.post<{
            success: boolean
            data: Notificacion
        }>('/notificaciones', data)
        return response.data?.data ?? null
    } catch {
        return null
    }
}

export const notificacionService = {
    getNotificaciones,
    getUnreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    crearNotificacion,
}

export default notificacionService
