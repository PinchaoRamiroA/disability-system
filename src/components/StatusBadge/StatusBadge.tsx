import React from 'react'
import { Badge, Box } from '@mui/material'
import { ContactPhone } from '@mui/icons-material'

interface Props {
	color: string
	floating?: boolean
	directory?: boolean
	children?: React.ReactNode
}

export const StatusBadge = ({
	color,
	floating = true,
	directory = false,
	children,
}: Props) => {
	if (floating) {
		return (
			<Box sx={{ position: 'relative', display: 'inline-block' }}>
				{/* Contenido principal */}

				{directory ? (
					// Mostrar ícono si directory es true
					<React.Fragment>
						{children}
						<Box
							sx={{
								position: 'absolute',
								bottom: -5,
								right: -5,
								height: 20,
								width: 20,
								borderRadius: '50%',
								backgroundColor: color,
								// border: '1px solid #000',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<ContactPhone
								sx={{ fontSize: 12, color: '#fff' }}
							/>
						</Box>
					</React.Fragment>
				) : (
					// Mostrar Badge si directory es false
					<Badge
						overlap="circular"
						variant="dot"
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						sx={{
							'& .MuiBadge-badge': {
								height: 12,
								minWidth: 12,
								borderRadius: '50%',
								border: '1px solid #000',
								backgroundColor: color,
							},
						}}
					>
						{children}
					</Badge>
				)}
			</Box>
		)
	}

	// Mostrar solo el Box simple si floating es false
	return (
		<Box
			mr={2}
			sx={{
				height: 12,
				minWidth: 12,
				borderRadius: '50%',
				border: '1px solid #000',
				backgroundColor: color,
			}}
		/>
	)
}
