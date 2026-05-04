import React from 'react'
import { Bar } from '@nivo/bar'
import { BarChart } from '@/types/Charts'
import { useChartWidth } from '@/hooks/useChartWidth'
import { useFormatChartDates } from '@/hooks/estadisticas/useFormatChartDates'

interface Props {
	data: BarChart[]
	totalAttended: number
	totalNotAttended: number
}

export const Chart = ({ data, totalAttended, totalNotAttended }: Props) => {
	const { width } = useChartWidth({})
	const { format } = useFormatChartDates(data)

	return (
		<Bar
			width={width}
			height={350}
			data={data}
			keys={['Atendidos', 'No atendidos']}
			colors={{ scheme: 'set2' }}
			indexBy="date"
			margin={{ top: 95, right: 50, bottom: 10, left: 50 }}
			labelSkipWidth={16}
			labelSkipHeight={16}
			axisTop={{
				// tickRotation: -90,
				format,
			}}
			axisBottom={null}
			axisLeft={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legendPosition: 'end',
				legendOffset: 0,
				format: (v) => (Number.isInteger(v) ? v : ''),
			}}
			legends={[
				{
					dataFrom: 'keys',
					anchor: 'top-left',
					direction: 'row',
					justify: false,
					translateX: -30,
					translateY: -95,
					itemsSpacing: 20,
					toggleSerie: true,
					itemWidth: 120,
					itemHeight: 20,
					itemDirection: 'left-to-right',
					itemOpacity: 0.85,
					symbolSize: 20,
					effects: [
						{
							on: 'hover',
							style: {
								itemOpacity: 1,
							},
						},
					],
				},
			]}
			legendLabel={(v) => {
				if (v.id === 'Atendidos') {
					return `Atendidos (${totalAttended})`
				}
				return `No atendidos (${totalNotAttended})`
			}}
		/>
	)
}
