import React, { useState } from 'react'
import {
	Box,
	Grid,
	IconButton,
	List,
	ListItemButton,
	Paper,
	Skeleton,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material'
import { useRegionalContext } from './Context'
import { GridContainer } from '@/components/GridContainer'
import { Delete, Edit } from '@mui/icons-material'
import { Department, Region } from '@/types/Locations'

interface Props {
	loading: boolean
	handleDeparmentClick: (department: Department) => void
	handleRegionalUpdateClick: (regional: Region) => void
	handleRegionalDeleteClick: (regional: Region) => void
}

export const RegionalsList = ({
	loading,
	handleDeparmentClick,
	handleRegionalDeleteClick,
	handleRegionalUpdateClick,
}: Props) => {
	const { currentRegional, setRegional, regionales } = useRegionalContext()
	const [deptoHover, setDeptoHover] = useState<number | null>(null)
	const [regionHover, setRegionHover] = useState<number | null>(null)

	return (
		<GridContainer>
			{regionales.length > 0 ? (
				<>
					<Grid item xs={4}>
						<Paper>
							{loading && (
								<Box p={1}>
									<Stack spacing={2}>
										<Skeleton
											variant="rounded"
											height={40}
										/>
										<Skeleton
											variant="rounded"
											height={40}
										/>
										<Skeleton
											variant="rounded"
											height={40}
										/>
										<Skeleton
											variant="rounded"
											height={40}
										/>
									</Stack>
								</Box>
							)}

							<List sx={{ py: 0.5 }}>
								{regionales.map((regional, index) => {
									const selected =
										regional.id === currentRegional?.id
									const hover = regional.id === regionHover

									return (
										<ListItemButton
											key={regional.id}
											onClick={() =>
												setRegional(regional)
											}
											onMouseEnter={() =>
												setRegionHover(regional.id)
											}
											onMouseLeave={() =>
												setRegionHover(null)
											}
											selected={selected}
											sx={{
												borderTop:
													index > 0
														? '1px solid #f0f0f0'
														: '',
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											{regional.name}

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
														onClick={() =>
															handleRegionalUpdateClick(
																regional
															)
														}
													>
														<Edit />
													</IconButton>
												</Tooltip>
												{/* Eliminar */}
												{regional.departaments
													.length === 0 && (
													<Tooltip title="Eliminar regional">
														<IconButton
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
										</ListItemButton>
									)
								})}
							</List>
						</Paper>
					</Grid>
					<Grid item xs={8}>
						{loading && <Skeleton variant="rounded" height={40} />}

						{currentRegional && (
							<Box
								p={2}
								border={1}
								borderRadius={2}
								borderColor={'#ccc'}
								bgcolor={'#f1f1f1'}
							>
								{currentRegional && (
									<React.Fragment>
										<GridContainer justify="flex-start">
											<Grid item xs={12}>
												<Typography variant="body1">
													Departamentos asociados a la
													regional{' '}
													<strong>
														{currentRegional.name}
													</strong>
												</Typography>
											</Grid>
											{currentRegional.departaments.map(
												(depto) => (
													<Grid
														item
														xs={4}
														key={depto.id}
													>
														<Box
															mb={1}
															mr={1}
															p={1}
															component={Paper}
															elevation={3}
															display={'flex'}
															justifyContent={
																'space-between'
															}
															alignItems={
																'center'
															}
															onMouseEnter={() =>
																setDeptoHover(
																	depto.id
																)
															}
															onMouseLeave={() =>
																setDeptoHover(
																	null
																)
															}
														>
															{depto.name}
															<Tooltip title="Cambiar de regional">
																<IconButton
																	sx={{
																		visibility:
																			depto.id ===
																			deptoHover
																				? 'visible'
																				: 'hidden',
																	}}
																	onClick={() =>
																		handleDeparmentClick(
																			depto
																		)
																	}
																>
																	<Edit />
																</IconButton>
															</Tooltip>
														</Box>
													</Grid>
												)
											)}
										</GridContainer>
										{/* <Box display={'flex'} flexWrap={'wrap'} mt={1}>

											{currentRegional.departaments.length ===
												0 && (
												<Typography variant="body2">
													Esta regional no tiene departamentos
													asociados
												</Typography>
											)}
										</Box> */}
									</React.Fragment>
								)}
							</Box>
						)}

						{!currentRegional && !loading && (
							<Typography variant="h6">
								Seleccione la regional a configurar.
							</Typography>
						)}
					</Grid>
				</>
			) : (
				<Typography variant="h6">
					No hay regionales para mostrar.
				</Typography>
			)}
		</GridContainer>
	)
}
