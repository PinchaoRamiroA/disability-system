import axios from 'axios'
import { GoogleFontsAPI } from '@/types/Settings/General/Widget'

export async function getGoogleFonts() {
	const response = await axios.get<GoogleFontsAPI>(
		`https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC5TW4XehWhXnSBOR17spJdhaDxh4xjlJY
            &capability=WOFF2&sort=popularity&subset=latin
        `
	)

	return response.data
}
