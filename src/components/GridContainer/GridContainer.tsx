import React from 'react'
import { Grid } from '@mui/material'

type Justify =
	| 'center'
	| 'start'
	| 'end'
	| 'flex-end'
	| 'flex-start'
	| 'space-around'
	| 'space-between'
	| 'space-evenly'

type Props = {
	children: React.ReactNode
	item?: boolean
	justify?: Justify
	spacing?: number
	marginTop?: number
	gap?: number
	px?: number
}

export const GridContainer = ({
	children,
	item,
	justify = 'center',
	spacing = 2,
	marginTop,
	gap,
	px,
}: Props) => {
	return (
		<Grid
			item={item}
			container
			spacing={spacing}
			justifyContent={justify}
			marginTop={marginTop}
			gap={gap}
			px={px}
		>
			{children}
		</Grid>
	)
}
