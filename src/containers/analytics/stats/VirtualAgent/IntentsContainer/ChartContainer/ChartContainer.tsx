import React, { useEffect, useState } from 'react'
import { useChannelLabel } from '@/hooks/useChannelLabel'
import { IntentsDetail } from '@/types/Intents'
import { RenderChart } from '@/components/Charts/RenderChart'
import { Chart } from './Chart'
import { BarChart } from '@/types/Charts'

interface Props {
	data: IntentsDetail[]
	loading: boolean
}

export const ChartContainer = ({ data, loading }: Props) => {
	const { channelsLabels, getChannelLabel, channelsColors } =
		useChannelLabel()

	const [chartData, setChartData] = useState<BarChart[]>([])
	const [legends, setLegends] = useState<BarChart>({})

	const formatData = () => {
		const temp = data.map((item) => {
			const obj: BarChart = {}
			obj.intent = item.intent
			item.detail.forEach((detail) => {
				const channelLabel = getChannelLabel(detail.idChannel)
				obj[channelLabel] = detail.count
			})

			return obj
		})

		temp.sort()
		handleSetLegends(temp)
		setChartData(temp)
	}

	// Crear objeto que se mostrará en las leyendas del gráfico
	const handleSetLegends = (data: BarChart[]) => {
		const obj: BarChart = {}

		// Crear objeto con los canales y sus totales en 0 { canal1: 0, canal2: 0, ... }
		channelsLabels.forEach((ch) => {
			obj[ch] = 0
		})

		// Sumar totales de cada canal y guardarlos en el objeto 'obj'
		data.forEach((item) => {
			Object.keys(item).forEach((key) => {
				let flag = Number(obj[key])
				flag += Number(item[key])
				obj[key] = flag
			})
		})

		// Set legends
		setLegends(obj)
	}

	useEffect(() => {
		formatData()
	}, [data])

	return (
		<RenderChart
			dataLength={data.length}
			chartTitle="Top 10 intenciones"
			styles={{ height: '400px' }}
			loading={loading}
		>
			<Chart
				colors={channelsColors}
				data={chartData.reverse()}
				keys={channelsLabels}
				legends={legends}
			/>
		</RenderChart>
	)
}
