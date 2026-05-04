import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { useWorkspaceContext } from '@/hooks/contexts/useWorkspaceContext'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	createWorkspaceAnswer,
	deleteWorkspaceAnswer,
	getWorkspaceAnswerDetail,
	updateWorkspaceAnswer,
	workspaceAnswerDetailSelector,
} from '@/store/slices/workspaces'
import {
	ArrowBack,
	Delete,
	Link,
	Edit,
	FileOpen,
	Image,
	TextSnippet,
	Videocam,
} from '@mui/icons-material'
import {
	Autocomplete,
	Box,
	Button,
	Grid,
	IconButton,
	Paper,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import { ItemType, WorkspaceAnswerDetail } from '@/types/Workspaces'
import { itemTypes } from '@/utils/constants/snackbars/settings/workspaces'
import { WorkspaceEdit } from './WorkspaceEdit'
import { useLoading } from '@/hooks/useLoading'
import { WorkspaceDelete } from './WorkspaceDelete'
import { validateType } from './validate'
import { WorkspaceWarning } from './WorkspaceWarning'
import { WorkspaceAnswerDetailsSkeleton } from './WorkspaceAnswerDetailsSkeleton'

const RenderItemType = (itemType: number, url: string) => {
	if (itemType === 1) {
		return (
			<>
				<TextSnippet />
				<Typography>Texto</Typography>
			</>
		)
	} else {
		return (
			<a href={url} target="_blank" rel="noreferrer">
				{itemType === 2 ? (
					<>
						<Link />
						<Typography>Abrir link</Typography>
					</>
				) : itemType === 3 ? (
					<>
						<Image />
						<Typography>Ver imagen</Typography>
					</>
				) : itemType === 4 ? (
					<>
						<FileOpen />
						<Typography>Ir al documento</Typography>
					</>
				) : itemType === 5 ? (
					<>
						<Videocam />
						<Typography>Ver video</Typography>
					</>
				) : null}
			</a>
		)
	}
}

export const WorkspaceAnswerDetails = () => {
	const dispatch = useAppDispatch()

	const { workspaceAnswer, setWorkspaceAnswer } = useWorkspaceContext()
	const { getStatus, resource } = useAppSelector(
		workspaceAnswerDetailSelector
	)
	const { startLoading, stopLoading } = useLoading()

	// Agregar elemento
	const [itemTypeValue, setItemTypeValue] = useState<ItemType | null>(
		itemTypes[0]
	)
	const [answerValue, setAnswerValue] = useState<string>('')
	const [enableEditing, setEnableEditing] = useState(0)
	const [editedValue, setEditedValue] = useState('') // Guarda el valor modificado

	// State para abrir/cerrar formularios
	const [openUpdate, setOpenUpdate] = useState(false)
	const [openDelete, setOpenDelete] = useState(false)
	const [openWarning, setOpenWarning] = useState(false)
	const [detailToUpdate, setDetailToUpdate] =
		useState<WorkspaceAnswerDetail | null>(null)

	// Volver al listado de respuestas
	const handleBack = () => {
		setWorkspaceAnswer(null)
	}

	// Abrir formulario de edición
	const handleOpenUpdate = (detail: WorkspaceAnswerDetail) => {
		disableRowEditing()
		setDetailToUpdate(detail)
		setOpenUpdate(true)
	}

	// Cerrar formulario de edición
	const handleCloseUpdate = () => {
		stopLoading()
		setOpenUpdate(false)
		setDetailToUpdate(null)
	}

	// Confirmar actualización
	const handleUpdateConfirm = (itemType: number, answer: string) => {
		if (detailToUpdate) {
			startLoading()
			dispatch(
				updateWorkspaceAnswer([
					{
						...detailToUpdate,
						elementTypesIdType: itemType,
						elementValue: answer,
					},
				])
			).then(handleCloseUpdate)
		}
	}

	// Abrir confirmación de eliminación
	const handleOpenDelete = (detail: WorkspaceAnswerDetail) => {
		disableRowEditing()
		setDetailToUpdate(detail)
		setOpenDelete(true)
	}

	// Cerrar confirmación de eliminación
	const handleCloseDelete = () => {
		stopLoading()
		setDetailToUpdate(null)
		setOpenDelete(false)
	}

	// Confirmar eliminación
	const handleDeleteConfirm = () => {
		if (detailToUpdate) {
			const {
				elementOrderPos,
				idResponse,
				idVa,
				respNodeIdWrkspc,
				respNodeWatsonNodeId,
			} = detailToUpdate
			startLoading()
			dispatch(
				deleteWorkspaceAnswer({
					elementOrderPos,
					idResponse,
					idVa,
					respNodeIdWrkspc,
					respNodeWatsonNodeId,
				})
			).then(() => handleCloseDelete())
		}
	}

	// Validar url antes de crear una respuesta
	const handleCreate = () => {
		const answer = answerValue.trim()
		if (itemTypeValue && answer.length > 0 && resource.length > 0) {
			if (validateType(itemTypeValue.value, answer)) {
				setOpenWarning(true)
			} else {
				handleCreateConfirm()
			}
		}
	}

	// Agregar nuevo elemento
	const handleCreateConfirm = () => {
		const answer = answerValue.trim()
		if (itemTypeValue && answer.length > 0 && resource.length > 0) {
			const {
				elementOrderPos,
				idResponse,
				respNodeIdWrkspc,
				respNodeWatsonNodeId,
				idVa,
			} = resource[resource.length - 1]
			startLoading()
			setOpenWarning(false)

			dispatch(
				createWorkspaceAnswer([
					{
						elementOrderPos: elementOrderPos + 1,
						elementTypesIdType: itemTypeValue.value,
						elementValue: answer,
						idResponse,
						respNodeIdWrkspc,
						respNodeWatsonNodeId,
						idVa,
					},
				])
			).then(() => stopLoading())
			setItemTypeValue(itemTypes[0])
			setAnswerValue('')
		}
	}

	// Editar registro desde tabla
	const handleRowEditing = (detail: WorkspaceAnswerDetail) => {
		// No hacer nada si ya se está editando
		if (enableEditing === detail.elementOrderPos) {
			return
		}
		setEnableEditing(detail.elementOrderPos)
		setEditedValue(detail.elementValue)
	}

	// Deshabilitar modo de edición desde tabla
	const disableRowEditing = () => {
		setEnableEditing(0)
		setEditedValue('')
	}

	// Manejar cancelación de edición con ESC después de actualizar con Enter
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') setEnableEditing(0) // Cancela la edición
		if (e.key === 'Enter') handleSave() // Guarda con Enter
	}

	// Guardar cambios y salir del modo edición
	const handleSave = () => {
		const detail = resource.find((r) => r.elementOrderPos === enableEditing)
		if (detail) {
			startLoading()
			dispatch(
				updateWorkspaceAnswer([
					{ ...detail, elementValue: editedValue },
				])
			).then(() => {
				stopLoading()
				setEnableEditing(0) // Salir del modo edición
			})
		}
	}

	useEffect(() => {
		if (workspaceAnswer) {
			dispatch(
				getWorkspaceAnswerDetail({
					nodeId: workspaceAnswer.nodeId,
					workspaceId: workspaceAnswer.workspace,
				})
			)
		}
	}, [workspaceAnswer])

	if (getStatus !== 'resolved') {
		return <WorkspaceAnswerDetailsSkeleton />
	}

	return (
		<Box>
			<GridContainer>
				<Grid item xs={12} alignItems={'center'} display={'flex'}>
					<Tooltip title="Volver a Workspaces">
						<IconButton onClick={handleBack}>
							<ArrowBack />
						</IconButton>
					</Tooltip>
					<Typography variant="h5">
						{workspaceAnswer?.nodeLabel}
					</Typography>
				</Grid>

				<Grid item xs={12}>
					<Paper elevation={0}>
						<Box p={2}>
							<Typography>
								Agrega tus respuestas, recomendamos 90
								caracteres por respuesta.
							</Typography>
						</Box>
					</Paper>
				</Grid>

				<Grid item xs={12}>
					<Paper>
						{resource.map((detail) => (
							<Grid
								container
								key={detail.elementOrderPos}
								sx={{
									':hover': {
										backgroundColor: 'rgba(0, 0, 0, 0.04)',
									},
									borderBottom: '1px solid #f1f1f1',
								}}
								alignItems={'center'}
								p={2}
								gap={2}
							>
								<Grid
									item
									xs="auto"
									sm={2}
									md={1}
									textAlign={'center'}
									justifyContent={'flex-start'}
								>
									{RenderItemType(
										detail.elementTypesIdType,
										detail.elementValue
									)}
								</Grid>
								<Grid
									item
									xs
									component={Box}
									sx={{
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
									onClick={() => handleRowEditing(detail)}
								>
									{enableEditing ===
									detail.elementOrderPos ? (
										<TextField
											value={editedValue}
											fullWidth
											multiline
											onChange={(e) =>
												setEditedValue(e.target.value)
											}
											onKeyDown={handleKeyDown}
											autoFocus
											helperText="Presiona Esc para salir y Enter para guardar"
										/>
									) : (
										<Tooltip title="Haz click para editar">
											<Typography>
												{detail.elementValue}
											</Typography>
										</Tooltip>
									)}
								</Grid>
								<Grid item xs="auto">
									<IconButton
										onClick={() => handleOpenUpdate(detail)}
									>
										<Edit />
									</IconButton>
									<IconButton
										onClick={() => handleOpenDelete(detail)}
									>
										<Delete />
									</IconButton>
								</Grid>
							</Grid>
						))}
					</Paper>
				</Grid>

				<Grid item xs={12} container gap={1}>
					<Grid item xs={12} sm>
						<Paper elevation={0}>
							<Autocomplete
								options={itemTypes}
								value={itemTypeValue}
								onChange={(_, value) => setItemTypeValue(value)}
								renderInput={(props) => (
									<TextField
										{...props}
										placeholder="Tipo"
										size="small"
									/>
								)}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12} sm>
						<Paper elevation={0}>
							<TextField
								fullWidth
								size="small"
								placeholder={
									itemTypeValue?.value === 1
										? 'Escribe tu respuesta'
										: 'Ingresa la URL'
								}
								value={answerValue}
								onChange={(e) => setAnswerValue(e.target.value)}
								multiline={itemTypeValue?.value === 1}
								maxRows={4}
							/>
						</Paper>
					</Grid>
					<Grid item xs="auto">
						<Button variant="contained" onClick={handleCreate}>
							Agregar
						</Button>
					</Grid>
				</Grid>
			</GridContainer>

			{/* Formulario de edición */}
			{detailToUpdate && (
				<>
					<WorkspaceEdit
						detail={detailToUpdate}
						handleClose={handleCloseUpdate}
						handleConfirm={handleUpdateConfirm}
						open={openUpdate}
					/>

					<WorkspaceDelete
						handleClose={handleCloseDelete}
						handleConfirm={handleDeleteConfirm}
						open={openDelete}
					/>
				</>
			)}

			<WorkspaceWarning
				handleClose={() => setOpenWarning(false)}
				handleConfirm={handleCreateConfirm}
				open={openWarning}
			/>
		</Box>
	)
}
