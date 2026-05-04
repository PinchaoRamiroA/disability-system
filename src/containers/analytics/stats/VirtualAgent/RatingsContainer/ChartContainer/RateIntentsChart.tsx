import React, { useState } from 'react'

import { Bar, ComputedDatum } from '@nivo/bar'
import { BarChart } from '@/types/Charts'
import { useChartWidth } from '@/hooks/useChartWidth'
import { useFormatChartDates } from '@/hooks/estadisticas/useFormatChartDates'
import { RateChartPopup } from './RateChartPopup'

interface Props {
	data: BarChart[]
	keys: string[]
}

type SelectedBar = ComputedDatum<BarChart>

export const RateIntentsChart = ({ data, keys }: Props) => {
	const { width } = useChartWidth({ defaultScreenSize: 100 })
	const { format } = useFormatChartDates(data)

	const [selectedBar, setSelectedBar] = useState<SelectedBar | null>(null)

	return (
		<>
			<Bar
				width={width}
				height={500}
				margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
				data={data}
				keys={keys}
				indexBy="date"
				padding={0.4}
				colors={['#d95f02', '#1b9e77']}
				enableGridX
				enableGridY
				labelSkipWidth={16}
				labelSkipHeight={16}
				labelTextColor="inherit:darker(1.2)"
				axisTop={{
					tickSize: 0,
					tickPadding: 12,
					format,
				}}
				axisBottom={{
					legend: 'Calificaciones',
					legendPosition: 'middle',
					legendOffset: 20,
					format: () => '',
				}}
				axisLeft={null}
				axisRight={{
					legend: 'Número de calificaciones',
					legendPosition: 'middle',
					legendOffset: 40,
				}}
				legends={[
					{
						dataFrom: 'keys',
						anchor: 'bottom',
						direction: 'row',
						translateY: 50,
						toggleSerie: true,
						itemWidth: 100,
						itemHeight: 20,
						symbolSize: 15,
					},
				]}
				onClick={(bar) => {
					setSelectedBar(bar)
				}}
				// barComponent={({ bar, label, tooltip, onClick }) => (
				// 	<rect
				// 		x={bar.x}
				// 		y={bar.y}
				// 		width={bar.width}
				// 		height={bar.height}
				// 		rx={0}
				// 		ry={0}
				// 		fill={bar.color}
				// 		style={{
				// 			cursor: 'pointer',
				// 		}}
				// 		onClick={() => onClick(bar)}
				// 	/>
				// )}
			/>

			{/* Abrir popup con IDS de conversaciones calificadas */}
			{selectedBar && (
				<RateChartPopup
					handleClose={() => setSelectedBar(null)}
					open={Boolean(selectedBar)}
					bar={selectedBar}
				/>
			)}
		</>
	)
}
