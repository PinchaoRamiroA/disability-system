import { apiClient } from '@/lib/api/axios'
import type { IncapacidadDocumento } from '@/contracts/incapacidades'
import type { TipoDocumento, EstadoDocumento } from '@/contracts/catalogos'

export interface ListDocumentosFilters {
    estado?: string
    tipo?: string
    page?: number
    limit?: number
}

/**
 * Carga un documento adjunto a una incapacidad (PDF, JPG, PNG hasta 10MB)
 */
export async function uploadDocumento(
    incapacidadId: number | string,
    file: File,
    tipo: string
): Promise<IncapacidadDocumento> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('tipo', tipo)

    const response = await apiClient.post<{
        success: boolean
        message?: string
        data: IncapacidadDocumento
    }>(`/incapacidades/${incapacidadId}/documentos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })

    return response.data.data
}

/**
 * Obtiene la lista de documentos asociados a una incapacidad
 */
export async function getIncapacidadDocumentos(
    incapacidadId: number | string,
    filters?: ListDocumentosFilters
): Promise<IncapacidadDocumento[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: { items?: IncapacidadDocumento[] } | IncapacidadDocumento[]
        }>(`/incapacidades/${incapacidadId}/documentos`, {
            params: filters,
        })

        if (Array.isArray(response.data?.data)) {
            return response.data.data
        }
        if (response.data?.data && Array.isArray(response.data.data.items)) {
            return response.data.data.items
        }
        return []
    } catch {
        return []
    }
}

/**
 * Obtiene los documentos requeridos según el tipo de incapacidad
 */
export async function getDocumentosRequeridos(
    tipoId: number | string
): Promise<TipoDocumento[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: TipoDocumento[]
        }>(`/incapacidades/tipos/${tipoId}/documentos-requeridos`)

        return Array.isArray(response.data?.data) ? response.data.data : []
    } catch {
        return []
    }
}

/**
 * Obtiene el catálogo de tipos de documentos disponibles
 */
export async function getTiposDocumento(): Promise<TipoDocumento[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: TipoDocumento[]
        }>('/catalogos/tipos-documento')

        return Array.isArray(response.data?.data) ? response.data.data : []
    } catch {
        return []
    }
}

/**
 * Obtiene el catálogo de estados de documento
 */
export async function getEstadosDocumento(): Promise<EstadoDocumento[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: EstadoDocumento[]
        }>('/catalogos/estados-documento')

        return Array.isArray(response.data?.data) ? response.data.data : []
    } catch {
        return []
    }
}

/**
 * Valida o rechaza un documento con observaciones
 */
export async function validarDocumento(
    documentoId: number | string,
    data: { validado: boolean; observaciones?: string }
): Promise<IncapacidadDocumento> {
    const response = await apiClient.patch<{
        success: boolean
        message?: string
        data: IncapacidadDocumento
    }>(`/documentos/${documentoId}/validar`, data)

    return response.data.data
}

/**
 * Elimina un documento
 */
export async function deleteDocumento(documentoId: number | string): Promise<void> {
    await apiClient.delete(`/documentos/${documentoId}`)
}

export const documentoService = {
    uploadDocumento,
    getIncapacidadDocumentos,
    getDocumentosRequeridos,
    getTiposDocumento,
    getEstadosDocumento,
    validarDocumento,
    deleteDocumento,
}

export default documentoService
