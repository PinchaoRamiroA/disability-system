import React, { useEffect, useState } from 'react'
import { AlertDialog } from '@/components/Dialog'
import { ComputedDatum } from '@nivo/bar'
import { BarChart } from '@/types/Charts'
import { Grid } from '@mui/material'
import { Table } from '@/components/Table'

type SelectedBar = ComputedDatum<BarChart>

interface Props {
	open: boolean
	handleClose: () => void
	bar: SelectedBar
}

type IdRate1 = '👎'
type IdRate5 = '👍'
const idRate1: IdRate1 = '👎'
const idRate5: IdRate5 = '👍'

type ConversationIDS = {
	id: number
	idConv: string
}

export const RateChartPopup = ({ handleClose, open, bar }: Props) => {
	const [ids, setIds] = useState<ConversationIDS[]>([])
	const [positiveRate, setPositiveRate] = useState(false)

	useEffect(() => {
		let dataRate: string | undefined
		const convs: ConversationIDS[] = []

		// Calificaciones de 5 estrellas
		if (bar.id === idRate5) {
			dataRate = bar.data['idRate5'].toString()
			setPositiveRate(true)
		}
		// Calificaciones de 1 estrella
		else if (bar.id === idRate1) {
			dataRate = bar.data['idRate1'].toString()
		}

		if (dataRate) {
			// Array temporal para controlar repetición de idConv
			const tempIDS: string[] = []
			let numeracion = 1
			dataRate.split(',').forEach((idConv) => {
				// No agregar idConv repetido
				if (!tempIDS.includes(idConv)) {
					tempIDS.push(idConv)
					convs.push({
						id: numeracion++,
						idConv,
					})
				}
			})
			// Actualizar state
			setIds(convs)
		}

		/**
		 * Descomentar para obtener todas las conversaciones
			// Obtener ids de las conversaciones
			let convs: ConversationIDS[] = []
			if (bar.data["idRate1"]) {
				bar.data["idRate1"].toString().split(',').forEach(idConv => {
					convs = convs.concat({
						id: nanoid(),
						idConv,
						rate: idRate1
					})
				})
			}
			if (bar.data["idRate5"]) {
				bar.data["idRate5"].toString().split(',').forEach(idConv => {
					convs = convs.concat({
						id: nanoid(),
						idConv,
						rate: idRate5
					})
				})
			}

			// Actualizar state
			setIds()
		 */
	}, [bar])

	return (
		<AlertDialog
			open={open}
			title={`Conversaciones calificadas ${
				positiveRate
					? `positivamente (${idRate5})`
					: `negativamente (${idRate1})`
			}`}
			onClose={handleClose}
		>
			<Grid item xs={12}>
				<Table
					data={ids.map((item) => ({
						...item,
						conversationURL: `/analitica/reportes/asesor-virtual/historial/${item.idConv}`,
					}))}
					headers={[
						{
							label: '#',
							propertyName: 'id',
							align: 'center',
						},
						{
							label: 'ID Conversación',
							propertyName: 'conversationURL',
							type: 'link',
							align: 'center',
						},
					]}
					status={'resolved'}
					linkColumn="idConv"
					actionButtonCenter
					pagination={false}
					hoverEffect={false}
				/>
			</Grid>
		</AlertDialog>
	)
}
