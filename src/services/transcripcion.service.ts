import { apiClient } from '@/lib/api/axios'
import {
    TranscripcionPendienteItem,
    TranscribirRequest,
    IncapacidadDocumento,
} from '@/contracts/incapacidades'
import { uploadDocumento } from '@/services/incapacidad.service'

export interface TranscripcionesListResponse {
    items: TranscripcionPendienteItem[]
    total: number
    page: number
    limit: number
}

export interface ListarTranscripcionesParams {
    estado?: string
    page?: number
    limit?: number
}

/**
 * Obtiene la lista de incapacidades en trámite de transcripción / radicación ante EPS/ARL
 */
export async function getTranscripcionesPendientes(
    params?: ListarTranscripcionesParams
): Promise<TranscripcionesListResponse> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: TranscripcionPendienteItem[] | {
                items?: TranscripcionPendienteItem[]
                data?: TranscripcionPendienteItem[]
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
        }>('/incapacidades/transcripciones/pendientes', { params })

        const resData = response.data

        // Verificar si la respuesta viene con paginación estándar del backend
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
 * Marca el trámite de transcripción como 'en_proceso' (iniciado trámite ante la EPS/ARL)
 */
export async function marcarTranscripcionEnProceso(
    id: number | string
): Promise<{ id_incapacidad: number; estado_transcripcion: string }> {
    const response = await apiClient.patch<{
        success: boolean
        data: { id_incapacidad: number; estado_transcripcion: string }
        message?: string
    }>(`/incapacidades/${id}/transcripcion`, {
        estado: 'en_proceso',
        estado_transcripcion: 'en_proceso',
    })

    return response.data.data
}

/**
 * Registra la radicación y transcripción oficial de la incapacidad ante la EPS/ARL
 */
export async function transcribirIncapacidad(
    id: number | string,
    data: TranscribirRequest
): Promise<{
    id_incapacidad: number
    estado_transcripcion: string
    fecha_transcripcion?: string
    observaciones?: string
}> {
    const payload = {
        numero_radicado: data.numero_radicado,
        fecha_transcripcion: data.fecha_transcripcion,
        observaciones: data.observaciones,
        observaciones_transcripcion: data.observaciones
            ? `Radicado: ${data.numero_radicado} | ${data.observaciones}`
            : `Radicado: ${data.numero_radicado}`,
    }

    const response = await apiClient.post<{
        success: boolean
        data: {
            id_incapacidad: number
            estado_transcripcion: string
            fecha_transcripcion?: string
            observaciones?: string
        }
        message?: string
    }>(`/incapacidades/${id}/transcribir`, payload)

    return response.data.data
}

/**
 * Carga el soporte o comprobante de radicado ante la EPS/ARL
 */
export async function uploadEvidenciaRadicacion(
    incapacidadId: number | string,
    file: File
): Promise<IncapacidadDocumento> {
    return uploadDocumento(incapacidadId, file, 'evidencia_radicacion')
}

export const transcripcionService = {
    getTranscripcionesPendientes,
    marcarTranscripcionEnProceso,
    transcribirIncapacidad,
    uploadEvidenciaRadicacion,
}

export default transcripcionService
