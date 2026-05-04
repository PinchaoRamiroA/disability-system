import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { SearchInput } from '@/components/SearchInput'
import { Table } from '@/components/Table'
import {
	NormalizedPlantillaRespuesta,
	PlantillaRespuesta,
} from '@/types/Settings/asesor-humano/plantillas-respuesta'
import { Button, Grid } from '@mui/material'
import { RowAction, TableHeader } from '@/types/Table'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	createPlantillaRespuesta,
	deletePlantillaRespuesta,
	getPlantillasRespuesta,
	plantillasRespuestaSelector,
	updatePlantillaRespuesta,
} from '@/store/slices/settings/asesor-humano'
import { useLoading } from '@/hooks/useLoading'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { Delete, Edit } from '@mui/icons-material'
import { PlantillaForm } from './PlantillaForm'
import { DeleteForm } from '@/components/DeleteForm'

// Headers de la tabla
const tableHeaders: TableHeader[] = [
	{
		label: 'Nombre',
		propertyName: 'templateName',
	},
	{
		label: 'Contenido',
		propertyName: 'templateContent',
	},
	{
		label: '',
		propertyName: '',
		type: 'actions',
	},
]

export const PlantillasRespuestaContainer = () => {
	const dispatch = useAppDispatch()
	const { idOrg } = useCompanyAndIdVa()

	// Reducer
	const { getStatus, resource } = useAppSelector(plantillasRespuestaSelector)

	// Loader
	const { startLoading, stopLoading } = useLoading()

	/* States para manejar CRUD de la tabla */
	// Plantilla seleccionada por una acción de la tabla
	const [currentPlantilla, setCurrentPlantilla] =
		useState<NormalizedPlantillaRespuesta | null>(null)
	// Modal crear plantilla
	const [openCreate, setOpenCreate] = useState(false)
	// Modal actualizar plantilla
	const [openUpdate, setOpenUpdate] = useState(false)
	// Modal eliminar plantilla
	const [openDelete, setOpenDelete] = useState(false)

	// Plantillas que se van a mostrar en la tabla
	const [plantillasTable, setPlantillasTable] = useState<
		NormalizedPlantillaRespuesta[]
	>([])

	// Actualiza las plantillas que se van a mostrar en la tabla
	const filterPlantillas = (
		nuevasPlantillas: NormalizedPlantillaRespuesta[]
	) => {
		setPlantillasTable(nuevasPlantillas)
	}

	// Ejecutar action que obtiene plantillas
	useEffect(() => {
		dispatch(getPlantillasRespuesta({ idOrg }))
	}, [dispatch])

	// Obtener plantillas almacenadas en el reducer
	useEffect(() => {
		filterPlantillas(resource)
	}, [resource])

	/**
	 * Abrir modales del CRUD
	 */
	// Crear
	const handleOpenCreate = () => {
		setOpenCreate(true)
	}
	// Actualizar
	const handleOpenUpdate = (plantilla: NormalizedPlantillaRespuesta) => {
		setCurrentPlantilla(plantilla)
		setOpenUpdate(true)
	}
	// Eliminar
	const handleOpenDelete = (plantilla: NormalizedPlantillaRespuesta) => {
		setCurrentPlantilla(plantilla)
		setOpenDelete(true)
	}

	/**
	 * Cerrar modales del CRUD
	 */
	// Crear
	const handleCloseCreate = () => {
		setOpenCreate(false)
	}
	// Actualizar
	const handleCloseUpdate = () => {
		setCurrentPlantilla(null)
		setOpenUpdate(false)
	}
	// Eliminar
	const handleCloseDelete = () => {
		setCurrentPlantilla(null)
		setOpenDelete(false)
	}

	/**
	 * Confirmación de acciones del CRUD
	 */
	// Crear
	const handleConfirmCreate = (plantilla: PlantillaRespuesta) => {
		startLoading()
		dispatch(
			createPlantillaRespuesta({
				idOrg,
				payload: {
					templateContent: plantilla.templateContent,
					templateName: plantilla.templateName,
				},
				handleClose: handleCloseCreate,
			})
		).then(stopLoading)
	}
	// Actualizar
	const handleConfirmUpdate = (plantilla: PlantillaRespuesta) => {
		startLoading()
		dispatch(
			updatePlantillaRespuesta({
				idOrg,
				payload: {
					templateContent: plantilla.templateContent,
					templateName: plantilla.templateName,
					idTemplate: plantilla.idTemplate,
				},
				handleClose: handleCloseUpdate,
			})
		).then(stopLoading)
	}
	// Eliminar
	const handleConfirmDelete = () => {
		if (currentPlantilla) {
			startLoading()
			dispatch(
				deletePlantillaRespuesta({
					idOrg,
					payload: {
						idTemplate: currentPlantilla.idTemplate,
					},
					handleClose: handleCloseDelete,
				})
			).then(stopLoading)
		}
	}

	/**
	 * Acciones de la tabla
	 */
	const buttonActions: RowAction<NormalizedPlantillaRespuesta>[] = [
		{
			action: handleOpenUpdate,
			id: 'handleOpenUpdate',
			label: 'Editar',
			icon: <Edit />,
		},
		{
			action: handleOpenDelete,
			id: 'handleOpenDelete',
			label: 'Eliminar',
			icon: <Delete />,
		},
	]

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			{/* Filtro de búsqueda */}
			<Grid item xs>
				<SearchInput
					filterBy={['templateName', 'templateContent']}
					label="Buscar plantilla"
					listElements={resource}
					onSubmit={filterPlantillas}
				/>
			</Grid>

			{/* Botón crear */}
			<Grid item xs="auto">
				<Button
					color="secondary"
					variant="contained"
					onClick={handleOpenCreate}
				>
					Crear
				</Button>
			</Grid>

			{/* Tabla de datos */}
			<Grid item xs={12}>
				<Table
					data={plantillasTable}
					headers={tableHeaders}
					status={getStatus}
					rowButtonActions={buttonActions}
				/>
			</Grid>

			{/* Modal crear asesor */}
			<PlantillaForm
				handleClose={handleCloseCreate}
				handleConfirm={handleConfirmCreate}
				open={openCreate}
			/>

			{/* Modal actualizar asesor */}
			{currentPlantilla && (
				<PlantillaForm
					handleClose={handleCloseUpdate}
					handleConfirm={handleConfirmUpdate}
					open={openUpdate}
					plantilla={currentPlantilla}
					update
				/>
			)}

			{/* Modal eliminar */}
			{currentPlantilla && (
				<DeleteForm
					handleClose={handleCloseDelete}
					handleConfirm={handleConfirmDelete}
					keyword="Plantilla"
					open={openDelete}
					propertyToDelete={currentPlantilla.templateName}
					femme
				/>
			)}
		</GridContainer>
	)
}
