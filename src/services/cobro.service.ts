import { apiClient } from '@/lib/api/axios'
import type {
    Seguimiento,
    CreateSeguimientoRequest,
    Pago,
} from '@/contracts/cobros'

export interface ListarSeguimientosParams {
    id_incapacidad?: number
    tipo_seguimiento?: string
    page?: number
    limit?: number
}

export interface SeguimientosListResponse {
    items: Seguimiento[]
    total: number
    page: number
    limit: number
}

export interface SeguimientoTipoOption {
    value: string
    label: string
    description: string
    badgeColor: string
    icon: string
}

export const TIPOS_SEGUIMIENTO: SeguimientoTipoOption[] = [
    {
        value: 'Persuasivo',
        label: 'Cobro Persuasivo',
        description: 'Requerimiento formal por mora o falta de pago a EPS/ARL',
        badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
        icon: 'FileText',
    },
    {
        value: 'Jurídico',
        label: 'Cobro Jurídico',
        description: 'Acción legal, demanda o tutela ante Superintendencia de Salud',
        badgeColor: 'border-red-500/30 text-red-400 bg-red-500/10',
        icon: 'Scale',
    },
    {
        value: 'Preventivo',
        label: 'Cobro Preventivo',
        description: 'Avisos tempranos y verificación antes de entrar en mora',
        badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
        icon: 'ShieldAlert',
    },
    {
        value: 'Cobro administrativo',
        label: 'Gestión Administrativa',
        description: 'Mesa de ayuda, radicación documental presencial o subsanación',
        badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
        icon: 'Building2',
    },
    {
        value: 'Normal',
        label: 'Contacto Directo / Llamada',
        description: 'Llamada telefónica, correo electrónico o consulta telefónica',
        badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
        icon: 'PhoneCall',
    },
]

export const RESULTADOS_SEGUIMIENTO = [
    { value: 'Pendiente respuesta', label: 'Pendiente respuesta', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { value: 'En revisión', label: 'En revisión por entidad', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { value: 'Aprobado', label: 'Aprobado / Favorable', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { value: 'Pago programado', label: 'Pago programado / Acuerdo', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { value: 'Pago realizado', label: 'Pago realizado', color: 'text-emerald-300 bg-emerald-600/20 border-emerald-500/30' },
    { value: 'Escalado a jurídica', label: 'Escalado a jurídica', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { value: 'Requiere subsanación', label: 'Requiere subsanación / Glosa', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { value: 'Sin respuesta', label: 'Sin respuesta', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
    { value: 'Rechazado', label: 'Rechazado / Negado', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
]

/**
 * Obtiene la lista de seguimientos de cobro con filtros opcionales
 */
export async function getSeguimientos(
    params?: ListarSeguimientosParams
): Promise<SeguimientosListResponse> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: Seguimiento[] | {
                items?: Seguimiento[]
                data?: Seguimiento[]
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
        }>('/cobros/seguimientos', { params })

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
            const list = resData.data.items ?? resData.data.data ?? []
            return {
                items: Array.isArray(list) ? list : [],
                total: resData.data.total ?? resData.pagination?.total ?? (Array.isArray(list) ? list.length : 0),
                page: resData.data.page ?? resData.pagination?.page ?? 1,
                limit: resData.data.limit ?? resData.pagination?.limit ?? 20,
            }
        }

        return { items: [], total: 0, page: 1, limit: 20 }
    } catch (error) {
        console.error('Error al listar seguimientos:', error)
        throw error
    }
}

/**
 * Obtiene un seguimiento por su ID
 */
export async function getSeguimientoById(
    id: number | string
): Promise<Seguimiento> {
    const response = await apiClient.get<{
        success: boolean
        data: Seguimiento
    }>(`/cobros/seguimientos/${id}`)
    return response.data.data
}

/**
 * Registra un nuevo seguimiento de cobro (persuasivo, jurídico, etc.)
 */
export async function crearSeguimiento(
    payload: CreateSeguimientoRequest
): Promise<Seguimiento> {
    const response = await apiClient.post<{
        success: boolean
        data: Seguimiento
        message?: string
    }>('/cobros/seguimientos', payload)
    return response.data.data
}

/**
 * Actualiza los datos de un seguimiento existente
 */
export async function actualizarSeguimiento(
    id: number | string,
    payload: Partial<CreateSeguimientoRequest>
): Promise<Seguimiento> {
    const response = await apiClient.put<{
        success: boolean
        data: Seguimiento
        message?: string
    }>(`/cobros/seguimientos/${id}`, payload)
    return response.data.data
}

/**
 * Helper para listar pagos
 */
export async function getPagos(params?: {
    id_incapacidad?: number
    id_entidad?: number
    tipo_pago?: string
    estado_pago?: string
    conciliado?: boolean
    page?: number
    limit?: number
}): Promise<{ items: Pago[]; total: number; page: number; limit: number }> {
    const response = await apiClient.get<{
        success: boolean
        data: Pago[] | { items?: Pago[]; total?: number; page?: number; limit?: number }
        pagination?: { total: number; page: number; limit: number }
    }>('/cobros/pagos', { params })

    const resData = response.data
    if (Array.isArray(resData?.data)) {
        return {
            items: resData.data,
            total: resData.pagination?.total ?? resData.data.length,
            page: resData.pagination?.page ?? 1,
            limit: resData.pagination?.limit ?? 20,
        }
    }
    if (resData?.data && typeof resData.data === 'object') {
        const items = resData.data.items ?? []
        return {
            items,
            total: resData.data.total ?? items.length,
            page: resData.data.page ?? 1,
            limit: resData.data.limit ?? 20,
        }
    }
    return { items: [], total: 0, page: 1, limit: 20 }
}

export const TIPOS_PAGO = [
    { value: 'Transferencia bancaria', label: 'Transferencia bancaria', desc: 'Giro electrónico interbancario de la EPS / ARL' },
    { value: 'Consignación', label: 'Consignación bancaria', desc: 'Depósito en ventanilla bancaria con volante' },
    { value: 'Pago total', label: 'Pago total reconocido', desc: 'Liquidación completa al 100% del subsidio reclamado' },
    { value: 'Pago parcial', label: 'Pago parcial / Con glosa', desc: 'Reconocimiento incompleto sujeto a conciliación' },
    { value: 'Reintegro', label: 'Reintegro', desc: 'Reintegro o devolución de fondos de la entidad' },
]

export const ESTADOS_PAGO = [
    { value: 'Pagado', label: 'Pagado', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { value: 'Parcial', label: 'Pago Parcial', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { value: 'Pendiente', label: 'Pendiente de Giro', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { value: 'En proceso', label: 'En proceso contable', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { value: 'Conciliado', label: 'Conciliado', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { value: 'Rechazado', label: 'Rechazado / Glosado', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { value: 'Anulado', label: 'Anulado', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
]

/**
 * Registra un pago de incapacidad (POST /cobros/pagos) y opcionalmente adjunta soporte
 */
export async function crearPago(
    payload: {
        id_incapacidad: number
        id_entidad: number
        tipo_pago: string
        estado_pago?: string
        valor: string
        fecha_pago: string
        descripcion?: string
        periodo_contable?: string
    },
    archivoSoporte?: File
): Promise<Pago> {
    const response = await apiClient.post<{
        success: boolean
        data: Pago
        message?: string
    }>('/cobros/pagos', payload)

    const nuevoPago = response.data.data

    if (archivoSoporte && payload.id_incapacidad) {
        try {
            const { uploadDocumento } = await import('@/services/incapacidad.service')
            await uploadDocumento(payload.id_incapacidad, archivoSoporte, 'soporte_pago')
        } catch (uploadErr) {
            console.warn('Pago registrado pero falló la carga del soporte:', uploadErr)
        }
    }

    return nuevoPago
}

/**
 * Concilia un pago contablemente (PATCH /cobros/pagos/{id}/conciliar)
 */
export async function conciliarPago(
    id: number | string,
    data: {
        conciliado: boolean
        estado_pago?: string
        descripcion?: string
    }
): Promise<Pago> {
    const response = await apiClient.patch<{
        success: boolean
        data: Pago
        message?: string
    }>(`/cobros/pagos/${id}/conciliar`, data)
    return response.data.data
}

/**
 * Elimina un pago del sistema
 */
export async function eliminarPago(id: number | string): Promise<void> {
    await apiClient.delete(`/cobros/pagos/${id}`)
}
