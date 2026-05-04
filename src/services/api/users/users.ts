import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import { ToggleActiveParams, User, UserFilters } from '@/types/users'
// import { users } from './userResponse'

export async function getUsers(filters?: UserFilters) {
	const response = await orchestratorWithAuthClient.get<User[]>(
		'/api/users',
		{
			data: filters,
		}
	)
	return response.data

	//test
	// return new Promise((res) => setTimeout(() => res(users), 2000))
}

export async function createUser({
	user,
	role,
}: {
	user: Partial<User>
	role: number
}) {
	const endpoint = role === 1 ? '/api/users' : '/api/users/company'
	const response = await orchestratorWithAuthClient.post<User>(endpoint, user)

	return response.data
}

export async function putUser(user: Partial<User>) {
	const response = await orchestratorWithAuthClient.put<User>(
		'/api/users',
		user
	)
	return response.data
}

export async function toggleActiveUserApi(user: ToggleActiveParams) {
	const response = await orchestratorWithAuthClient.put<User>(
		`/api/users/${user.idUser}`,
		{ isActive: user.isActive }
	)
	return response.data
}

export async function toggleUnlockUserApi(user: ToggleActiveParams) {
	const response = await orchestratorWithAuthClient.put<User>(
		`/api/users/${user.idUser}`,
		{ isLocked: false }
	)
	return response.data
}

export async function deleteUser({ id, role }: { id: number; role: number }) {
	const endpoint =
		role === 1 ? `/api/users/${id}` : `/api/users/company/${id}`
	const response = await orchestratorWithAuthClient.delete<boolean>(endpoint)

	return response.data
}

export async function updateUserPasswordApi(
	newPassword: string,
	oldPassword: string
) {
	// Realiza una solicitud PUT al endpoint '/api/users/UpdatePasswordByUserName' con la nueva contraseña
	const response = await orchestratorWithAuthClient.put<string>(
		'/api/users/UpdatePasswordByUserName',
		{
			oldPassword: oldPassword,
			newPassword: newPassword,
		}
	)

	// Retorna los datos de la respuesta del servidor
	return response.data
}
