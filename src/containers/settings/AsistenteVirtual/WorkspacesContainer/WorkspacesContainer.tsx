import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { workspacesSelector } from '@/store/slices/workspaces/workspacesReducer'
import { getWorkspaces } from '@/store/slices/workspaces'
import { WorkspaceContext } from '@/contexts/WorkspaceContext'
import { Workspaces } from '@/components/Settings/Workspaces/Workspaces'
import { WorkspaceAnswers } from '@/components/Settings/Workspaces/WorkspaceAnswers'
import { Workspace, WorkspaceAnswer } from '@/types/Workspaces'
import { useLoading } from '@/hooks/useLoading'
import { WorkspacesSkeleton } from '@/components/Settings/Workspaces/WorkspacesSkeleton'

export const WorkspacesContainer = () => {
	const dispatch = useAppDispatch()

	const { getStatus, resource } = useAppSelector(workspacesSelector)
	const { startLoading, stopLoading } = useLoading()

	const [workspaceAnswer, setWorkspaceAnswer] =
		useState<WorkspaceAnswer | null>(null)
	const [workspace, setWorkspace] = useState<Workspace | null>(null)

	useEffect(() => {
		startLoading()
		dispatch(getWorkspaces()).then(stopLoading)
	}, [dispatch])

	if (getStatus !== 'resolved') {
		return <WorkspacesSkeleton />
	}

	return (
		<WorkspaceContext.Provider
			value={{
				workspace,
				workspaceAnswer,
				setWorkspace,
				setWorkspaceAnswer,
			}}
		>
			{/* Tarjetas con workspaces */}
			{!workspace && <Workspaces workspaces={resource} />}

			{/* Respuestas del workspaces seleccionado */}
			{workspace && <WorkspaceAnswers />}
		</WorkspaceContext.Provider>
	)
}
