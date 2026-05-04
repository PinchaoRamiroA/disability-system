import React from 'react'
import { BarDatum, ComputedBarDatum, Bar } from '@nivo/bar'
import { ColorSchemeId } from '@nivo/colors'

import { useChartWidth } from '@/hooks/useChartWidth'
import { BarChart } from '@/types/Charts'

interface Props {
  bar: ComputedBarDatum<BarDatum>
}
const BarComponent = ({ bar }: Props) => {
  return (
    <g transform={`translate(${bar.x},${bar.y})`}>
      <rect
        x={-3}
        y={7}
        width={bar.width}
        height={bar.height}
        fill="rgba(0, 0, 0, .07)"
      />
      <rect width={bar.width} height={bar.height} fill={bar.color} />
      <rect
        x={bar.width - 5}
        width={5}
        height={bar.height}
        // fill={borderColor}
        fillOpacity={0.2}
      />
      <text
        x={bar.width - 16}
        y={bar.height / 2 - 8}
        textAnchor="end"
        dominantBaseline="central"
        fill="black"
        style={{
          fontWeight: 900,
          fontSize: 15,
        }}
      >
        {bar.data.indexValue}
      </text>
      <text
        x={bar.width - 16}
        y={bar.height / 2 + 10}
        textAnchor="end"
        dominantBaseline="central"
        // fill={borderColor}
        style={{
          fontWeight: 400,
          fontSize: 13,
        }}
      >
        {bar.data.value}
      </text>
    </g>
  )
}

interface ChartData {
  data: BarChart[]
  colorsArray?: string[]
  colorsSchema?: ColorSchemeId
  margin?: {
    top?: number
    left?: number
    bottom?: number
    right?: number
  }
}

export const RaceChart = ({
  data,
  colorsArray,
  colorsSchema,
  margin = { top: 26, bottom: 26, left: 60, right: 120 },
}: ChartData) => {
  const { width } = useChartWidth({})

  return (
    <>
      <Bar
        width={width}
        height={300}
        layout="horizontal"
        margin={margin}
        data={data}
        indexBy="id"
        keys={['value', 'values']}
        colors={colorsArray ?? { scheme: colorsSchema || 'nivo' }}
        colorBy="indexValue"
        borderColor={{ from: 'color', modifiers: [['darker', 2.6]] }}
        enableGridX
        enableGridY={false}
        axisTop={{ format: (val) => Math.floor(val) === val && val }}
        axisBottom={null}
        axisLeft={null}
        padding={0.3}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
        isInteractive={false}
        layers={['grid', 'axes', 'bars', 'markers', 'legends', 'annotations']}
        barComponent={BarComponent}
      />
    </>
  )
}
