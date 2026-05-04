import React, { useEffect, useState } from 'react'

import { EscalatedChatsDetail } from '@/types/HumanAgent'
import { BarChart } from '@/types/Charts'
import { RenderChart } from '@/components/Charts/RenderChart'
import { Chart } from './Chart'

interface Props {
	data: EscalatedChatsDetail[]
	loading: boolean
}

export const ChartContainer = ({ data, loading }: Props) => {
	const [chartData, setChartData] = useState<BarChart[]>([])
	const [keys, setKeys] = useState<string[]>([])

	const formatData = () => {
		const temp: BarChart[] = []
		const tempKeys: string[] = []
		// Crear copia de data para poder utilizar el método .sort()
		const tempData: EscalatedChatsDetail[] = JSON.parse(
			JSON.stringify(data)
		)

		// Ordenar datos
		tempData.sort(
			(a, b) =>
				a.detail.reduce((prev, curr) => prev + curr.count, 0) -
				b.detail.reduce((prev, curr) => prev + curr.count, 0)
		)

		tempData.forEach((elem) => {
			temp.push({
				id: elem.intent,
				[elem.intent]: elem.detail.reduce(
					(sum, curr) => sum + curr.count,
					0
				),
			})
			tempKeys.push(elem.intent)
		})

		setChartData(temp)
		setKeys(tempKeys)
	}

	useEffect(() => {
		formatData()
	}, [data])

	return (
		<RenderChart
			dataLength={chartData.length}
			chartTitle="Chats escalados por split"
			loading={loading}
		>
			<Chart data={chartData} keys={keys} />
		</RenderChart>
	)
}
