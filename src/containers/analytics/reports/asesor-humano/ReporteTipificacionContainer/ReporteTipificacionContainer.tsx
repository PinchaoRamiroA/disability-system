import React, { useEffect, useState } from 'react'
import { GridContainer } from '@/components/GridContainer'
import { Table } from '@/components/Table'
import { FilterContainer } from '@/containers/FilterContainer'
import { useCompanyAndIdVa } from '@/hooks/useCompanyAndIdVa'
import { useLoading } from '@/hooks/useLoading'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { filterSelector } from '@/store/slices/Filter'
import {
	getCSVReporteCausales,
	getReporteCausales,
	reporteCausalesSelector,
} from '@/store/slices/reports/humanAgent/tipificaciones'
import { SubtableHeader, TableHeader } from '@/types/Table'
import { Button, Grid } from '@mui/material'
import { ServerPagination } from '@/components/Table/ServerPagination'
import { useRowsPerPage } from '@/hooks/paginacion/useRowsPerPage'
import {
	HumanAgentTypingFormatted,
	HumanAgentTypingSubtable,
} from '@/types/Causales'
import { useResizeDetector } from 'react-resize-detector'

const tableHeaders: TableHeader[] = [
	{
		label: '#',
		propertyName: 'id',
	},
	{
		label: 'Id conversación',
		propertyName: 'conversationURL',
		type: 'link',
	},
	{
		label: 'Tipo de documento',
		propertyName: 'endCustIdType',
	},
	{
		label: 'Número de documento',
		propertyName: 'endCustIdNumber',
	},
	{
		label: 'Fecha',
		propertyName: 'dateConection',
	},
	{
		label: 'Asesor',
		propertyName: 'humanAgent',
	},
	{
		label: 'Split',
		propertyName: 'split',
	},
	{
		label: 'Causal paso',
		propertyName: 'transferToAgentCausal',
	},
	{
		label: 'Causal(es) de la conversación',
		propertyName: 'businessCausal',
	},
	{
		label: 'Causal de finalización',
		propertyName: 'endCausal',
	},
]

const subtableHeaders: SubtableHeader[] = [
	{
		label: 'Asesor',
		propertyName: 'humanAgent',
	},
	{
		label: 'Split',
		propertyName: 'split',
	},
]

export const ReporteTipificacionContainer = () => {
	const dispatch = useAppDispatch()
	const { startLoading, stopLoading } = useLoading()
	const { getStatus, resource } = useAppSelector(reporteCausalesSelector)
	const [formattedData, setFormattedData] = useState<
		HumanAgentTypingFormatted[]
	>([])

	const {
		agents,
		start,
		end,
		channels,
		splits,
		causalesNegocio,
		causalesFin,
		causalesPasoAutomatico,
	} = useAppSelector(filterSelector)
	const { idOrg } = useCompanyAndIdVa()

	// Paginación
	const { handleRowsPerPageChange, rowsPerPage } = useRowsPerPage()
	const { ref: paginationRef, height: paginationHeight } = useResizeDetector()

	// Cambiar de página
	const handleChangePage = (page: number) => {
		callGetReporteCausales(page)
	}

	// Descargar reporte
	const handleDownload = async () => {
		if (idOrg && start && end) {
			startLoading()
			dispatch(
				getCSVReporteCausales({
					idOrg,
					end,
					start,
					businessCausal: causalesNegocio,
					channels,
					endCausal: causalesFin,
					splits,
					transferToAgentCausal: causalesPasoAutomatico,
				})
			).then(stopLoading)
		}
	}

	// Llamar servicio para llenar tabla
	const callGetReporteCausales = (page: number) => {
		if (idOrg && start && end) {
			dispatch(
				getReporteCausales({
					idOrg,
					payload: {
						agents,
						end,
						page,
						perPage: rowsPerPage,
						start,
						businessCausal: causalesNegocio,
						channels,
						endCausal: causalesFin,
						splits,
						transferToAgentCausal: causalesPasoAutomatico,
					},
				})
			)
		}
	}

	// Aplicar filtros
	useEffect(() => {
		callGetReporteCausales(1)
	}, [
		agents,
		start,
		end,
		channels,
		splits,
		causalesNegocio,
		causalesFin,
		causalesPasoAutomatico,
		idOrg,
		rowsPerPage,
	])

	// Formatear resource
	useEffect(() => {
		const newTipificacion: HumanAgentTypingFormatted[] = []

		resource.humanAgentTyping.forEach((item, index) => {
			const { split, humanAgent, ...rest } = item
			// Registro válido para generar subtabla
			if (item.humanAgent.length > 1 && item.split.length > 1) {
				const subtable: HumanAgentTypingSubtable[] =
					item.humanAgent.map((subItm, subI) => {
						return {
							id: subI,
							humanAgent: subItm,
							split: item.split[subI],
							dateConection: item.dateConection,
						}
					})
				newTipificacion.push({
					...rest,
					id: index + 1,
					split: split[0].slice(0, split[0].length - 3) + '...',
					humanAgent:
						humanAgent[0].slice(0, humanAgent[0].length - 3) +
						'...',
					subtable,
				})
			}
			// Formatear causales
			else {
				newTipificacion.push({
					...rest,
					id: index + 1,
					split: split[0],
					humanAgent: humanAgent[0],
					subtable: [],
				})
			}
		})

		setFormattedData(newTipificacion)
	}, [resource])

	useEffect(() => {
		stopLoading()
	}, [])

	return (
		<GridContainer>
			<FilterContainer
				filters={{
					causalesFin: true,
					causalesNegocio: true,
					causalesPasoAutomatico: true,
					channels: true,
					splits: true,
					agents: true,
				}}
			/>

			{/* Botón de descarga */}
			<Grid item xs={12}>
				<Button
					variant="contained"
					onClick={handleDownload}
					disabled={resource.totalResult === 0}
				>
					Descargar reporte
				</Button>
			</Grid>

			{/* Tabla */}
			<Grid item xs={12} mb={`${paginationHeight}px`}>
				<Table
					data={formattedData.map((item) => ({ ...item }))}
					headers={tableHeaders}
					status={getStatus}
					pagination={false}
					disableWordbreak="*"
					cellSubtable
					subtableColumn="subtable"
					subtableColumns={['humanAgent', 'split']}
					subtableHeaders={subtableHeaders}
					linkColumn="idConv"
				/>
			</Grid>

			<ServerPagination
				currentPage={resource.currentPage}
				handleChange={handleChangePage}
				totalPages={resource.totalPages}
				totalRecords={resource.totalResult}
				rowsPerPage={rowsPerPage}
				handleRowsPerPageChange={handleRowsPerPageChange}
				ref={paginationRef}
			/>
		</GridContainer>
	)
}
