import React from 'react'
import { FontContextType } from '@/contexts/FontContext'
import { usePreviewTabsContext } from '@/hooks/contexts/usePreviewTabsContext'
import { Box } from '@mui/material'
import { LogoPicker } from '../LogoPicker'
import { FontPicker } from '../FontPicker'
import { HeaderPickers } from './HeaderPickers'
import { FormPickers } from './FormPickers'
import { PopupPickers } from './PopupPickers'
import { ChatPickers } from './ChatPickers'
import { FooterPickers } from './FooterPickers'

export const WidgetPickers = ({ ...props }: FontContextType) => {
	const { tab } = usePreviewTabsContext()

	return (
		<Box>
			{/* Logo */}
			<LogoPicker widget />
			{/* Fuente */}
			<FontPicker {...props} widget />

			{tab < 2 && (
				<>
					<HeaderPickers />
				</>
			)}

			{tab === 0 && (
				<>
					<FormPickers />
				</>
			)}

			{/* Asesor humano */}
			{tab === 1 && (
				<>
					<ChatPickers />
					<FooterPickers />
				</>
			)}

			{/* Popup */}
			{tab === 2 && (
				<>
					<PopupPickers />
				</>
			)}
		</Box>
	)
}
