import React from 'react'
import { useChartWidth } from '@/hooks/useChartWidth'
import { Bar } from '@nivo/bar'
import { BarChart } from '@/types/Charts'

interface Props {
	data: BarChart[]
	keys: string[]
}

export const TopRatingChart = ({ data, keys }: Props) => {
	const { width } = useChartWidth({})

	return (
		<Bar
			width={width}
			height={350}
			data={data}
			keys={keys}
			colors={{ scheme: 'nivo' }}
			indexBy="idRating"
			margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
			labelSkipWidth={16}
			labelSkipHeight={16}
			axisBottom={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'Calificaciones',
				legendPosition: 'middle',
				legendOffset: 40,
			}}
			axisLeft={null}
			axisRight={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'Número de calificaciones por intención',
				legendPosition: 'middle',
				legendOffset: 40,
			}}
		/>
	)
}
