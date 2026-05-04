import React, { useState, useEffect } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Button, Grid } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { useLoading } from '@/hooks/useLoading'
import { SearchInput } from '@/components/SearchInput'
import { Table } from '@/components/Table'
import {
	causalesFinSelector,
	createCausalFin,
	deleteCausalFin,
	getCausalesFin,
	updateCausalFin,
} from '@/store/slices/causales-fin'
import { Causal } from '@/types/Causales'
import { RowAction, TableHeader } from '@/types/Table'
import { Delete, Edit } from '@mui/icons-material'
import { CausalForm } from '@/components/Causales/CausalForm'
import { DeleteForm } from '@/components/DeleteForm'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'

const tableHeaders: TableHeader[] = [
	{ propertyName: 'activo', label: 'Activo', type: 'switch' },
	{ propertyName: 'nombre', label: 'Nombre' },
	{ propertyName: 'descripcion', label: 'Descripción' },
	{ propertyName: 'fechaCreacion', label: 'Fecha de creación' },
	{ propertyName: 'fechaActualizacion', label: 'Última actualización' },
	{ propertyName: 'modifiedBy', label: 'Modificado por' },
	{
		propertyName: 'actions',
		label: '',
		align: 'right',
		type: 'actions',
	},
]

export const CausalesFinContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()

	// Selector de causales
	const { resource, getStatus } = useAppSelector(causalesFinSelector)
	const { idOrg } = useCompanyAndIdVa()

	// Causales filtrados
	const [causalesFiltrados, setCausalesFiltrados] = useState<Causal[]>([])

	// Causal seleccionado para una acción en la tabla
	const [currentCausal, setCurrentCausal] = useState<Causal | null>(null)

	// Modal crear causal
	const [openCreate, setOpenCreate] = useState(false)
	// Modal actualizar causal
	const [openUpdate, setOpenUpdate] = useState(false)
	// Modal eliminar causal
	const [openDelete, setOpenDelete] = useState(false)

	// Filtrar causales
	const filterCausales = (result: Causal[]) => {
		setCausalesFiltrados(result)
	}

	// Cerrar modal de creación
	const handleCloseCreate = () => {
		setOpenCreate(false)
		setCurrentCausal(null)
	}

	/**
	 * Switch Activar/Desactivar
	 */
	const handleToggleActive = (param: Causal) => {
		startLoading()
		const { activo, descripcion, idCausal, nombre } = param

		dispatch(
			updateCausalFin({
				causal: {
					activo: !activo,
					descripcion,
					idCausal,
					nombre,
				},
			})
		).then(stopLoading)
	}

	// Abrir modal de edición
	const handleOpenUpdate = (causal: Causal) => {
		setOpenUpdate(true)
		setCurrentCausal(causal)
	}

	// Cerrar modal de edición
	const handleCloseUpdate = () => {
		setOpenUpdate(false)
		setCurrentCausal(null)
	}

	// Abrir modal de eliminación
	const handleOpenDelete = (causal: Causal) => {
		setOpenDelete(true)
		setCurrentCausal(causal)
	}

	// Cerrar modal de eliminación
	const handleCloseDelete = () => {
		setOpenDelete(false)
		setCurrentCausal(null)
	}

	// Confirmar creación
	const handleConfirmCreate = (causal: Partial<Causal>) => {
		startLoading()

		const { descripcion, nombre } = causal
		dispatch(
			createCausalFin({
				causal: { descripcion, nombre },
				handleCloseCreate,
			})
		).then(stopLoading)
	}

	const handleConfirmUpdate = (causal: Partial<Causal>) => {
		startLoading()

		dispatch(
			updateCausalFin({
				causal: {
					descripcion: causal.descripcion,
					idCausal: currentCausal?.idCausal,
					nombre: causal.nombre,
				},
				handleCloseUpdate,
			})
		).then(stopLoading)
	}

	const handleConfirmDelete = () => {
		if (currentCausal) {
			startLoading()

			dispatch(
				deleteCausalFin({
					codigoCausalFinalizacion: currentCausal.idCausal,
				})
			).then(stopLoading)

			handleCloseDelete()
		}
	}

	const buttonActions: RowAction<Causal>[] = [
		{
			action: handleOpenUpdate,
			id: 'handleOpenUpdate',
			label: 'Actualizar',
			icon: <Edit />,
			canBeDisabled: true,
		},
		{
			action: handleOpenDelete,
			id: 'handleOpenDelete',
			label: 'Eliminar',
			icon: <Delete />,
		},
	]

	// Obtener causales
	useEffect(() => {
		if (idOrg) {
			dispatch(getCausalesFin({ idOrg }))
		}
	}, [idOrg, dispatch])

	// Setear causales filtrados con todos los causales
	useEffect(() => {
		setCausalesFiltrados(resource)
	}, [resource])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<>
			<GridContainer>
				{/* Filtro de búsqueda */}
				<Grid item xs>
					<SearchInput
						filterBy={[
							'nombre',
							'descripcion',
							'fechaCreacion',
							'fechaActualizacion',
						]}
						label="Buscar causal"
						listElements={resource}
						onSubmit={filterCausales}
					/>
				</Grid>

				{/* Botón crear */}
				<Grid item xs="auto">
					<Button
						color="secondary"
						variant="contained"
						onClick={() => setOpenCreate(true)}
					>
						Crear
					</Button>
				</Grid>

				{/* Tabla de datos */}
				<Grid item xs={12}>
					<Table
						data={causalesFiltrados}
						headers={tableHeaders}
						status={getStatus}
						activeColumn="activo"
						switchAction={handleToggleActive}
						rowButtonActions={buttonActions}
					/>
				</Grid>

				{/* Modal de creación */}
				<CausalForm
					cancelAction={handleCloseCreate}
					causal={{}}
					confirmAction={handleConfirmCreate}
					open={openCreate}
					isCreateForm
				/>

				{/* Modal de actualización */}
				{currentCausal && (
					<CausalForm
						cancelAction={handleCloseUpdate}
						causal={currentCausal}
						confirmAction={handleConfirmUpdate}
						open={openUpdate}
					/>
				)}

				{/* Modal eliminar */}
				{currentCausal && (
					<DeleteForm
						handleClose={handleCloseDelete}
						handleConfirm={handleConfirmDelete}
						open={openDelete}
						propertyToDelete={currentCausal.nombre}
						keyword="causal"
					/>
				)}
			</GridContainer>
		</>
	)
}
