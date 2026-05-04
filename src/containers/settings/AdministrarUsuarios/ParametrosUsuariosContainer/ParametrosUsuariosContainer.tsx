import React, { useEffect, useState } from 'react'
import { AdminFilters } from '@/components/Filter/AdminFilters'
import { useLoading } from '@/hooks/useLoading'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	parametrosBloqueoSelector,
	parametrosCaducidadSelector,
} from '@/store/slices/settings/administracion-usuarios/parametros'
import {
	getParametrosBloqueo,
	getParametrosCaducidad,
	updateParametrosBloqueo,
	updateParametrosCaducidad,
} from '@/store/slices/settings/administracion-usuarios/parametros/actions'
import { GridContainer } from '@/components/GridContainer'
import { Button, Grid, Paper, TextField, Typography } from '@mui/material'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { GridDivider } from '@/components/GridDivider'
import { ParametrosUsuariosSkeleton } from '@/components/Settings/ParametrosUsuariosSkeleton'

export const ParametrosUsuariosContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	const { idOrg } = useCompanyAndIdVa()
	const { resource: parametrosBloqueo, getStatus: statusBloqueo } =
		useAppSelector(parametrosBloqueoSelector)
	const { resource: parametrosCaducidad, getStatus: statusCaducidad } =
		useAppSelector(parametrosCaducidadSelector)

	// Número máximo de intentos de inicio de sesión
	const [maxIntentosLogin, setMaxIntentosLogin] = useState(0)
	// Número de días para caducidad de la contraseña
	const [maxDiasCaducidad, setMaxDiasCaducidad] = useState(1)

	// const { resource: organizations } = useAppSelector(companiesSelector)
	// Cargar parámetros actuales
	useEffect(() => {
		dispatch(getParametrosBloqueo()).then(stopLoading)
		dispatch(getParametrosCaducidad()).then(stopLoading)
	}, [dispatch])

	// Mostrar parámetros correspondientes a la organización actual o seleccionada (si es superadmin)
	useEffect(() => {
		// Buscar parámetros de la organización
		const indexBloqueo = parametrosBloqueo.findIndex(
			(param) => param.organization === idOrg
		)
		const indexCaducidad = parametrosCaducidad.findIndex(
			(param) => param.organization === idOrg
		)

		if (indexBloqueo !== -1) {
			setMaxIntentosLogin(parametrosBloqueo[indexBloqueo].loginAttempts)
		}
		if (indexCaducidad !== -1) {
			setMaxDiasCaducidad(
				parametrosCaducidad[indexCaducidad].passwordExpiration
			)
		}
	}, [idOrg, parametrosBloqueo, parametrosCaducidad])

	// Actualizar número máximo de intentos de inicio de sesión
	const handleChangeIntentosBloqueo = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setMaxIntentosLogin(Number(e.target.value))
	}

	// Actualizar número de días para caducidad de la contraseña
	const handleChangeDiasCaducidad = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = Number(e.target.value)
		if (value === 0) {
			setMaxDiasCaducidad(1)
			return
		}
		setMaxDiasCaducidad(Number(e.target.value))
	}

	// Actualizar parámetros de bloqueo
	const handleClickIntentosBloqueo = () => {
		startLoading()

		dispatch(
			updateParametrosBloqueo({
				loginAttemptsAllowed: maxIntentosLogin,
				organization: idOrg,
			})
		).then(stopLoading)
	}

	// Actualizar parámetros de caducidad
	const handleClickDiasCaducidad = () => {
		startLoading()

		dispatch(
			updateParametrosCaducidad({
				organization: idOrg,
				passwordExpirationDays: maxDiasCaducidad,
			})
		).then(stopLoading)
	}

	if (statusBloqueo === 'pending' || statusCaducidad === 'pending') {
		return <ParametrosUsuariosSkeleton />
	}

	return (
		<GridContainer justify="flex-start" px={2}>
			<Grid item xs={12}>
				<Typography variant="h6">
					Configuración de parámetros de bloqueo y caducidad de
					contraseña
				</Typography>
			</Grid>

			<AdminFilters includeIdVa={false} />

			<Grid item xs={12}>
				<Typography variant="body1">
					Número máximo de intentos de inicio de sesión
				</Typography>
			</Grid>
			<Grid item xs sm={8} md={4}>
				<Paper elevation={0}>
					<TextField
						size="small"
						value={maxIntentosLogin}
						onChange={handleChangeIntentosBloqueo}
						fullWidth
						type="number"
						label="Máximo de intentos"
						inputProps={{
							min: 0,
						}}
					/>
				</Paper>
			</Grid>
			<Grid item xs={12} sm="auto">
				<Button
					color="secondary"
					variant="contained"
					onClick={handleClickIntentosBloqueo}
				>
					Actualizar
				</Button>
			</Grid>
			<Grid item xs={12} />

			<Grid item xs={12}>
				<Typography variant="body1">
					Número de días para la caducidad de la contraseña
				</Typography>
			</Grid>
			<Grid item xs sm={8} md={4}>
				<Paper elevation={0}>
					<TextField
						size="small"
						value={maxDiasCaducidad}
						onChange={handleChangeDiasCaducidad}
						fullWidth
						type="number"
						label="Días configurados"
						inputProps={{
							min: 1,
						}}
					/>
				</Paper>
			</Grid>
			<Grid item xs={12} sm="auto">
				<Button
					color="secondary"
					variant="contained"
					onClick={handleClickDiasCaducidad}
				>
					Actualizar
				</Button>
			</Grid>

			<GridDivider />
		</GridContainer>
	)
}
