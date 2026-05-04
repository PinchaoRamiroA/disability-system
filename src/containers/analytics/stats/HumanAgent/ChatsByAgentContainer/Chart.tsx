import { ResponsiveBar } from '@nivo/bar'
import { BarChart } from '@/types/Charts'

interface Props {
	data: BarChart[]
	keys: string[]
	colors: string[]
	legends: BarChart
}

export const Chart = ({ data, keys, colors, legends }: Props) => {
	return (
		<ResponsiveBar
			layout="horizontal"
			data={data}
			keys={keys}
			indexBy="agent"
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
				legend: 'Número de chats',
				legendPosition: 'middle',
				legendOffset: -40,
			}}
			axisLeft={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legendPosition: 'end',
				legendOffset: 0,
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
			ariaLabel="Gráfica de conversaciones en el tiempo"
			barAriaLabel={function (e) {
				return (
					e.formattedValue +
					' conversaciones a través del canal ' +
					e.id +
					' el día ' +
					e.indexValue
				)
			}}
		/>
	)
}
