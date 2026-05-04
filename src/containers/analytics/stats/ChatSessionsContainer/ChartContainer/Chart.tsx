import { Bar } from '@nivo/bar'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { useTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import { useWindowSize } from '@/hooks/useWindowSize'
import { drawerSelector } from '@/store/slices/drawer'
import { BarChart } from '@/types/Charts'
import { useFormatChartDates } from '@/hooks/estadisticas/useFormatChartDates'

interface Props {
	data: BarChart[]
	keys: string[]
	colors: string[]
	legends: BarChart
}

export const Chart = ({ data, keys, colors, legends }: Props) => {
	const theme = useTheme()
	const size = useWindowSize()
	const lgBreakpoint = useMediaQuery(theme.breakpoints.down('lg'))
	const mediumScreenSize = 900
	const [width, setWidth] = useState(mediumScreenSize)

	const { open: drawerOpen, drawerWidth } = useAppSelector(drawerSelector)
	const { format } = useFormatChartDates(data)

	const calcWidth = () => {
		let newWidth = mediumScreenSize

		if (drawerOpen && !lgBreakpoint) {
			newWidth -= drawerWidth ?? 0
		}

		if (size.width) {
			if (size.width > mediumScreenSize) {
				newWidth += size.width - mediumScreenSize
			}
		}
		setWidth(newWidth)
	}

	useEffect(() => {
		calcWidth()
	}, [size, drawerOpen])

	return (
		<Bar
			width={width - 100}
			height={350}
			data={data}
			keys={keys}
			indexBy="date"
			margin={{ top: 60, right: 130, bottom: 50, left: 60 }}
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
			animate={true}
			axisTop={null}
			axisLeft={{
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legendPosition: 'middle',
				legendOffset: -40,
			}}
			axisBottom={{ format }}
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
					anchor: 'top-left',
					direction: 'row',
					justify: false,
					translateX: -20,
					translateY: -50,
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
