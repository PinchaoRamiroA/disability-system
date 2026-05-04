import { useMemo, useState } from 'react'
import { Fuente } from '@/types/Settings/General/Dashboard'
import { GoogleFont } from '@/types/Settings/General/Widget'
import { SxProps } from '@mui/material'

export const useFontConfigState = () => {
	const [fontSelected, setFontSelected] = useState<GoogleFont | null>(null)
	const [fontVariant, setFontVariant] = useState<string>('')
	const [fontStyles, setFontStyles] = useState<SxProps>()

	const setFont = (fuente: Fuente) => {
		const { category, family, variant } = fuente
		setFontStyles({
			fontFamily: `${family}, ${category}`,
			fontStyle: variant.includes('italic') ? 'italic' : 'normal',
			fontWeight: isNaN(parseInt(variant)) ? 'normal' : parseInt(variant),
		})
		setFontSelected({
			category,
			family,
			variants: [],
		})
		setFontVariant(variant)
	}

	return useMemo(() => {
		return {
			fontSelected,
			fontStyles,
			fontVariant,
			setFontSelected,
			setFontStyles,
			setFontVariant,
			setFont,
		}
	}, [
		fontSelected,
		fontStyles,
		fontVariant,
		setFontSelected,
		setFontStyles,
		setFontVariant,
	])
}
