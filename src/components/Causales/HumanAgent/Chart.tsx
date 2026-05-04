import React from 'react'
import { BarChart } from '@/types/Charts'
import { ResponsiveBar } from '@nivo/bar'

interface Props {
	data: BarChart[]
	keys: string[]
	total: number
}

const CustomTooltip = ({
	color,
	id,
	value,
	total,
}: {
	color: string
	id: string | number
	value: number
	total: number
}) => (
	<div
		style={{
			padding: 12,
			color,
			background: '#222',
		}}
	>
		<strong>
			{id}: {formatPercentage(value, total)}
		</strong>
	</div>
)

const formatPercentage = (value: number, total: number) => {
	const porcentaje = (100 * value) / total
	const formattedValue =
		porcentaje % 1 === 0 ? porcentaje : porcentaje.toFixed(2)
	return `${value} (${formattedValue}%)`
}

export const Chart = ({ data, keys, total }: Props) => {
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
				legend: 'Porcentaje',
				legendPosition: 'middle',
				legendOffset: -40,
				format: (value) => {
					return value
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
			tooltip={({ color, id, value }) => (
				<CustomTooltip
					color={color}
					id={id}
					value={value}
					total={total}
				/>
			)}
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
												? formatPercentage(
														data.value,
														total
												  )
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
			ariaLabel="Porcentaje de tipificación por causal"
			barAriaLabel={function (e) {
				return `${e.id}: ${formatPercentage(
					Number(e.formattedValue),
					total
				)}%`
			}}
		/>
	)
}
