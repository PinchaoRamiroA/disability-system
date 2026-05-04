import React, { useState, useEffect } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Button, Grid, Hidden, Paper, Typography } from '@mui/material'
import { ResponsiveRegionalsList } from './ResponsiveRegionalsList'
import { RegionalsList } from './RegionalsList'
import { RegionalsContext } from './Context'
import { Department, Region, RegionsList } from '@/types/Locations'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	createRegional,
	deleteRegional,
	getLocations,
	updateDepartment,
	updateRegional,
} from '@/store/slices/locations/actions'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { locationsSelector } from '@/store/slices/locations'
import { EditDepartment } from './EditDepartment'
import { FormRegional } from './FormRegional'
import { useLoading } from '@/hooks/useLoading'
import { DeleteRegional } from './DeleteRegional'
import { CompanyFilter } from '@/components/Filter/FilterDrawer/FilterItem/CompanyFilter'
import { SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { userSelector } from '@/store/slices/authentication'
import { GridDivider } from '@/components/GridDivider'

export const RegionalsContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()

	const { resource, getStatus } = useAppSelector(locationsSelector)
	const { idOrg } = useCompanyAndIdVa()
	// Rol de usuario logueado
	const { role } = useAppSelector(userSelector)

	// Todas las regionales
	const [regionales, setRegionales] = useState<RegionsList[]>([])
	// Regional actual
	const [currentRegional, setRegional] = useState<RegionsList | null>(null)

	// Controla apertura de modales de edición/eliminación de regional/departamento
	const [openUpdateDepartment, setOpenUpdateDepartment] = useState(false)
	const [openUpdateRegional, setOpenUpdateRegional] = useState(false)
	const [openDeleteRegional, setOpenDeleteRegional] = useState(false)

	// Controla apertura de modal de creación de regional
	const [openCreateRegional, setOpenCreateRegional] = useState(false)

	// Departamento seleccionado para actualización
	const [departamentToUpdate, setDepartamentToUpdate] =
		useState<Department | null>(null)
	// Regional seleccionada para actualización
	const [regionalToUpdate, setRegionalToUpdate] = useState<Region | null>(
		null
	)

	// Abrir modal de cambio de regional
	const handleUpdateDepartment = (value: Department) => {
		setDepartamentToUpdate(value)
		setOpenUpdateDepartment(true)
	}

	// Cerrar modal de cambio de regional
	const handleCloseUpdateDepartment = () => {
		setOpenUpdateDepartment(false)
		setDepartamentToUpdate(null)
	}

	// Abrir modal de edición de regional
	const handleUpdateRegional = (value: Region) => {
		setRegionalToUpdate(value)
		setOpenUpdateRegional(true)
	}

	// Abrir modal de eliminación de regional
	const handleDeleteRegional = (value: Region) => {
		setRegionalToUpdate(value)
		setOpenDeleteRegional(true)
	}

	// Cerrar modal de edición/eliminación de regional
	const handleCloseUpdateRegional = () => {
		setOpenUpdateRegional(false)
		setOpenDeleteRegional(false)
		setRegionalToUpdate(null)
	}

	// Cerrar modal de creación de regional
	const handleCloseCreateRegional = () => {
		setOpenCreateRegional(false)
	}

	// Confirmar cambio de regional
	const handleUpdateDepartmentConfirm = (value: Region | null) => {
		if (departamentToUpdate && value) {
			startLoading()
			dispatch(
				updateDepartment({
					id: departamentToUpdate.id,
					idOrg,
					idRegional: value.id,
				})
			).then(() => {
				handleCloseUpdateDepartment()
				loadLocations()
			})
		}
	}

	// Confirmación actualización de regional
	const handleUpdateRegionalConfirm = (newName: string) => {
		if (regionalToUpdate) {
			dispatch(
				updateRegional({
					id: regionalToUpdate.id,
					idOrg,
					name: newName,
				})
			).then(() => {
				handleCloseUpdateRegional()
				loadLocations()
			})
		}
	}

	// Confirmación eliminación de regional
	const handleDeleteRegionalConfirm = () => {
		if (regionalToUpdate) {
			startLoading()
			dispatch(deleteRegional({ id: regionalToUpdate.id, idOrg })).then(
				() => {
					handleCloseUpdateRegional()
					loadLocations()
				}
			)
		}
	}

	// Confirmación creación de regional
	const handleCreateRegionalConfirm = (newName: string) => {
		startLoading()
		dispatch(createRegional({ idOrg, name: newName })).then(() => {
			handleCloseCreateRegional()
			loadLocations()
		})
	}

	// LLamar servicio
	const loadLocations = () => {
		setRegional(null)
		startLoading()
		dispatch(getLocations({ idOrg })).then(() => stopLoading())
	}

	// LLamado a action para obtener regionales
	useEffect(() => {
		if (idOrg) {
			loadLocations()
		}
	}, [dispatch, idOrg])

	// Setear regionales
	useEffect(() => {
		setRegionales(
			resource.regions.map((region) => ({
				...region,
				departaments: resource.departments.filter(
					(dept) => dept.idRegional === region.id
				),
			}))
		)
	}, [resource])

	return (
		<RegionalsContext.Provider
			value={{
				regionales,
				currentRegional,
				setRegional,
			}}
		>
			<GridContainer>
				{/* Filtro de organización */}
				{role === SUPERADMIN_ROLE && (
					<Grid item xs={12} container>
						<Grid item xs sm={6} md={4}>
							<Paper elevation={0}>
								<CompanyFilter settings />
							</Paper>
						</Grid>
						<GridDivider />
					</Grid>
				)}

				<Grid item xs={12} container justifyContent="space-between">
					{/* Título */}
					<Grid item>
						<Typography variant="h5" mr={1}>
							Configuración de regionales
						</Typography>
					</Grid>
					{/* Crear nueva regional */}
					<Grid item xs="auto">
						<Button
							variant="contained"
							onClick={() => setOpenCreateRegional(true)}
						>
							Crear
						</Button>
					</Grid>
				</Grid>
				{/* Lista de regionales y departamentos */}
				<Grid item xs={12}>
					{/* Listado de regionales */}
					<Hidden smDown>
						<RegionalsList
							loading={
								getStatus === 'pending' ||
								getStatus === 'rejected'
							}
							handleDeparmentClick={handleUpdateDepartment}
							handleRegionalDeleteClick={handleDeleteRegional}
							handleRegionalUpdateClick={handleUpdateRegional}
						/>
					</Hidden>

					{/* Listado de regionales en pantallas pequeñas */}
					<Hidden smUp>
						<ResponsiveRegionalsList
							handleDeparmentClick={handleUpdateDepartment}
							handleRegionalDeleteClick={handleDeleteRegional}
							handleRegionalUpdateClick={handleUpdateRegional}
						/>
					</Hidden>
				</Grid>
			</GridContainer>

			{/* Cambiar regional del departamento */}
			{departamentToUpdate && (
				<EditDepartment
					department={departamentToUpdate}
					onClose={handleCloseUpdateDepartment}
					onConfirm={handleUpdateDepartmentConfirm}
					open={openUpdateDepartment}
				/>
			)}

			{/* Crear regional */}
			<FormRegional
				onClose={handleCloseCreateRegional}
				onConfirm={handleCreateRegionalConfirm}
				open={openCreateRegional}
				edit={false}
			/>

			{regionalToUpdate && (
				<React.Fragment>
					{/* Actualizar regional */}
					<FormRegional
						onClose={handleCloseUpdateRegional}
						onConfirm={handleUpdateRegionalConfirm}
						open={openUpdateRegional}
						regional={regionalToUpdate}
					/>

					{/* Eliminar regional */}
					<DeleteRegional
						onClose={handleCloseUpdateRegional}
						onConfirm={handleDeleteRegionalConfirm}
						open={openDeleteRegional}
						regional={regionalToUpdate.name}
					/>
				</React.Fragment>
			)}
		</RegionalsContext.Provider>
	)
}
