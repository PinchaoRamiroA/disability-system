import { apiClient } from '@/lib/api/axios'
import type {
    Incapacidad,
    IncapacidadListResponse,
    CreateIncapacidadRequest,
    ChangeEstadoRequest,
    Estado,
    TipoIncapacidad,
    Entidad,
} from '@/contracts/incapacidades'

export interface IncapacidadQueryParams {
    page?: number
    limit?: number
    search?: string
    id_estado?: number
    id_tipo?: number
    id_entidad?: number
    origen?: string
    canal_recepcion?: string
    fecha_inicio?: string
    fecha_fin?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
}

/**
 * Obtiene la lista de incapacidades con filtros y paginación
 */
export async function getIncapacidades(
    params: IncapacidadQueryParams = {}
): Promise<IncapacidadListResponse['data']> {
    const cleanParams: Record<string, string | number> = {}
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            cleanParams[key] = value
        }
    })

    const response = await apiClient.get<IncapacidadListResponse>(
        '/incapacidades',
        { params: cleanParams }
    )

    return response.data.data
}

/**
 * Obtiene el detalle de una incapacidad por su ID
 */
export async function getIncapacidadById(id: number | string): Promise<Incapacidad> {
    const response = await apiClient.get<{
        success: boolean
        data: Incapacidad
    }>(`/incapacidades/${id}`)

    return response.data.data
}

/**
 * Obtiene el catálogo de estados de incapacidad
 */
export async function getEstados(): Promise<Estado[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: Estado[]
        }>('/incapacidades/estados')
        return response.data?.data || []
    } catch {
        return []
    }
}

/**
 * Obtiene el catálogo de tipos de incapacidad
 */
export async function getTipos(): Promise<TipoIncapacidad[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: TipoIncapacidad[]
        }>('/incapacidades/tipos')
        return response.data?.data || []
    } catch {
        return []
    }
}

/**
 * Obtiene el catálogo de entidades (EPS / ARL)
 */
export async function getEntidades(): Promise<Entidad[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: Entidad[]
        }>('/incapacidades/entidades')
        return response.data?.data || []
    } catch {
        return []
    }
}

/**
 * Cambia el estado de una incapacidad
 */
export async function cambiarEstado(
    id: number | string,
    data: ChangeEstadoRequest
): Promise<Incapacidad> {
    const response = await apiClient.patch<{
        success: boolean
        message?: string
        data: Incapacidad
    }>(`/incapacidades/${id}/estado`, data)

    return response.data.data
}

/**
 * Crea una nueva incapacidad
 */
export async function crearIncapacidad(
    data: CreateIncapacidadRequest
): Promise<Incapacidad> {
    const response = await apiClient.post<{
        success: boolean
        message?: string
        data: Incapacidad
    }>('/incapacidades', data)

    return response.data.data
}

/**
 * Obtiene los documentos requeridos para un tipo de incapacidad
 */
export async function getDocumentosRequeridos(tipoId: number | string): Promise<string[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: string[]
        }>(`/incapacidades/tipos/${tipoId}/documentos-requeridos`)
        return response.data?.data || []
    } catch {
        return []
    }
}

export const incapacidadService = {
    getIncapacidades,
    getIncapacidadById,
    getEstados,
    getTipos,
    getEntidades,
    cambiarEstado,
    crearIncapacidad,
    getDocumentosRequeridos,
}

export default incapacidadService
