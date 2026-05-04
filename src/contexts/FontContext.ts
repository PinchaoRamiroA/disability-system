import React from 'react'
import { GoogleFont } from '@/types/Settings/General/Widget'
import { SxProps } from '@mui/material'

export type FontContextType = {
	fontSelected: GoogleFont | null
	fontStyles?: SxProps
	fontVariant: string
	setFontSelected: (newFont: GoogleFont | null) => void
	setFontStyles: (value: SxProps) => void
	setFontVariant: (value: string) => void
}

export const FontContext = React.createContext<FontContextType | null>(null)
