import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Table } from '@/components/Table'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	estadoActualSelector,
	getEstadoActual,
} from '@/store/slices/humanAgent/estadoActual'
import { Grid, IconButton, Tooltip } from '@mui/material'
import moment from 'moment'
import { SearchInput } from '@/components/SearchInput'
import { GenericObject } from '@/types/GenericObject'
import { Estados } from '@/types/HumanAgent/EstadoAsesores'
import { FilterContainer } from '@/containers/FilterContainer'
import { SUPERADMIN_ROLE, SUPERVIEWER_ROLE } from '@/utils/constants/roles'
import { userSelector } from '@/store/slices/authentication'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { Update } from '@mui/icons-material'
import { useLoading } from '@/hooks/useLoading'
import { TableHeader } from '@/types/Table'
import { StatusFilter } from './StatusFilter'

const tableHeaders: TableHeader[] = [
	{ label: 'Asesor', propertyName: 'nombreAsesor' },
	{ label: 'Usuario', propertyName: 'email' },
	{
		label: 'Estado',
		propertyName: 'estado',
		type: 'badge',
		align: 'center',
	},
	{
		label: 'Fecha y hora',
		propertyName: 'fechaConexion',
	},
]

export const StatusContainer = () => {
	const dispatch = useAppDispatch()
	const { stopLoading } = useLoading()

	const { role } = useAppSelector(userSelector)
	const { resource, getStatus } = useAppSelector(estadoActualSelector)
	const { idOrg } = useCompanyAndIdVa()

	const [filteredData, setFilteredData] = useState<GenericObject[]>([])
	const [formatedData, setFormatedData] = useState<GenericObject[]>([])
	const [pivotData, setPivotData] = useState<GenericObject[]>([])
	const [refresh, setRefresh] = useState(false)

	const filterData = (filtered: GenericObject[]) => {
		setFilteredData(filtered)
	}

	const filterDataByStatus = (filtered: GenericObject[]) => {
		setFormatedData(filtered)
		setFilteredData(filtered)
	}

	const dispatchAction = () => {
		if (idOrg) {
			const org =
				role === SUPERADMIN_ROLE || role === SUPERVIEWER_ROLE
					? idOrg
					: undefined

			dispatch(getEstadoActual({ idOrg: org })).then(() => {
				setRefresh(false)
			})
		}
	}

	// Obtener usuarios
	useEffect(() => {
		dispatchAction()
	}, [idOrg])

	useEffect(() => {
		if (refresh) {
			dispatchAction()
		}
	}, [refresh])

	// Formatear data
	useEffect(() => {
		const tempData = resource.map((item, index) => {
			let fechaConexion
			let estado = item.estado

			if (item.estado === 'Activo') {
				fechaConexion = item.fechaConexion
			} else if (item.estado === 'Inactivo') {
				fechaConexion = item.fechaDesconexion
			} else {
				if (item.logEventoPausa) {
					fechaConexion = item.logEventoPausa.startTime

					const _now = moment()
					const milisecDiff = _now.diff(moment(fechaConexion))
					const duracion = moment.duration(milisecDiff)
					const tiempoTranscurrido = moment
						.utc(duracion.as('milliseconds'))
						.format('HH:mm:ss')

					estado += `: ${item.logEventoPausa.pauseEventName} - Tiempo en pausa: ${tiempoTranscurrido}`
				}
			}

			return {
				id: index,
				nombreAsesor: item.nombreAsesor,
				estado,
				fechaConexion: fechaConexion
					? moment(fechaConexion).format('DD/MM/YY, HH:mm:ss A')
					: 'inválido',
				email: item.email,
			}
		})

		setPivotData(tempData)
		setFormatedData(tempData)
		setFilteredData(tempData)
	}, [resource])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			{role === SUPERADMIN_ROLE && (
				<FilterContainer filters={{ dates: false, companies: true }} />
			)}

			<Grid item xs sm="auto">
				<Tooltip title="Refrescar tabla">
					<IconButton
						color="primary"
						onClick={() => setRefresh(true)}
						disabled={refresh}
					>
						<Update />
					</IconButton>
				</Tooltip>
			</Grid>
			<Grid container item xs={12} sm spacing={2}>
				<Grid item xs>
					<SearchInput
						filterBy={['nombreAsesor', 'fechaConexion', 'email']}
						label="Buscar asesor"
						listElements={formatedData}
						onSubmit={filterData}
					/>
				</Grid>
				<Grid item xs={4}>
					<StatusFilter
						data={pivotData}
						onFilter={filterDataByStatus}
						refresh={refresh}
					/>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Table
					headers={tableHeaders}
					data={filteredData}
					status={getStatus}
					badges={{
						badgeColumn: 'estado',
						colors: ['success', 'error', 'warning'],
						values: ['Activo', 'Inactivo', null] as Estados[],
					}}
				/>
			</Grid>
		</GridContainer>
	)
}
