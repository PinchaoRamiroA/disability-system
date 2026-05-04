import React, { useEffect, useState } from 'react'

import { AgentsChatsDetail } from '@/types/HumanAgent'

import { Chart } from './Chart'

import { useChannelLabel } from '@/hooks/useChannelLabel'
import { BarChart } from '@/types/Charts'
import { RenderChart } from '@/components/Charts/RenderChart'

interface Props {
	data: AgentsChatsDetail[]
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
			obj.agent = item.intent
			item.detail.forEach((detail) => {
				const channelLabel = getChannelLabel(detail.idChannel)
				obj[channelLabel] = detail.count
			})

			return obj
		})
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
			dataLength={chartData.length}
			chartTitle="Chats por asesor"
			loading={loading}
			resizeHeight
		>
			<Chart
				data={chartData.reverse()}
				keys={channelsLabels}
				colors={channelsColors}
				legends={legends}
			/>
		</RenderChart>
	)
}
