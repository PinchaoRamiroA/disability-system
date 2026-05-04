import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import { getGoogleFonts, googleFontsSelector } from '@/store/slices/googleFonts'
import { GoogleFont } from '@/types/Settings/General/Widget'
import {
	Autocomplete,
	Grid,
	IconButton,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import {
	dashboardPreviewSelector,
	updateFontSelected,
	updateFontVariant,
} from '@/store/slices/dashboard-config-preview'
import { getFontStyles } from '@/utils/helpers/formatFontVariant'
import { Refresh } from '@mui/icons-material'
import { FontContextType } from '@/contexts/FontContext'
import { IsWidgetConfig } from '@/types/Settings/General/Dashboard'
import {
	updateWidgetFontSelected,
	updateWidgetFontVariant,
	widgetPreviewSelector,
} from '@/store/slices/widget-config-preview'

const additionalFonts: GoogleFont[] = [
	{
		category: 'Helvetica',
		family: 'Kuro-Regular',
		variants: [
			'100',
			'200',
			'italic',
			'300',
			'400',
			'500',
			'600',
			'regular',
		],
	},
]

export const FontPicker = ({
	fontSelected,
	fontVariant,
	setFontSelected,
	setFontStyles,
	setFontVariant,
	fontStyles,
	widget,
}: FontContextType & IsWidgetConfig) => {
	const dispatch = useAppDispatch()
	const { resource: googleFonts } = useAppSelector(googleFontsSelector)
	const { fuente: fuenteDashboard } = useAppSelector(dashboardPreviewSelector)
	const { font: fuenteWidget } = useAppSelector(widgetPreviewSelector)

	// Fuente y variante obtenidas de la configuración actual
	const [defaultFont, setDefaultFont] = useState<GoogleFont | null>(null)
	const [defaultVariant, setDefaultVariant] = useState<string | null>(null)

	const [fontVariants, setFontVariants] = useState<string[]>([])
	const [font, setFont] = useState<GoogleFont | null>(null)
	const [variantSelected, setVariantSelected] = useState<string | null>(null)

	// Manejador de selección de fuente
	const handleFontChange = (value: GoogleFont | null) => {
		console.log('FONT', value)
		// Setear valores en el context
		setFontSelected(value)
		setFontVariant('') // Se resetea

		// Setear valores de state local
		setFont(value)
		setVariantSelected(null) // Se resetea variante

		// Fuente seleccionada es válida
		if (value) {
			// Resetear variantes
			const variants = [...value.variants]
			setFontVariants(variants.sort((a, b) => (a > b ? 1 : -1)))
			setFontStyles({
				fontFamily: `${value.family}, ${value.category}`,
			})
			// Actualizar reducer
			if (widget) {
				dispatch(
					updateWidgetFontSelected({
						category: value.category,
						family: value.family,
						variant: '',
					})
				)
			} else {
				dispatch(
					updateFontSelected({
						category: value.category,
						family: value.family,
						variant: '',
					})
				)
			}
		} else {
			// Resetear variantes
			setFontVariants([])
			// Actualizar context
			setFontStyles({
				fontFamily: null,
				fontStyle: 'normal',
				fontWeight: 'normal',
			})
			// Actualizar reducer
			if (widget) {
				dispatch(
					updateWidgetFontSelected({
						category: '',
						family: '',
						variant: '',
					})
				)
			} else {
				dispatch(
					updateFontSelected({
						category: '',
						family: '',
						variant: '',
					})
				)
			}
		}
	}

	// Manejador de selección de variantes
	const handleVariantChange = (value: string | null) => {
		setVariantSelected(value)

		// Variante seleccionada
		if (value) {
			setFontVariant(value) // Font variant del context
			setFontStyles({
				...fontStyles,
				...getFontStyles(value),
			})
			// Actualizar reducer
			if (widget) {
				dispatch(updateWidgetFontVariant(value))
			} else {
				dispatch(updateFontVariant(value))
			}
		} else {
			if (widget) {
				dispatch(updateWidgetFontVariant(''))
			} else {
				dispatch(updateFontVariant(''))
			}
		}
	}

	const handleReset = () => {
		// Setear fuente local con valor de context
		handleFontChange(defaultFont)
		// Setear variante
		handleVariantChange(defaultVariant)
	}

	useEffect(() => {
		dispatch(getGoogleFonts())
	}, [])

	useEffect(() => {
		// Buscar fuente de context en fuentes obtenidos de Google
		const _font = googleFonts.find(
			(gf) => gf.family === fontSelected?.family
		)

		if (_font) {
			setDefaultFont(_font)
			setDefaultVariant(fontVariant)

			// Setear fuente local con valor de context
			handleFontChange(_font)
			// Setear variante
			handleVariantChange(fontVariant)
		}
	}, [googleFonts])

	// Validar si se reseteó la fuente desde el botón "DESCARTAR CAMBIOS"
	useEffect(() => {
		if (widget) {
			if (fuenteWidget.family === defaultFont?.family) {
				if (fuenteWidget.variant === defaultVariant) {
					console.log('DISCARD FONT')
					// handleReset()
				}
			}
		} else {
			if (fuenteDashboard.family === defaultFont?.family) {
				if (fuenteDashboard.variant === defaultVariant) {
					console.log('DISCARD FONT')
					// handleReset()
				}
			}
		}
	}, [fuenteDashboard, fuenteWidget, defaultFont, defaultVariant])

	return (
		<Grid item container xs={12} flexDirection={'column'} my={2} gap={1}>
			<Grid
				item
				xs={12}
				justifyContent="space-between"
				alignItems="center"
				display="flex"
			>
				<Typography variant="h6">Seleccionar fuente</Typography>
				<IconButton
					sx={{
						ml: 1,
						visibility:
							defaultFont !== font ||
							defaultVariant !== variantSelected
								? 'visible'
								: 'hidden',
					}}
					onClick={handleReset}
				>
					<Tooltip title="Descartar cambio">
						<Refresh />
					</Tooltip>
				</IconButton>
			</Grid>
			<Grid item xs={12}>
				<Autocomplete
					options={googleFonts
						.concat(additionalFonts)
						.sort((a, b) => (a.family > b.family ? 1 : -1))}
					getOptionLabel={(option) => option.family ?? ''}
					isOptionEqualToValue={(option, value) =>
						option.family === value.family
					}
					value={font}
					fullWidth
					onChange={(_, value) => handleFontChange(value)}
					renderOption={(props, option) => (
						<li {...props} key={option.family}>
							{option.family}
						</li>
					)}
					renderInput={(params) => (
						<TextField {...params} name="family" label="Familia" />
					)}
					ListboxProps={{
						style: { backgroundColor: '#f9f9f9' },
					}}
					size="small"
					disableCloseOnSelect
				/>
			</Grid>
			<Grid item xs={12}>
				<Autocomplete
					options={fontVariants}
					getOptionLabel={(option) => option ?? ''}
					value={variantSelected}
					fullWidth
					onChange={(_, value) => handleVariantChange(value)}
					renderInput={(params) => (
						<TextField
							{...params}
							name="variant"
							label="Variante"
						/>
					)}
					size="small"
					disableCloseOnSelect
				/>
			</Grid>
		</Grid>
	)
}
