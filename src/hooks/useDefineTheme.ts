import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { useEffect, useMemo } from 'react'
import { esES } from '@mui/material/locale'
import { themeOptions } from 'config/themeOptions'
import { importGoogleFont } from '@/utils/helpers/importGoogleFont'

export const useDefineTheme = () => {
	useEffect(() => {
        importGoogleFont();
    }, []);

	return useMemo(
		() => responsiveFontSizes(createTheme(themeOptions(), esES)),
		[]
	)
}
