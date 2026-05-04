import React, { useState } from 'react'
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	IconButton,
	Paper,
	Tooltip,
	Typography,
} from '@mui/material'
import { useRegionalContext } from './Context'
import { Delete, Edit, ExpandMore } from '@mui/icons-material'
import { Department, Region } from '@/types/Locations'

interface Props {
	handleDeparmentClick: (department: Department) => void
	handleRegionalUpdateClick: (regional: Region) => void
	handleRegionalDeleteClick: (regional: Region) => void
}

export const ResponsiveRegionalsList = ({
	handleDeparmentClick,
	handleRegionalDeleteClick,
	handleRegionalUpdateClick,
}: Props) => {
	const { currentRegional, setRegional, regionales } = useRegionalContext()
	const [deptoHover, setDeptoHover] = useState<number | null>(null)
	const [regionHover, setRegionHover] = useState<number | null>(null)

	if (regionales.length === 0) return null

	return (
		<React.Fragment>
			{regionales.map((regional) => {
				const selected = regional.id === currentRegional?.id
				const hover = regional.id === regionHover

				return (
					<Accordion key={regional.id}>
						<AccordionSummary
							expandIcon={<ExpandMore />}
							aria-controls={`panel${regional.id}a-content`}
							id={`panel${regional.id}a-header`}
							onClick={() => setRegional(regional)}
							onMouseEnter={() => setRegionHover(regional.id)}
							onMouseLeave={() => setRegionHover(null)}
						>
							<Typography>{regional.name}</Typography>
							&nbsp; &nbsp;
							{/* Acciones */}
							<Box
								sx={{
									visibility:
										selected || hover
											? 'visible'
											: 'hidden',
								}}
							>
								{/* Editar */}
								<Tooltip title="Actualizar regional">
									<IconButton
										sx={{ p: 0 }}
										onClick={() =>
											handleRegionalUpdateClick(regional)
										}
									>
										<Edit />
									</IconButton>
								</Tooltip>
								&nbsp;&nbsp;
								{/* Eliminar */}
								{regional.departaments.length === 0 && (
									<Tooltip title="Eliminar regional">
										<IconButton
											sx={{ p: 0 }}
											onClick={() =>
												handleRegionalDeleteClick(
													regional
												)
											}
										>
											<Delete />
										</IconButton>
									</Tooltip>
								)}
							</Box>
						</AccordionSummary>
						<AccordionDetails
							sx={{
								display: 'flex',
								flexWrap: 'wrap',
								backgroundColor: '#f1f1f1',
								borderColor: '#ccc',
							}}
						>
							{regional.departaments.map((depto) => (
								<Box key={depto.id}>
									<Box
										mb={1}
										mr={1}
										p={1}
										component={Paper}
										display={'flex'}
										justifyContent={'space-between'}
										alignItems={'center'}
										onMouseEnter={() =>
											setDeptoHover(depto.id)
										}
										onMouseLeave={() => setDeptoHover(null)}
									>
										{depto.name}
										<Tooltip title="Cambiar de regional">
											<IconButton
												sx={{
													visibility:
														depto.id === deptoHover
															? 'visible'
															: 'hidden',
												}}
												onClick={() =>
													handleDeparmentClick(depto)
												}
											>
												<Edit />
											</IconButton>
										</Tooltip>
									</Box>
								</Box>
							))}
							{regional.departaments.length === 0 && (
								<Typography align="center">
									Esta regional no tiene departamentos
									asociados
								</Typography>
							)}
						</AccordionDetails>
					</Accordion>
				)
			})}
		</React.Fragment>
	)
}
