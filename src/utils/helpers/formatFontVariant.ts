export const getFontStyles = (variant: string) => {
	return {
		fontStyle: variant.includes('italic') ? 'italic' : 'normal',
		fontWeight: isNaN(parseInt(variant)) ? 'normal' : parseInt(variant),
	}
}
