import React from 'react'
import { BarChart } from '@/types/Charts'
import { ResponsiveBar } from '@nivo/bar'

interface Props {
	data: BarChart[]
	keys: string[]
}

export const EventsChart = ({ data, keys }: Props) => {
	return (
		<ResponsiveBar
			data={data}
			keys={keys}
			indexBy="event"
			margin={{ top: 50, right: 50, bottom: 50, left: 200 }}
			labelSkipWidth={16}
			labelSkipHeight={16}
			layout="horizontal"
			// valueFormat={(v) => `${Math.abs(v)}`}
			axisBottom={{
				format: (v: number) =>
					Number.isInteger(v) ? `${Math.abs(v)}` : '',
			}}
			axisLeft={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legendPosition: 'end',
				legendOffset: 0,
			}}
			legends={[
				{
					dataFrom: 'keys',
					anchor: 'bottom-left',
					direction: 'row',
					justify: false,
					// translateX: 120,
					translateY: 45,
					itemsSpacing: 20,
					toggleSerie: true,
					itemWidth: 100,
					itemHeight: 20,
					itemDirection: 'left-to-right',
					itemOpacity: 0.85,
					symbolSize: 15,
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
		/>
	)
}
