import React, { useEffect, useState } from 'react'
import { ConfirmationModal } from '@/components/Dialog'
import { useAppSelector } from '@/hooks/useReduxHooks'
import { plantillasRespuestaSelector } from '@/store/slices/settings/asesor-humano'
import { NormalizedPlantillaRespuesta } from '@/types/Settings/asesor-humano/plantillas-respuesta'
import { Box, Grid, List, Typography } from '@mui/material'
import { ItemListaPlantilla } from './ItemListaPlantilla'
import { GridContainer } from '@/components/GridContainer'
import ReactMarkdown from 'react-markdown'
import { SearchInput } from '@/components/SearchInput'

interface Props {
	open: boolean
	handleClose: () => void
	setMessage: (message: string) => void
}

export const VerPlantillasRespuesta = ({
	handleClose,
	open,
	setMessage,
}: Props) => {
	const { resource } = useAppSelector(plantillasRespuestaSelector)

	// Plantilla seleccionada
	const [plantillaSelected, setPlantillaSelected] =
		useState<NormalizedPlantillaRespuesta | null>(null)
	// Plantillas filtradas
	const [plantillasFiltradas, setPlantillasFiltradas] = useState<
		NormalizedPlantillaRespuesta[]
	>([])

	// Actualizar plantillas filtradas
	const filtrarPlantillas = (
		nuevasPlantillas: NormalizedPlantillaRespuesta[]
	) => {
		setPlantillaSelected(null)
		setPlantillasFiltradas(nuevasPlantillas)
	}

	// Abrir modal cuando hayan datos para mostrar
	useEffect(() => {
		filtrarPlantillas(resource)
	}, [resource, open])

	// Confirmar acción
	const handleConfirm = () => {
		if (plantillaSelected) {
			setMessage(plantillaSelected.templateContent)
			handleClose()
		}
	}

	return (
		<ConfirmationModal
			confirmAction={handleConfirm}
			handleClose={handleClose}
			open={open}
			title="Seleccionar plantilla de respuesta"
			confirmButtonText="Seleccionar"
			disableButton={!plantillaSelected}
			styles={{
				width: '90%',
				marginX: 'auto',
			}}
		>
			{resource.length === 0 && (
				<Typography>No hay plantillas registradas</Typography>
			)}

			<GridContainer>
				<Grid item xs={12}>
					<SearchInput
						filterBy={['templateName', 'templateContent']}
						label="Buscar plantilla"
						listElements={resource}
						onSubmit={filtrarPlantillas}
					/>
				</Grid>

				<Grid item xs md={4}>
					<List
						component="nav"
						aria-label="main mailbox folders"
						sx={{
							overflow: 'auto',
							paddingTop: 0,
							flexGrow: 1,
							border: 1,
							borderTopLeftRadius: 10,
							borderTopRightRadius: 10,
							py: 0,
							borderColor: '#b4b4b4',
							height: '50vh',
						}}
					>
						{plantillasFiltradas.map((plantilla) => (
							<ItemListaPlantilla
								handleClick={() =>
									setPlantillaSelected(plantilla)
								}
								selected={
									plantillaSelected?.idTemplate ===
									plantilla.idTemplate
								}
								templateName={plantilla.templateName}
								key={plantilla.id}
							/>
						))}
					</List>
				</Grid>
				<Grid item xs md={8}>
					<Box
						border={1}
						px={2}
						borderRadius={2}
						borderColor={'#b4b4b4'}
						bgcolor={plantillaSelected ? '#f5f5f5' : ''}
						sx={{
							overflow: 'auto',
							height: '50vh',
						}}
					>
						<ReactMarkdown>
							{plantillaSelected
								? plantillaSelected.templateContent
								: 'Selecciona una plantilla'}
						</ReactMarkdown>
					</Box>
				</Grid>
			</GridContainer>
		</ConfirmationModal>
	)
}
