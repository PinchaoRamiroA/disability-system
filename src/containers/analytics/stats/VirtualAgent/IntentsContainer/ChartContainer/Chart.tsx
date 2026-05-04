import { Bar } from '@nivo/bar'
import { BarChart } from '@/types/Charts'
import { useChartWidth } from '@/hooks/useChartWidth'

interface Props {
	data: BarChart[]
	keys: string[]
	colors: string[]
	legends: BarChart
}

export const Chart = ({ data, keys, colors, legends }: Props) => {
	const { width } = useChartWidth({})

	return (
		<Bar
			width={width}
			layout="horizontal"
			height={350}
			data={data}
			keys={keys}
			indexBy="intent"
			margin={{ top: 50, right: 50, bottom: 50, left: 200 }}
			padding={0.3}
			valueScale={{ type: 'linear' }}
			indexScale={{ type: 'band', round: true }}
			colors={colors}
			borderWidth={2}
			borderColor={{
				from: 'color',
				modifiers: [
					['darker', 0.6],
					['opacity', 0.5],
				],
			}}
			axisBottom={null}
			enableGridX={true}
			axisTop={{
				tickSize: 5,
				tickPadding: 5,
				// tickRotation: ticksRotation,
				legend: 'Número de intenciones',
				legendPosition: 'middle',
				legendOffset: -40,
				format: (v) => (Number.isInteger(v) ? v : ''),
			}}
			axisLeft={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legendPosition: 'end',
				legendOffset: 0,
				format: (val: string) => {
					if (val.length > 20) {
						return val.slice(0, 20) + '...'
					}
					return val
				},
			}}
			labelSkipWidth={12}
			labelSkipHeight={12}
			legendLabel={(datum) => {
				const curr = Object.keys(legends).filter(
					(leg) => leg === datum.id
				)
				const value = legends[curr[0]]

				return `${datum.id} (${value})`
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
			role="application"
			ariaLabel="Gráfica de intenciones por canal"
			barAriaLabel={function (e) {
				return (
					e.formattedValue + ' intenciones a través del canal ' + e.id
				)
			}}
		/>
	)
}
