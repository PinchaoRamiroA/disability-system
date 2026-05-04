import { ItemType } from '@/types/Workspaces'
import { EnqueueSnackbar } from '@/types/notistack'

export const getWorkspacesError: EnqueueSnackbar = {
	message: 'Error al cargar Workspaces',
	options: { variant: 'error' },
}

export const getWorkspaceAnswersError: EnqueueSnackbar = {
	message: 'Error al cargar respuestas del Workspace',
	options: { variant: 'error' },
}

export const getWorkspaceAnswerDetailsError: EnqueueSnackbar = {
	message: 'Error al obtener detalles',
	options: { variant: 'error' },
}

export const createWorkspaceAnswer: EnqueueSnackbar = {
	message: 'Respuesta creada',
	options: { variant: 'success' },
}

export const updateWorkspaceError: EnqueueSnackbar = {
	message: 'Error al actualizar Workspace',
	options: { variant: 'error' },
}

export const updateWorkspaceAnswer: EnqueueSnackbar = {
	message: 'Respuesta actualizada',
	options: { variant: 'success' },
}

export const createWorkspaceAnswerError: EnqueueSnackbar = {
	message: 'Error al crear respuesta',
	options: { variant: 'error' },
}

export const updateWorkspaceAnswerError: EnqueueSnackbar = {
	message: 'Error al actualizar respuesta',
	options: { variant: 'error' },
}

export const deleteWorkspaceError: EnqueueSnackbar = {
	message: 'Error al actualizar respuesta',
	options: { variant: 'error' },
}

export const itemTypes: ItemType[] = [
	{
		label: 'Texto',
		value: 1,
	},
	{
		label: 'Link',
		value: 2,
	},
	{
		label: 'Imagen',
		value: 3,
	},
	{
		label: 'Documento',
		value: 4,
	},
	{
		label: 'Video',
		value: 5,
	},
]
