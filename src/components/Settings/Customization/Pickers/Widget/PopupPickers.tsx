import React, { useEffect, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import { ColorPicker } from '@/components/Settings/ColorPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxHooks'
import {
	updatePopupBody,
	updatePopupDefaultBtn,
	updatePopupHeader,
	updatePopupPrimaryBtn,
	widgetPreviewSelector,
} from '@/store/slices/widget-config-preview'
import { widgetCurrentColorsSelector } from '@/store/slices/widgetConfig'

export const PopupPickers = () => {
	const dispatch = useAppDispatch()
	const {
		colores: {
			popups: { body, buttons, header },
		},
	} = useAppSelector(widgetPreviewSelector)
	const {
		popups: {
			body: currentBody,
			buttons: currentButtons,
			header: currentHeader,
		},
	} = useAppSelector(widgetCurrentColorsSelector)

	const [bgHeader, setBgHeader] = useState(header.background)
	const [colHeader, setColHeader] = useState(header.color)

	const [bgBody, setBgBody] = useState(body.background)
	const [colBody, setColBody] = useState(body.color)

	const [bgBtnP, setBgBtnP] = useState(buttons.primary.background)
	const [colBtnP, setColBtnP] = useState(buttons.primary.color)

	const [bgBtnD, setBgBtnD] = useState(buttons.default.background)
	const [colBtnD, setColBtnD] = useState(buttons.default.color)

	useEffect(() => {
		dispatch(updatePopupHeader({ background: bgHeader, color: colHeader }))
	}, [bgHeader, colHeader])

	useEffect(() => {
		dispatch(updatePopupBody({ background: bgBody, color: colBody }))
	}, [bgBody, colBody])

	useEffect(() => {
		dispatch(updatePopupPrimaryBtn({ background: bgBtnP, color: colBtnP }))
	}, [bgBtnP, colBtnP])

	useEffect(() => {
		dispatch(updatePopupDefaultBtn({ background: bgBtnD, color: colBtnD }))
	}, [bgBtnD, colBtnD])

	return (
		<Grid item container xs={12} gap={0.5} flexDirection={'column'}>
			<Grid item xs={12}>
				<Typography variant="h6">Popups</Typography>
			</Grid>

			{/* Header popup */}
			<Grid item xs="auto">
				<Typography>Header</Typography>
				<ColorPicker
					color={bgHeader}
					label="Color de fondo"
					setColor={setBgHeader}
					initColor={currentHeader.background}
				/>
				<ColorPicker
					color={colHeader}
					label="Color de fuente"
					setColor={setColHeader}
					initColor={currentHeader.color}
				/>
			</Grid>
			<Grid item xs={12} />

			{/* Body */}
			<Grid item xs="auto">
				<Typography>Body</Typography>
				<ColorPicker
					color={bgBody}
					label="Color de fondo"
					setColor={setBgBody}
					initColor={currentBody.background}
				/>
				<ColorPicker
					color={colBody}
					label="Color de fuente"
					setColor={setColBody}
					initColor={currentBody.color}
				/>
			</Grid>
			<Grid item xs={12} />

			{/* Botones */}
			<Grid item xs="auto">
				<Typography>Botón principal</Typography>
				<ColorPicker
					color={bgBtnP}
					label="Color de fondo"
					setColor={setBgBtnP}
					initColor={currentButtons.primary.background}
				/>
				<ColorPicker
					color={colBtnP}
					label="Color de fuente"
					setColor={setColBtnP}
					initColor={currentButtons.primary.color}
				/>
			</Grid>
			<Grid item xs={12} />

			<Grid item xs="auto">
				<Typography>Botón secundario</Typography>
				<ColorPicker
					color={bgBtnD}
					label="Color de fondo"
					setColor={setBgBtnD}
					initColor={currentButtons.default.background}
				/>
				<ColorPicker
					color={colBtnD}
					label="Color de fuente"
					setColor={setColBtnD}
					initColor={currentButtons.default.color}
				/>
			</Grid>
		</Grid>
	)
}
