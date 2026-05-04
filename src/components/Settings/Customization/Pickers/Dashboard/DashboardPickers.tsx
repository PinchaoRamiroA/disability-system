import React from 'react'
import { Box } from '@mui/material'
import { usePreviewTabsContext } from '@/hooks/contexts/usePreviewTabsContext'

import { FontContextType } from '@/contexts/FontContext'
import { LogoPicker } from '../LogoPicker'
import { FontPicker } from '../FontPicker'
import { AppbarPicker } from './AppbarPicker'
import { PrimaryColorPicker } from './PrimaryColorPicker'
import { SecondaryColorPicker } from './SecondaryColorPicker'
import { ChatHeaderPicker } from './HumanAgent/ChatHeaderPicker'
import { ChatBodyPickers } from './HumanAgent/ChatBodyPickers'
import { FooterPicker } from './HumanAgent/FooterPicker'

export const DashboardPickers = ({ ...props }: FontContextType) => {
	const { tab } = usePreviewTabsContext()

	return (
		<Box>
			{/* Logo */}
			<LogoPicker />
			{/* Fuente */}
			<FontPicker {...props} />
			{/* Appbar */}
			<AppbarPicker />

			{tab === 0 && (
				<>
					{/* Color principal */}
					<PrimaryColorPicker />
					{/* Color secundario */}
					<SecondaryColorPicker />
				</>
			)}

			{/* Asesor humano */}
			{tab === 1 && (
				<>
					<ChatHeaderPicker />
					<ChatBodyPickers />
					<FooterPicker />
				</>
			)}
		</Box>
	)
}
