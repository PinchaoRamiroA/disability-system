import { apiClient } from '@/lib/api/axios'
import type { Pago } from '@/contracts/cobros'
import { cambiarEstado } from '@/services/incapacidad.service'
import { crearSeguimiento } from '@/services/cobro.service'

export interface EstadisticasCarteraData {
    total_incapacidades: number
    incapacidades_activas: number
    total_valor_cartera: string
    total_valor_cobrado: string
    total_valor_pendiente: string
    pagos_pendientes: number
    pagos_vencidos: number
    seguimientos_pendientes: number
}

export interface ResumenEntidadData {
    id_entidad: number
    nombre: string
    tipo: string
    cantidad_inc: number
    valor_total: string
    valor_cobrado: string
    valor_pendiente: string
    pagos_pendientes: number
    pagos_vencidos: number
}

export interface AlertaVencimientoData {
    id_incapacidad: number
    incapacidad: {
        id: number
        titulo: string
    }
    nombre_entidad: string
    tipo_alerta: string
    fecha_vencimiento: string
    dias_restantes: number
    prioridad: string
    mensaje: string
}

export interface CasoJuridicoItem {
    id_incapacidad: number
    titulo: string
    colaborador: string
    entidad: string
    tipo_entidad: string
    tipo_incapacidad: string
    fecha_inicio: string
    fecha_fin: string
    dias_mora: number
    valor_adeudado: string
    estado_juridico: string
    ultima_actuacion?: {
        fecha: string
        descripcion: string
        resultado?: string
    }
}

export interface EscalarJuridicoPayload {
    id_incapacidad: number
    tipo_accion_legal: string
    radicado_juzgado_super?: string
    motivo: string
    abogado_asignado?: string
    resultado_inicial?: string
}

/**
 * Obtiene estadísticas consolidadas de cartera
 */
export async function getEstadisticasCartera(): Promise<EstadisticasCarteraData> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: Record<string, unknown>
        }>('/cartera/estadisticas')

        const d = response.data?.data || {}

        return {
            total_incapacidades: Number(d.TotalIncapacidades ?? d.total_incapacidades ?? 0),
            incapacidades_activas: Number(d.IncapacidadesActivas ?? d.incapacidades_activas ?? 0),
            total_valor_cartera: String(d.TotalValorCartera ?? d.total_valor_cartera ?? '0'),
            total_valor_cobrado: String(d.TotalValorCobrado ?? d.total_valor_cobrado ?? '0'),
            total_valor_pendiente: String(d.TotalValorPendiente ?? d.total_valor_pendiente ?? '0'),
            pagos_pendientes: Number(d.PagosPendientes ?? d.pagos_pendientes ?? 0),
            pagos_vencidos: Number(d.PagosVencidos ?? d.pagos_vencidos ?? 0),
            seguimientos_pendientes: Number(d.SeguimientosPendientes ?? d.seguimientos_pendientes ?? 0),
        }
    } catch (error) {
        console.error('Error al obtener estadísticas de cartera:', error)
        return {
            total_incapacidades: 0,
            incapacidades_activas: 0,
            total_valor_cartera: '0',
            total_valor_cobrado: '0',
            total_valor_pendiente: '0',
            pagos_pendientes: 0,
            pagos_vencidos: 0,
            seguimientos_pendientes: 0,
        }
    }
}

/**
 * Obtiene el resumen de cartera agrupado por entidad pagadora (EPS / ARL)
 */
export async function getResumenEntidad(): Promise<ResumenEntidadData[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: Array<Record<string, unknown>>
        }>('/cartera/resumen-entidad')

        const list = Array.isArray(response.data?.data) ? response.data.data : []

        return list.map((item) => ({
            id_entidad: Number(item.IDEntidad ?? item.id_entidad ?? 0),
            nombre: String(item.Nombre ?? item.nombre ?? 'Entidad'),
            tipo: String(item.Tipo ?? item.tipo ?? 'EPS'),
            cantidad_inc: Number(item.CantidadINC ?? item.cantidad_inc ?? 0),
            valor_total: String(item.ValorTotal ?? item.valor_total ?? '0'),
            valor_cobrado: String(item.ValorCobrado ?? item.valor_cobrado ?? '0'),
            valor_pendiente: String(item.ValorPendiente ?? item.valor_pendiente ?? '0'),
            pagos_pendientes: Number(item.PagosPendientes ?? item.pagos_pendientes ?? 0),
            pagos_vencidos: Number(item.PagosVencidos ?? item.pagos_vencidos ?? 0),
        }))
    } catch (error) {
        console.error('Error al obtener resumen por entidad:', error)
        return []
    }
}

/**
 * Obtiene las alertas de vencimiento de cartera
 */
export async function getAlertasVencimiento(
    diasMinimos: number = 0
): Promise<AlertaVencimientoData[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: AlertaVencimientoData[]
        }>('/cartera/alertas-vencimiento', { params: { dias_minimos: diasMinimos } })

        return Array.isArray(response.data?.data) ? response.data.data : []
    } catch (error) {
        console.error('Error al obtener alertas de cartera:', error)
        return []
    }
}

/**
 * Obtiene los pagos en estado de cartera vencida
 */
export async function getCarteraVencida(): Promise<Pago[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: Pago[]
        }>('/cartera/vencida')

        return Array.isArray(response.data?.data) ? response.data.data : []
    } catch (error) {
        console.error('Error al obtener cartera vencida:', error)
        return []
    }
}

/**
 * Consulta el próximo estado sugerido para una acción en la incapacidad
 */
export async function getProximoEstado(
    idIncapacidad: number | string,
    accion: string
): Promise<string> {
    const response = await apiClient.get<{
        success: boolean
        data: { proximo_estado: string }
    }>(`/cartera/incapacidades/${idIncapacidad}/proximo-estado`, {
        params: { accion },
    })

    return response.data?.data?.proximo_estado || ''
}

/**
 * Flujo de escalación jurídica:
 * 1. Cambia el estado de la incapacidad a "Cobro jurídico" (id_estado: 15)
 * 2. Registra el seguimiento de tipo "Jurídico" con los detalles legales
 */
export async function ejecutarEscalacionJuridica(
    payload: EscalarJuridicoPayload
): Promise<void> {
    const notaLegal = `[ESCALACIÓN JURÍDICA: ${payload.tipo_accion_legal}] ${
        payload.radicado_juzgado_super
            ? `Radicado/Expediente: ${payload.radicado_juzgado_super}. `
            : ''
    }${payload.abogado_asignado ? `Apoderado: ${payload.abogado_asignado}. ` : ''}${payload.motivo}`

    // 1. Cambiar estado de la incapacidad a Cobro jurídico
    await cambiarEstado(payload.id_incapacidad, {
        id_estado: 15, // Cobro jurídico
        observaciones: notaLegal,
    })

    // 2. Registrar el seguimiento de cobro jurídico
    await crearSeguimiento({
        id_incapacidad: payload.id_incapacidad,
        tipo_seguimiento: 'Jurídico',
        descripcion: notaLegal,
        resultado: payload.resultado_inicial || 'En revisión',
        fecha_contacto: new Date().toISOString().split('T')[0],
        fecha: new Date().toISOString().split('T')[0],
    })
}
