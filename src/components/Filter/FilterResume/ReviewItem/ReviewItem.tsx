import React from 'react'
import { Box, Chip, Typography } from '@mui/material'
import { useFilterContext } from '@/hooks/contexts/useFilterContext'
import { FilterName } from '@/types/Filter/Filter'
// import { Container } from './styles'

interface Props {
	filterName?: FilterName
	title?: string
	none?: boolean
	data: string
	removeFilter?: (() => void) | ((id: number) => void)
}

export const ReviewItem = ({
	title,
	data,
	none = false,
	removeFilter,
	filterName,
}: Props) => {
	return (
		<Box marginRight={1}>
			{title && (
				<Typography variant="body2" component="span" marginRight={1}>
					{title}
				</Typography>
			)}

			<RenderChip
				data={data}
				none={none}
				removeFilter={removeFilter}
				filterName={filterName}
			/>
		</Box>
	)
}

const RenderChip = ({ data, none, removeFilter, filterName }: Props) => {
	const { setClickedFilter } = useFilterContext()
	if (none) {
		return (
			<Chip
				label={data}
				variant="outlined"
				{...(filterName && {
					onClick: () => setClickedFilter(filterName),
				})}
			/>
		)
	}

	return (
		<Chip
			label={data}
			// variant="outlined"
			color="primary"
			onDelete={removeFilter}
			{...(filterName && {
				onClick: () => setClickedFilter(filterName),
			})}
		/>
	)
}
