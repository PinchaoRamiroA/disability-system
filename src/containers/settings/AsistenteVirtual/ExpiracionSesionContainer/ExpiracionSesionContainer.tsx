import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Grid, Paper, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { userSelector } from '@/store/slices/authentication'
import { SUPERADMIN_ROLE } from '@/utils/constants/roles'
import { VirtualAgentFilter } from '@/components/Filter/FilterDrawer/FilterItem/VirtualAgentFilter'
import { GridDivider } from '@/components/GridDivider'
import { MensajeAviso } from './MensajeAviso'
import { MensajeCierre } from './MensajeCierre'
import {
	configExpiracionSelector,
	getExpiracionConfig,
} from '@/store/slices/settings/asistente-virtual/expiracion-sesion'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { ExpiracionSesion } from '@/types/Settings/asistente-virtual/Expiracion'
import { useLoading } from '@/hooks/useLoading'
import { CompanyFilter } from '@/components/Filter/FilterDrawer/FilterItem/CompanyFilter'

export const ExpiracionSesionContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	const { role } = useAppSelector(userSelector)
	const { idOrg, idVa } = useCompanyAndIdVa()
	const { resource } = useAppSelector(configExpiracionSelector)
	const [avisoExpiracion, setAvisoExpiracion] = useState<ExpiracionSesion>()
	const [cierreExpiracion, setCierreExpiracion] = useState<ExpiracionSesion>()

	useEffect(() => {
		if (idOrg && idVa) {
			startLoading()
			dispatch(getExpiracionConfig({ idOrg, idVa })).then(stopLoading)
		}
	}, [idOrg, idVa])

	useEffect(() => {
		if (resource.length === 0) {
			setAvisoExpiracion(undefined)
			setCierreExpiracion(undefined)
		}

		resource.forEach((item) => {
			if (item.acronym === 'TICA') {
				setAvisoExpiracion(item)
			} else if (item.acronym === 'TICC') {
				setCierreExpiracion(item)
			}
		})
	}, [resource])

	return (
		<GridContainer justify="flex-start">
			<Grid item xs={12}>
				<Typography variant="h5">
					Configurar mensajes y tiempos de expiración de sesión
				</Typography>
			</Grid>

			{role === SUPERADMIN_ROLE && (
				<Grid item xs sm={8} md={4}>
					<Paper elevation={0}>
						<CompanyFilter settings />
					</Paper>
				</Grid>
			)}
			<Grid item xs sm={8} md={4}>
				<Paper elevation={0}>
					<VirtualAgentFilter settings />
				</Paper>
			</Grid>

			{/* Mensaje de aviso de cierre */}
			{avisoExpiracion && (
				<MensajeAviso avisoExpiracion={avisoExpiracion} idOrg={idOrg} />
			)}

			{/* Divider */}
			<GridDivider cols={8} />

			{/* Mensaje de cierre */}
			{cierreExpiracion && (
				<MensajeCierre
					cierreExpiracion={cierreExpiracion}
					idOrg={idOrg}
				/>
			)}
		</GridContainer>
	)
}
