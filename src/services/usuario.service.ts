import { apiClient } from '@/lib/api/axios'
import type { User } from '@/contracts/auth'

export interface ListarUsuariosParams {
    page?: number
    limit?: number
    search?: string
    estado?: boolean
    id_rol?: number
}

export interface UsuariosListResponse {
    items: User[]
    total: number
    page: number
    limit: number
    total_pages: number
}

/**
 * Obtiene la lista de usuarios/colaboradores registrados
 */
export async function getUsuarios(
    params: ListarUsuariosParams = {}
): Promise<User[]> {
    try {
        const response = await apiClient.get<{
            success: boolean
            data: {
                items: User[]
                total: number
                page: number
                limit: number
                total_pages: number
            }
        }>('/usuarios', {
            params: {
                page: params.page || 1,
                limit: params.limit || 50,
                search: params.search,
                estado: params.estado,
                id_rol: params.id_rol,
            },
        })

        return response.data?.data?.items || []
    } catch {
        return []
    }
}

export const usuarioService = {
    getUsuarios,
}

export default usuarioService
