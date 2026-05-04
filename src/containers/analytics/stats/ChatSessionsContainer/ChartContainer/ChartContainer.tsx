import React, { useEffect, useState } from 'react'
import { Chart } from './Chart'
import { Datum, Summary } from '@/types/Statistics/ChatSessions'
import moment from 'moment'
import { useChannelLabel } from '@/hooks/useChannelLabel'
import { BarChart } from '@/types/Charts'
import { RenderChart } from '@/components/Charts/RenderChart'

interface Props {
	data: Datum[]
	summary: Summary[]
	loading: boolean
}

export const ChartContainer = ({
	data: chartData,
	loading,
	summary,
}: Props) => {
	// Información de los canales
	const { channels, getChannelLabel } = useChannelLabel()

	const [data, setData] = useState<BarChart[]>([])
	const [keys, setKeys] = useState<string[]>([])
	const [colors, setColors] = useState<string[]>([])
	const [legends, setLegends] = useState<BarChart>({})

	// Formatear data para gráfica (sumar totales)
	const formatData = () => {
		const copy = chartData.map((item) => {
			const obj: BarChart = {}
			obj.date = moment(item.date).format('DD/MM/YYYY')

			// Ignorar canal 4 (asesor) y crear nuevo objeto (con label al mismo nivel de date)
			item.detail
				.filter((detail) => detail.idChannel != 4)
				.forEach((detail) => {
					const channelLabel = getChannelLabel(detail.idChannel)
					obj[channelLabel] = detail.count
				})

			return obj
		})

		setData(copy)
		handleSetKeysColors()
		handleSetLegends()
	}

	const handleSetLegends = () => {
		const tempLegends: BarChart = {}
		channels.forEach((ch) => {
			const temp = summary.filter((sum) => sum.idChannel === ch.id)
			tempLegends[ch.label] = temp[0]?.count
		})
		setLegends(tempLegends)
	}

	// Setear keys y colors del gráfico
	const handleSetKeysColors = () => {
		if (keys.length === 0) {
			const tempKeys: string[] = []
			const tempColors: string[] = []

			channels.forEach((ch) => {
				tempKeys.push(ch.label)
				tempColors.push(ch.color ?? '')
			})

			setKeys(tempKeys)
			setColors(tempColors)
		}
	}

	useEffect(() => {
		formatData()
	}, [chartData])

	return (
		<RenderChart
			dataLength={data.length}
			chartTitle="Conversaciones por canal"
			loading={loading}
		>
			<Chart data={data} keys={keys} colors={colors} legends={legends} />
		</RenderChart>
	)
}
