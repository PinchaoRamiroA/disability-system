import React, { useEffect, useRef, useState } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import InputColor from 'react-pick-color'
import { Refresh } from '@mui/icons-material'

interface Props {
	label: string
	color: string
	initColor?: string
	position?: 'top' | 'bottom'
	setColor: (newValue: string) => void
}

export const ColorPicker = ({
	color,
	label,
	setColor,
	initColor = '#fff',
	position = 'bottom',
}: Props) => {
	const colorRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const [recentColors, setRecentColors] = useState<string[]>([])

	const handleClick = () => {
		setOpen(!open)
	}

	// Resetear color
	const handleReset = () => {
		setColor(initColor)
		setRecentColors([])
	}

	// Seleccionar color
	const handleChange = (color: string) => {
		setColor(color)
	}

	useEffect(() => {
		if (color.length) {
			setRecentColors([...recentColors, color])
		}
	}, [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				colorRef.current &&
				!colorRef.current.contains(event.target as Node)
			) {
				setOpen(false)
			}
		}

		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setOpen(false)
			}
		}

		if (open) {
			document.addEventListener('mousedown', handleClickOutside)
			document.addEventListener('keydown', handleEscKey)
		} else {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscKey)

			// Guardar último color seleccionado como color reciente
			if (color.length && !recentColors.includes(color)) {
				setRecentColors([...recentColors, color])
			}
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscKey)
		}
	}, [open])

	return (
		<Box position="relative">
			<Box
				display="flex"
				borderBottom={1}
				borderColor="#ccc"
				mb={1}
				justifyContent="space-between"
				alignItems="center"
			>
				<Box
					display="flex"
					alignItems={'center'}
					onClick={handleClick}
					sx={{ cursor: 'pointer' }}
					p={1}
				>
					<Box
						sx={{ backgroundColor: color, width: 20, height: 20 }}
						component="div"
						mr={1}
					/>
					<Typography>{label}</Typography>
				</Box>
				<IconButton
					sx={{
						ml: 1,
						visibility: initColor !== color ? 'visible' : 'hidden',
					}}
					onClick={handleReset}
				>
					<Tooltip title="Descartar cambio">
						<Refresh />
					</Tooltip>
				</IconButton>
			</Box>
			{open && (
				<Box
					ref={colorRef}
					width={0}
					position="absolute"
					sx={{
						left: 40,
						bottom: position === 'top' ? 0 : '',
						top: position === 'bottom' ? 0 : '',
						zIndex: 1000,
					}}
				>
					<InputColor
						color={color}
						onChange={(color) => handleChange(color.hex)}
						hideAlpha
						presets={recentColors}
					/>
				</Box>
			)}
		</Box>
	)
}
