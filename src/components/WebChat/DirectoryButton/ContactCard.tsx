import React from 'react'
import {
	Card,
	CardContent,
	Typography,
	Box,
	Grid,
	Tooltip,
} from '@mui/material'
import { Phone, Email, LocationOn } from '@mui/icons-material'
import { Contact } from '@/types/Settings/asesor-humano/directorio'

interface Props {
	contact: Contact
	handleSelectContact: (contact: Contact) => void
	isSelected: boolean
	handleConfirmSelection: () => void
}

export const ContactCard = ({
	contact,
	handleSelectContact,
	isSelected,
	handleConfirmSelection,
}: Props) => {
	return (
		<Grid item xs={12} sm={4}>
			<Tooltip title="Haz doble click para confirmar">
				<Card
					sx={{
						m: 1,
						height: '100%', // Para que todas las tarjetas tengan la misma altura
						transition: '0.3s',
						transform: isSelected ? 'scale(1.05)' : 'none',
						boxShadow: isSelected ? 6 : 1,
						cursor: 'pointer',
						'&:hover': {
							transform: 'scale(1.05)',
							boxShadow: 6,
						},
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between', // Mantener la consistencia interna
					}}
					onClick={() => handleSelectContact(contact)}
					onDoubleClick={handleConfirmSelection}
				>
					<CardContent sx={{ lineBreak: 'anywhere' }}>
						<Typography variant="h6" component="div">
							{contact.name}
						</Typography>
						<Box display="flex" alignItems="flex-start">
							<Phone fontSize="small" />
							<Typography
								variant="body2"
								color="text.secondary"
								ml={1}
							>
								{contact.phone}
							</Typography>
						</Box>
						{contact.email?.length > 0 && (
							<Box display="flex" alignItems="flex-start" mt={1}>
								<Email fontSize="small" />
								<Typography
									variant="body2"
									color="text.secondary"
									ml={1}
								>
									{contact.email}
								</Typography>
							</Box>
						)}
						<Box display="flex" alignItems="flex-start" mt={1}>
							<LocationOn fontSize="small" />
							<Typography
								variant="body2"
								color="text.secondary"
								ml={1}
							>
								{`${contact.city}, ${contact.department}`}
							</Typography>
						</Box>
					</CardContent>
				</Card>
			</Tooltip>
		</Grid>
	)
}
