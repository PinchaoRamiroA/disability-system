import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { FilterContainer } from '@/containers/FilterContainer'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	getIntegrations,
	integrationsLogSelector,
} from '@/store/slices/virtualAgent'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { filterSelector } from '@/store/slices/Filter'
import { useLoading } from '@/hooks/useLoading'
import { RowAction, TableHeader } from '@/types/Table'
import { Box, Grid, Typography } from '@mui/material'
import { Table } from '@/components/Table'
import { IntegrationsResult } from '@/types/Statistics/VirtualAgent/Integrations'
import { Preview } from '@mui/icons-material'
import { AlertDialog } from '@/components/Dialog'
import { ServerPagination } from '@/components/Table/ServerPagination'
import { useChannelLabel } from '@/hooks/useChannelLabel'
import moment from 'moment'
import { Indicator } from '@/components/Indicator'
import { useRowsPerPage } from '@/hooks/paginacion/useRowsPerPage'
import { useResizeDetector } from 'react-resize-detector'

const headers: TableHeader[] = [
	{ label: 'Estado', propertyName: 'success', type: 'badge' },
	{ label: 'Servicio', propertyName: 'serviceName' },
	{ label: 'Endpoint', propertyName: 'endPoint' },
	{ label: 'Identificación', propertyName: 'endCustIdNumber' },
	{ label: 'Tipo identificación', propertyName: 'endCustIdType' },
	{ label: 'Canal', propertyName: 'channel' },
	{ label: 'Id conversación', propertyName: 'conversationURL', type: 'link' },
	{ label: 'Fecha y hora', propertyName: 'time', align: 'center' },
	{
		label: 'Request/response',
		propertyName: 'actions',
		type: 'actions',
		align: 'center',
	},
]

export const IntegrationsContainer = () => {
	const dispatch = useAppDispatch()
	const { stopLoading } = useLoading()
	const { getChannelLabel } = useChannelLabel()
	const { getStatus, resource } = useAppSelector(integrationsLogSelector)
	const [openRequestResponse, setOpenRequestResponse] = useState(false)

	const [request, setRequest] = useState('')
	const [response, setResponse] = useState('')
	const [serviceName, setServiceName] = useState('')

	const { idOrg, idVa } = useCompanyAndIdVa()
	const {
		end,
		start,
		integrationStatus: status,
		integrationService,
		channels,
		id,
		idConv,
		idType,
	} = useAppSelector(filterSelector)

	// Paginación
	const { handleRowsPerPageChange, rowsPerPage } = useRowsPerPage()
	const { ref: paginationRef, height: paginationHeight } = useResizeDetector()

	// Ver request
	const handleOpenRequestResponse = (param: IntegrationsResult) => {
		setRequest(param.request)
		setResponse(param.response)
		setServiceName(param.serviceName)
		setOpenRequestResponse(true)
	}

	const handleCloseRequestResponse = () => {
		setOpenRequestResponse(false)
	}

	const rowActions: RowAction<IntegrationsResult>[] = [
		{
			action: handleOpenRequestResponse,
			id: 'handleOpenRequestResponse',
			label: 'Ver request/response completo',
			icon: <Preview />,
		},
	]

	const callGetIntegrations = (page: number) => {
		if (end && start && idVa && idOrg) {
			dispatch(
				getIntegrations({
					idOrg,
					payload: {
						end,
						idVa,
						start,
						channels,
						id,
						idConv,
						idType,
						integrationState: status,
						serviceName: integrationService,
						page,
						perPage: rowsPerPage,
					},
				})
			)
		}
	}

	// Llamar servicio al navegar por la paginación
	const handleChangePage = (page: number) => {
		callGetIntegrations(page)
	}

	useEffect(() => {
		callGetIntegrations(1)
	}, [
		end,
		idVa,
		start,
		channels,
		id,
		idConv,
		idType,
		status,
		integrationService,
		rowsPerPage,
	])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<React.Fragment>
			<GridContainer>
				<FilterContainer
					filters={{
						channels: true,
						user: true,
						virtualAgent: true,
						idConv: true,
						integrationStatus: true,
						integrationService: true,
					}}
				/>

				<Grid
					item
					xs={12}
					container
					justifyContent={'space-evenly'}
					spacing={1}
				>
					<Indicator
						title="Total de integraciones"
						value={resource.totalResult}
						loading={getStatus === 'pending'}
					/>
					<Indicator
						title="Integraciones exitosas"
						value={resource.totalSuccess}
						loading={getStatus === 'pending'}
					/>
					<Indicator
						title="Integraciones no exitosas"
						value={resource.totalFailed}
						loading={getStatus === 'pending'}
					/>
				</Grid>

				<Grid item xs={12} mb={`${paginationHeight}px`}>
					<Table
						data={resource.integrationsResult.map((item, i) => ({
							id: i,
							conversationURL: `/analitica/reportes/asesor-virtual/historial/${item.idConv}/${item.idInteraction}`,
							...item,
							channel: getChannelLabel(Number(item.channel)),
							time: `${moment(item.time).format(
								'DD/MM/YY'
							)} **${moment(item.time).format('H:mm:ss')}**`,
						}))}
						headers={headers}
						status={getStatus}
						badges={{
							badgeColumn: 'integrationState',
							badgeText: false,
							colors: ['success', 'error'],
							values: ['true', 'false'],
						}}
						linkColumn="idConv"
						rowButtonActions={rowActions}
						actionButtonCenter
						pagination={false}
						hoverEffect={false}
						disableWordbreak={['time']}
					/>
				</Grid>

				<ServerPagination
					currentPage={resource.currentPage}
					totalPages={resource.totalPages}
					totalRecords={resource.totalResult}
					rowsPerPage={rowsPerPage}
					handleRowsPerPageChange={handleRowsPerPageChange}
					handleChange={handleChangePage}
					ref={paginationRef}
				/>
			</GridContainer>

			<AlertDialog
				open={openRequestResponse}
				title={`Request/response ${serviceName}`}
				onClose={handleCloseRequestResponse}
			>
				<Box sx={{ wordBreak: 'break-all' }}>
					<Typography variant="body1" fontWeight={800}>
						Request
					</Typography>
					{request}

					<Typography variant="body1" fontWeight={800} mt={1}>
						Response
					</Typography>
					{response}
				</Box>
			</AlertDialog>
		</React.Fragment>
	)
}
