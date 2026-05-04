import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	estadoChatsSelector,
	getChatsEnCola,
} from '@/store/slices/estado-chats'
import { Table } from '@/components/Table'
import { TableHeader } from '@/types/Table'
import { GridContainer } from '@/components/GridContainer'
import {
	Checkbox,
	FormControlLabel,
	Grid,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material'
import { SearchInput } from '@/components/SearchInput'
import { EstadoChats } from '@/types/Statistics/HumanAgent/EstadoChats'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { FilterContainer } from '@/containers/FilterContainer'
import { userSelector } from '@/store/slices/authentication'
import { SUPERADMIN_ROLE, SUPERVIEWER_ROLE } from '@/utils/constants/roles'
import { Update } from '@mui/icons-material'
import { useLoading } from '@/hooks/useLoading'

const headers: TableHeader[] = [
	{
		label: 'ID conversación',
		propertyName: 'idConv',
	},
	{
		label: 'Estado',
		propertyName: 'estado',
	},
	{
		label: 'ID cliente',
		propertyName: 'idCliente',
	},
	{
		label: 'Tipo ID cliente',
		propertyName: 'tipoIdCliente',
	},
	{
		label: 'Nombre cliente',
		propertyName: 'nombreCliente',
	},
	{
		label: 'Split',
		propertyName: 'nombreSplit',
	},
	{
		label: 'Asesor',
		propertyName: 'nombreAsesorAsignado',
	},
	{
		label: 'Fecha de entrada',
		propertyName: 'fechaEntrada',
	},
]

export const EstadoChatsContainer = () => {
	const dispatch = useAppDispatch()
	const { stopLoading } = useLoading()

	const { resource, getStatus } = useAppSelector(estadoChatsSelector)
	const { idOrg } = useCompanyAndIdVa()
	const { role } = useAppSelector(userSelector)
	// Checkboxes con estados "Asignados", "En cola" y "Error - Asesor Desconectado"
	const [checked, setChecked] = useState([true, true, true])
	const [chatsFiltrados, setChatsFiltrados] = useState<EstadoChats[]>([])
	const [listElements, setListElements] = useState<EstadoChats[]>([])
	const [refresh, setRefresh] = useState(false)

	// Actualizar valores de checkbox "Asignados"
	const handleChangeAsignados = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setChecked([event.target.checked, checked[1], checked[2]])
	}

	// Actualizar valores de checkbox "En cola"
	const handleChangeEnCola = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked([checked[0], event.target.checked, checked[2]])
	}

	// Actualizar valores de checkbox "En cola"
	const handleChangeAsesorDesconectado = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setChecked([checked[0], checked[1], event.target.checked])
	}

	// Filtrar chats según input de búsqueda
	const filterChats = (result: EstadoChats[]) => {
		setChatsFiltrados(result)
	}

	// Filtrar chats según valor de checkboxes
	const filterChatsByStatus = () => {
		const checkAsignado = checked[0]
		const checkEnCola = checked[1]
		const checkAsesorDesconectado = checked[2]

		// Todos los checkboxes seleccionados (o deseleccionados)
		if (
			(checkAsignado && checkEnCola && checkAsesorDesconectado) ||
			(!checkAsignado && !checkEnCola && !checkAsesorDesconectado)
		) {
			// Devuelve el listado completo
			return resource
		}

		// Filtrar tabla según checkboxes seleccionados
		return resource.filter((item) => {
			if (item.estado === 'Asignado') {
				return checkAsignado
			} else if (item.estado === 'En Cola') {
				return checkEnCola
			} else if (item.estado === 'Error - Asesor Desconectado') {
				return checkAsesorDesconectado
			}
		})
	}

	// Llamar servicio que obtiene chats en cola
	useEffect(() => {
		if (idOrg) {
			dispatch(getChatsEnCola({ idOrg }))
		}
	}, [idOrg])

	useEffect(() => {
		if (refresh && idOrg) {
			dispatch(getChatsEnCola({ idOrg })).then(() => {
				setRefresh(false)
			})
		}
	}, [refresh])

	// Setear listado de chats una vez se obtiene la respuesta del servicio
	useEffect(() => {
		setListElements(filterChatsByStatus())
	}, [resource])

	// Setear listado de chats según el valor de los checkboxes
	useEffect(() => {
		setListElements(filterChatsByStatus())
	}, [checked])

	// Filtrar chats con listados de elementos cuando se actualiza
	useEffect(() => {
		filterChats(listElements)
	}, [listElements])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer justify="flex-end">
			{(role === SUPERADMIN_ROLE || role === SUPERVIEWER_ROLE) && (
				<FilterContainer filters={{ dates: false }} />
			)}

			<Grid item xs display="flex" alignItems="center">
				<Typography variant="h6" mr={2}>
					Refrescar tabla
				</Typography>
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
			<Grid item xs={12} sm="auto" display="flex" alignItems="center">
				<Typography variant="h6" mr={2}>
					Filtrar tabla por estado
				</Typography>
				<FormControlLabel
					label="Asignados"
					control={
						<Checkbox
							checked={checked[0]}
							onChange={handleChangeAsignados}
						/>
					}
				/>
				<FormControlLabel
					label="En cola"
					control={
						<Checkbox
							checked={checked[1]}
							onChange={handleChangeEnCola}
						/>
					}
				/>
				<FormControlLabel
					label="Asesor desconectado"
					control={
						<Checkbox
							checked={checked[2]}
							onChange={handleChangeAsesorDesconectado}
						/>
					}
				/>
			</Grid>

			<Grid item xs={12}>
				<SearchInput
					filterBy={[
						'idConv',
						'idCliente',
						'tipoIdCliente',
						'nombreCliente',
						'nombreSplit',
						'nombreAsesorAsignado',
						'fechaEntrada',
					]}
					label="Buscar chat"
					listElements={listElements}
					onSubmit={filterChats}
				/>
			</Grid>

			<Grid item xs={12}>
				<Table
					data={chatsFiltrados}
					headers={headers}
					status={getStatus}
				/>
			</Grid>
		</GridContainer>
	)
}
