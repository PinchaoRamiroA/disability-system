import { ResponsiveBar } from '@nivo/bar'
import { BarChart } from '@/types/Charts'
import { secondsToTime } from '@/utils/helpers/date'

interface Props {
	data: BarChart[]
	keys: string[]
}

const CustomTooltip = ({
	color,
	id,
	value,
}: {
	color: string
	id: string | number
	value: number
}) => (
	<div
		style={{
			padding: 12,
			color,
			background: '#222',
		}}
	>
		<strong>
			{id}: {secondsToTime(value)}
		</strong>
	</div>
)

export const Chart = ({ data, keys }: Props) => {
	return (
		<ResponsiveBar
			layout="horizontal"
			data={data}
			keys={keys}
			indexBy="id"
			margin={{ top: 50, right: 50, bottom: 50, left: 200 }}
			padding={0.3}
			valueScale={{ type: 'linear' }}
			indexScale={{ type: 'band', round: true }}
			colors={{ scheme: 'nivo' }}
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
				legend: 'Tiempo en minutos',
				legendPosition: 'middle',
				legendOffset: -40,
				format: (value) => {
					return Math.floor(value / 60)
				},
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
			enableLabel={false}
			tooltip={CustomTooltip}
			layers={[
				'grid',
				'axes',
				'bars',
				'markers',
				'legends',
				'annotations',
				({ bars }) => {
					return (
						<g>
							{bars.map(({ height, y, data }, index) => {
								return (
									<text
										transform={`translate(${10}, ${
											y + height / 2
										})`}
										textAnchor="left"
										dominantBaseline="central"
										fontSize={12}
										key={`bar-label-${data.id}-${index}`}
									>
										{`${
											data.value
												? secondsToTime(data.value)
												: ''
										}`}
									</text>
								)
							})}
						</g>
					)
				},
			]}
			role="application"
			ariaLabel="Gráfica de tiempo promedio por asesor"
			barAriaLabel={function (e) {
				return (
					'Tiempo promedio del asesor ' +
					e.id +
					': ' +
					Math.round(Number(e.formattedValue) / 60) +
					' minutos'
				)
			}}
		/>
	)
}
