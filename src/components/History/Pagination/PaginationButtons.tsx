import React from 'react'
import { Box, Pagination, Stack } from '@mui/material'

interface Props {
	currentPage: number
	totalPages: number
	changePage: (newPage: number) => void
}

export const PaginationButtons = ({
	currentPage,
	totalPages,
	changePage,
}: Props) => {
	const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
		changePage(value)
	}

	return (
		<Box
			py={0.5}
			boxSizing="border-box"
			bgcolor="#F5F5F5"
			borderTop={1}
			borderColor={'#E5E5E5'}
		>
			<Stack alignItems="center">
				<Pagination
					shape="rounded"
					color="primary"
					page={currentPage}
					count={totalPages}
					onChange={handleChange}
				/>
			</Stack>
		</Box>
	)
}
