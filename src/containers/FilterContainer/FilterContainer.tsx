import React from 'react'
import { Box } from '@mui/material'

interface Props {
	children?: React.ReactNode
}

export const FilterContainer = ({ children }: Props) => {
	return <Box>{children}</Box>
}