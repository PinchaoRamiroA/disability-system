import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { useWorkspaceContext } from '@/hooks/contexts/useWorkspaceContext'
import {
	Box,
	Button,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Tooltip,
	Typography,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	getWorkspaceAnswers,
	updateWorkspace,
	workspaceAnswerSelector,
} from '@/store/slices/workspaces'
import { WorkspaceAnswerDetails } from './WorkspaceAnswerDetails'
import { WorkspaceAnswer } from '@/types/Workspaces'
import { useLoading } from '@/hooks/useLoading'
import { SearchInput } from '@/components/SearchInput'
import { WorkspaceUpdatePopup } from './WorkspaceUpdatePopup'
import { WorkspaceUpdate } from './WorkspaceUpdate'
import { WorkspaceAnswersSkeleton } from './WorkspaceAnswersSkeleton'

export const WorkspaceAnswers = () => {
	const dispatch = useAppDispatch()
	const { workspace, workspaceAnswer, setWorkspace, setWorkspaceAnswer } =
		useWorkspaceContext()
	const { startLoading, stopLoading } = useLoading()
	const { getStatus, resource } = useAppSelector(workspaceAnswerSelector)
	const [answers, setAnswers] = useState<WorkspaceAnswer[]>([])
	const [openUpdate, setOpenUpdate] = useState(false)
	const [successUpdate, setSuccessUpdate] = useState(true)
	const [openUpdateResume, setOpenUpdateResume] = useState(false)

	const handleBack = () => {
		setWorkspace(null)
	}

	const handleClick = (_workspaceAnswer: WorkspaceAnswer) => {
		setWorkspaceAnswer(_workspaceAnswer)
	}

	const handleOpenUpdate = () => setOpenUpdate(true)
	const handleCloseUpdate = (success = true) => {
		stopLoading()

		if (success) {
			callGetWorkspaceAnswers()
		}

		setOpenUpdate(false)
		setSuccessUpdate(success)
		handleOpenUpdateResume()
	}

	const handleOpenUpdateResume = () => setOpenUpdateResume(true)
	const handleCloseUpdateResume = () => setOpenUpdateResume(false)

	const handleUpdateConfirm = () => {
		if (workspace) {
			startLoading()
			dispatch(
				updateWorkspace({ workspaceId: workspace.idWorkSpc })
			).then((res) => {
				// Operación exitosa
				if (res.type === 'settings/workspaces/update/fulfilled') {
					handleCloseUpdate()
				} else {
					handleCloseUpdate(false)
				}
			})
		}
	}

	const callGetWorkspaceAnswers = () => {
		if (workspace) {
			dispatch(getWorkspaceAnswers({ workspaceId: workspace.idWorkSpc }))
		}
	}

	useEffect(() => {
		callGetWorkspaceAnswers()
	}, [workspace])

	useEffect(() => {
		setAnswers(resource)
	}, [resource])

	if (workspaceAnswer) {
		return <WorkspaceAnswerDetails />
	}

	if (getStatus !== 'resolved') {
		return <WorkspaceAnswersSkeleton />
	}

	return (
		<GridContainer>
			<Grid
				item
				xs={12}
				alignItems={'center'}
				display={'flex'}
				justifyContent={'space-between'}
			>
				<Box display={'flex'} alignItems={'center'}>
					<Tooltip title="Volver a Workspaces">
						<IconButton onClick={handleBack}>
							<ArrowBack />
						</IconButton>
					</Tooltip>
					<Typography variant="h5">
						Workspace: {workspace?.descName}
					</Typography>
				</Box>

				<Button variant="contained" onClick={handleOpenUpdate}>
					Actualizar Workspace
				</Button>
			</Grid>

			{/* Búsqueda */}
			<Grid item xs={12}>
				<SearchInput
					filterBy={['nodeDescription', 'nodeLabel']}
					label="Buscar preguntas"
					listElements={resource}
					onSubmit={(data) => setAnswers(data)}
				/>
			</Grid>

			{/* Listado de respuestas */}
			<Grid item xs={12}>
				{resource.length ? (
					<Box
						sx={{
							backgroundColor: 'background.paper',
							overflow: 'auto',
							maxHeight: `calc(100vh - ${56 * 4}px)`,
						}}
					>
						<List>
							{answers.map((answer) => (
								<ListItem
									sx={{
										borderBottom: '1px solid #f1f1f1',
									}}
									disablePadding
									key={answer.nodeId}
								>
									<ListItemButton
										onClick={() => handleClick(answer)}
									>
										<ListItemText
											primary={
												<Typography variant="h6">
													{answer.nodeLabel}
												</Typography>
											}
											secondary={
												<Typography variant="body2">
													{answer.nodeDescription}
												</Typography>
											}
										/>
									</ListItemButton>
								</ListItem>
							))}
						</List>
					</Box>
				) : (
					<Typography>No hay preguntas personalizadas</Typography>
				)}
			</Grid>

			<WorkspaceUpdate
				open={openUpdate}
				onClose={handleCloseUpdate}
				onConfirm={handleUpdateConfirm}
			/>
			<WorkspaceUpdatePopup
				open={openUpdateResume}
				onClose={handleCloseUpdateResume}
				success={successUpdate}
			/>
		</GridContainer>
	)
}
