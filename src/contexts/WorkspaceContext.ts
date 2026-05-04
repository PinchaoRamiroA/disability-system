import React from 'react'
import { Workspace, WorkspaceAnswer } from '@/types/Workspaces'

export type WorkspaceContextType = {
	workspace: Workspace | null
	workspaceAnswer: WorkspaceAnswer | null
	setWorkspace: (value: Workspace | null) => void
	setWorkspaceAnswer: (value: WorkspaceAnswer | null) => void
}

export const WorkspaceContext =
	React.createContext<WorkspaceContextType | null>(null)
