import React, { useEffect, useState, useMemo } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Button, Grid } from '@mui/material'
import { SearchInput } from '@/components/SearchInput'
import { Table } from '@/components/Table'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { RowAction, TableHeader } from '@/types/Table'

import {
	Delete,
	Edit,
	Schedule,
	TransferWithinAStation,
} from '@mui/icons-material'
import { SplitsForm } from './Forms'
import {
	createSplit,
	updateSplit,
	getSplits,
	splitsSelector,
	deleteSplit,
} from '@/store/slices/splits'
import { Splits } from '@/types/Splits'
import Derivaciones from './Forms/Derivaciones'
import { SplitContext } from '@/contexts/SplitContext'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { userSelector } from '@/store/slices/authentication'
import { SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { CompanyFilter } from '@/components/Filter/FilterDrawer/FilterItem/CompanyFilter'
import { DeleteForm } from '@/components/DeleteForm'
import { useLoading } from '@/hooks/useLoading'
import { HorariosContainer } from './Forms/HorariosContainer'

const tableHeaders: TableHeader[] = [
	{ propertyName: 'activo', label: 'Activo', type: 'switch' },
	{ propertyName: 'idSplit', label: 'Id Split' },
	{ propertyName: 'nombre', label: 'Nombre Split' },
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

export const SplitsContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()

	// Selector de splits
	const { resource, getStatus } = useAppSelector(splitsSelector)

	// Splits filtrados
	const [filteredSplits, setFilteredSplits] = useState<Splits[]>([])

	// Filtrar splits
	const filterSplits = (result: Splits[]) => {
		setFilteredSplits(result)
	}

	// Usuario seleccionado por una acción de la tabla
	const [currentSplit, setCurrentSplit] = useState<Splits | null>(null)

	const splitContextValue = useMemo(() => {
		if (currentSplit) {
			return {
				currentSplit,
				setCurrentSplit,
			}
		}
	}, [currentSplit, setCurrentSplit])

	const { idOrg } = useCompanyAndIdVa()

	// Rol de usuario logueado
	const { role } = useAppSelector(userSelector)

	// Modal crear split
	const [openCreate, setOpenCreate] = useState(false)
	// Modal actualizar split
	const [openUpdate, setOpenUpdate] = useState(false)
	// Modal eliminar split
	const [openDelete, setOpenDelete] = useState(false)

	// Modal configuración de horarios
	const [openHorarios, setOpenHorarios] = useState(false)
	// Modal derivaciones
	const [openDerivaciones, setOpenDerivaciones] = useState(false)

	const handleOpenHorarios = (split: Splits) => {
		setOpenHorarios(true)
		setCurrentSplit(split)
	}

	const handleCloseHorarios = () => {
		setOpenHorarios(false)
		setCurrentSplit(null)
	}

	const handleOpenDerivaciones = (split: Splits) => {
		setOpenDerivaciones(true)
		setCurrentSplit(split)
	}

	const handleCloseDerivaciones = () => {
		setOpenDerivaciones(false)
		setCurrentSplit(null)
	}

	// Abrir modal de splits del asesor
	const handleOpenUpdate = (split: Splits) => {
		setOpenUpdate(true)
		setCurrentSplit(split)
	}

	// Cerrar modal de splits del asesor
	const handleCloseUpdate = () => {
		setOpenUpdate(false)
		setCurrentSplit(null)
	}

	// Abrir modal de eliminación
	const handleOpenDelete = (split: Splits) => {
		setOpenDelete(true)
		setCurrentSplit(split)
	}

	// Cerrar modal de eliminación
	const handleCloseDelete = () => {
		setOpenDelete(false)
		setCurrentSplit(null)
	}

	/**
	 * Crear usuario
	 */
	const handleCloseCreate = () => {
		setOpenCreate(false)
		setCurrentSplit(null)
	}

	const handleConfirmCreate = (split: Partial<Splits>) => {
		startLoading(true)
		const {
			descripcion,
			nombre,
			timeInactivityAgent,
			timeInactivityClient,
			timeMaxInitConversation,
		} = split
		dispatch(
			createSplit({
				split: {
					descripcion,
					nombre,
					logicDelete: 1,
					timeInactivityAgent,
					timeInactivityClient,
					timeMaxInitConversation,
				},
				handleCloseCreate,
			})
		).then(stopLoading)
	}

	/**
	 * Switch Activar/Desactivar
	 */
	const handleToggleActive = (param: Splits) => {
		startLoading()
		const { idSplit, activo } = param
		dispatch(
			updateSplit({
				split: {
					idSplit,
					activo: !activo,
				},
			})
		).then(stopLoading)
	}

	/**
	 * Actions
	 */
	const handleConfirmUpdate = (split: Partial<Splits>) => {
		startLoading(true)
		dispatch(
			updateSplit({
				split: {
					activo: currentSplit?.activo,
					descripcion: split.descripcion,
					idSplit: currentSplit?.idSplit,
					nombre: split.nombre,
					timeInactivityAgent: split.timeInactivityAgent,
					timeInactivityClient: split.timeInactivityClient,
					timeMaxInitConversation: split.timeMaxInitConversation,
				},
				handleCloseUpdate,
			})
		).then(stopLoading)
	}

	const handleConfirmDelete = () => {
		if (currentSplit) {
			startLoading()
			dispatch(deleteSplit({ codigoSplit: currentSplit.idSplit })).then(
				stopLoading
			)
			handleCloseDelete()
		}
	}

	const buttonActions: RowAction<Splits>[] = [
		{
			action: handleOpenHorarios,
			id: 'handleOpenHorarios',
			label: 'Horarios',
			icon: <Schedule />,
			canBeDisabled: true,
		},
		{
			action: handleOpenDerivaciones,
			id: 'handleOpenDerivaciones',
			label: 'Derivaciones',
			icon: <TransferWithinAStation />,
			canBeDisabled: true,
		},
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

	/**
	 * Hooks
	 */
	// Obtener splits
	useEffect(() => {
		if (idOrg) {
			startLoading()
			dispatch(getSplits({ idOrg })).then(stopLoading)
		}
	}, [dispatch, idOrg])

	// Actualizar splits filtrados
	useEffect(() => {
		setFilteredSplits(resource)

		// Actualizar currentSplit en caso de una modificación (horarios, derivaciones)
		resource.forEach((split) => {
			if (split.idSplit === currentSplit?.idSplit) {
				setCurrentSplit(split)
			}
		})
	}, [resource])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<SplitContext.Provider value={splitContextValue ?? null}>
			<GridContainer>
				{/* Filtro de búsqueda */}
				<Grid item xs>
					<SearchInput
						filterBy={['idSplit', 'nombre', 'descripcion']}
						label="Buscar split"
						listElements={resource}
						onSubmit={filterSplits}
					/>
				</Grid>

				{/* Filtro de organización */}
				{role === SUPERADMIN_ROLE && (
					<Grid item xs>
						<CompanyFilter settings />
					</Grid>
				)}

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
						data={filteredSplits}
						headers={tableHeaders}
						status={getStatus}
						activeColumn="activo"
						switchAction={handleToggleActive}
						rowButtonActions={buttonActions}
					/>
				</Grid>

				{/* Modal crear split */}
				<SplitsForm
					cancelAction={handleCloseCreate}
					split={{}}
					confirmAction={handleConfirmCreate}
					open={openCreate}
					isCreateForm
				/>

				{/* Modal actualizar splits */}
				{currentSplit && (
					<SplitsForm
						cancelAction={handleCloseUpdate}
						confirmAction={handleConfirmUpdate}
						confirmText="Actualizar"
						open={openUpdate}
						split={currentSplit}
					/>
				)}

				{/* Modal eliminar */}
				{currentSplit && (
					<DeleteForm
						handleClose={handleCloseDelete}
						handleConfirm={handleConfirmDelete}
						open={openDelete}
						propertyToDelete={currentSplit.nombre}
						keyword="Split"
					/>
				)}

				{currentSplit && (
					<HorariosContainer
						open={openHorarios}
						handleClose={handleCloseHorarios}
						split={currentSplit}
					/>
				)}

				{currentSplit && (
					<Derivaciones
						handleClose={handleCloseDerivaciones}
						open={openDerivaciones}
						splits={resource.filter(
							(e) => e.idSplit !== currentSplit.idSplit
						)}
					/>
				)}
			</GridContainer>
		</SplitContext.Provider>
	)
}
