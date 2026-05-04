import { orchestratorWithAuthClient } from '@/services/api/utilities/instances'
import {
	DeleteWorkspaceAnswerPayload,
	UpdateWorkspace,
	UpdateWorkspaceAnswerPayload,
	Workspace,
	WorkspaceAnswer,
	WorkspaceAnswerDetail,
	WorkspaceAnswerDetailPayload,
} from '@/types/Workspaces'

// Obtener Workspaces
export async function getWorkspaces() {
	const response = await orchestratorWithAuthClient.get<Workspace[]>(
		'/api/workspaces'
	)

	return response.data
}

// Respuestas de Workspace
export async function getWorkspaceAnswers(workspaceId: number) {
	const response = await orchestratorWithAuthClient.get<WorkspaceAnswer[]>(
		`/api/workspaces/${workspaceId}/answers`
	)

	return response.data
}

// Actualizar workspace
export async function updateWorkspace(workspaceId: number) {
	const response = await orchestratorWithAuthClient.put<UpdateWorkspace>(
		`/api/answers/workspace/${workspaceId}`
	)

	return response.data
}

// Detalle respuesta de Workspace
export async function getWorkspaceAnswerDetail(
	params: WorkspaceAnswerDetailPayload
) {
	const { nodeId, workspaceId } = params
	const response = await orchestratorWithAuthClient.get<
		WorkspaceAnswerDetail[]
	>(
		`/api/answers/respNodeIdWrkspc/${workspaceId}/respNodeWatsonNodeId/${nodeId}`
	)

	return response.data
}

// Crear/Modificar respuesta de workspace
export async function updateWorkspaceAnswer(
	payload: UpdateWorkspaceAnswerPayload[]
) {
	const response = await orchestratorWithAuthClient.put<
		UpdateWorkspaceAnswerPayload[]
	>('/api/answers', payload)

	return response.data
}

// Eliminar respuesta de workspace
export async function deleteWorkspaceAnswer(
	payload: DeleteWorkspaceAnswerPayload
) {
	const response =
		await orchestratorWithAuthClient.delete<DeleteWorkspaceAnswerPayload>(
			'/api/answers',
			{
				data: payload,
			}
		)

	return response.data
}
