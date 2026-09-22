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

export type EstadoValidacionDocumento = 'Validado' | 'Rechazado' | 'Incompleto'

export interface ValidarDocumentoPayload {
    estado?: EstadoValidacionDocumento
    comentario?: string
    validado?: boolean
    observaciones?: string
}

export interface GetDocumentosParams {
    id_incapacidad?: number | string
    estado?: string
    tipo?: string
    page?: number
    limit?: number
}

/**
 * Obtiene documentos según filtros desde /documentos
 */
export async function getDocumentos(
    params?: GetDocumentosParams
): Promise<{ items: IncapacidadDocumento[]; total: number }> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: { items?: IncapacidadDocumento[]; total?: number } | IncapacidadDocumento[]
            total?: number
        }>('/documentos', {
            params,
        })

        if (Array.isArray(response.data?.data)) {
            return { items: response.data.data, total: response.data.data.length }
        }
        if (response.data?.data && Array.isArray(response.data.data.items)) {
            return {
                items: response.data.data.items,
                total: response.data.data.total ?? response.data.data.items.length,
            }
        }
        return { items: [], total: 0 }
    } catch {
        return { items: [], total: 0 }
    }
}

/**
 * Valida, rechaza o solicita corrección de un documento (con comentario obligatorio para rechazos o correcciones)
 */
export async function validarDocumento(
    documentoId: number | string,
    data: ValidarDocumentoPayload
): Promise<IncapacidadDocumento> {
    let estado = data.estado
    const comentario = data.comentario ?? data.observaciones ?? ''

    if (!estado && typeof data.validado === 'boolean') {
        estado = data.validado ? 'Validado' : 'Rechazado'
    }

    const payload = {
        estado: estado || 'Validado',
        comentario: comentario,
    }

    const response = await apiClient.patch<{
        success: boolean
        message?: string
        data: IncapacidadDocumento
    }>(`/documentos/${documentoId}/validar`, payload)

    return response.data.data
}

/**
 * Elimina o archiva un documento
 */
export async function deleteDocumento(documentoId: number | string): Promise<void> {
    await apiClient.delete(`/documentos/${documentoId}`)
}

/**
 * Reemplaza un documento existente por un nuevo archivo (sube nueva versión y archiva el anterior)
 */
export async function reemplazarDocumento(
    incapacidadId: number | string,
    oldDocumentoId: number | string,
    newFile: File,
    tipo: string
): Promise<IncapacidadDocumento> {
    const nuevo = await uploadDocumento(incapacidadId, newFile, tipo)
    try {
        await deleteDocumento(oldDocumentoId)
    } catch (e) {
        console.warn('No se pudo archivar el soporte anterior al reemplazar:', e)
    }
    return nuevo
}

export const documentoService = {
    uploadDocumento,
    getIncapacidadDocumentos,
    getDocumentos,
    getDocumentosRequeridos,
    getTiposDocumento,
    getEstadosDocumento,
    validarDocumento,
    deleteDocumento,
    reemplazarDocumento,
}

export default documentoService
