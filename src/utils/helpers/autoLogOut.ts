const REFRESH_TOKEN_NAME = 'refresh_token'

export const cleanLocalStorage = () => {
	localStorage.clear()
}

export const cleanAndReload = () => {
	cleanLocalStorage()
	window.location.reload()
}

export const getTokenTime = (): Date | null => {
	const tokenString = localStorage.getItem(REFRESH_TOKEN_NAME)
	if (!tokenString) return null
	return null
}

export const autoLogOut = (_callback?: () => void) => {
	// Simplified for new system
}