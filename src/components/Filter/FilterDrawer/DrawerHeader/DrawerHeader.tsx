import { Button, IconButton, Typography } from '@mui/material'
import React from 'react'
import { Header } from './styles'
import CloseIcon from '@mui/icons-material/Close'
import { useFilterContext } from '@/hooks/contexts/useFilterContext'

interface Props {
	resetFilters: () => void
}

export const DrawerHeader = ({ resetFilters }: Props) => {
	const handleResetFilter = () => resetFilters()
	const { closeFilters } = useFilterContext()

	return (
		<Header>
			<Typography
				variant="body1"
				component="div"
				sx={{
					ml: 4,
					fontWeight: 700,
				}}
			>
				Filtrar
			</Typography>
			<div>
				<Button onClick={handleResetFilter} variant="outlined">
					Resetear
				</Button>
				<IconButton
					onClick={closeFilters}
					sx={{ ml: 2 }}
					color="inherit"
					aria-label="cerrar barra de filtros"
				>
					<CloseIcon />
				</IconButton>
			</div>
		</Header>
	)
}
