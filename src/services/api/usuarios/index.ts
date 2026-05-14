import { AxiosResponse } from 'axios'
import { orchestratorWithAuthClient } from '../utilities/instances'
import { ApiResponse, PaginatedData, AuthUser } from '@/types/api'

export interface UserFilters {
	page?: number
	limit?: number
	search?: string
	id_rol?: number
	estado?: boolean
}

export interface UpdateUserRequest {
	nombre?: string
	numero_celular?: string
	direccion?: string
	id_rol?: number
	estado?: boolean
}

export interface RegisterUserRequest {
	nombre: string
	email: string
	password: string
	numero_documento: string
	numero_celular: string
	direccion: string
	id_rol: number
}

export const getUsers = async (
	filters: UserFilters = {}
): Promise<AxiosResponse<ApiResponse<PaginatedData<AuthUser>>>> => {
	const params = new URLSearchParams()
	if (filters.page) params.append('page', filters.page.toString())
	if (filters.limit) params.append('limit', filters.limit.toString())
	if (filters.search) params.append('search', filters.search)
	if (filters.id_rol) params.append('id_rol', filters.id_rol.toString())
	if (filters.estado !== undefined)
		params.append('estado', filters.estado.toString())

	return orchestratorWithAuthClient.get(`/usuarios?${params.toString()}`)
}

export const getUserById = async (
	id: number
): Promise<AxiosResponse<ApiResponse<AuthUser>>> => {
	return orchestratorWithAuthClient.get(`/usuarios/${id}`)
}

export const updateUser = async (
    id: number,
    data: UpdateUserRequest
): Promise<AxiosResponse<ApiResponse<AuthUser>>> => {
    return orchestratorWithAuthClient.put(`/usuarios/${id}`, data)
}

export const registerUser = async (
	data: RegisterUserRequest
): Promise<AxiosResponse<ApiResponse<AuthUser>>> => {
	return orchestratorWithAuthClient.post(`/usuarios`, data)
}

export const deleteUser = async (
	id: number
): Promise<AxiosResponse<ApiResponse<void>>> => {
	return orchestratorWithAuthClient.delete(`/usuarios/${id}`)
}

export const changeUserStatus = async (
	id: number,
	estado: boolean
): Promise<AxiosResponse<ApiResponse<AuthUser>>> => {
	return orchestratorWithAuthClient.patch(`/usuarios/${id}/estado`, { estado })
}

export const getRoles = async (): Promise<
	AxiosResponse<ApiResponse<{ items: { id_rol: number; nombre: string; permisos: string[] }[] }>>
> => {
	return orchestratorWithAuthClient.get('/roles')
}