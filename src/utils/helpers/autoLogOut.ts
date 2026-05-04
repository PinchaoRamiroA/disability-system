import jwt_decode from 'jwt-decode'
import { REFRESH_TOKEN_NAME } from '../constants/userSession'
import { User } from '@/types/auth'
import { removeBeforeUnloadHandler } from './beforeUnloadManager'

let timer: NodeJS.Timeout | null = null
let handlerRef: (() => void) | null = null // Referencia del handler.

type Callback = () => void

export const cleanLocalStorage = () => {
	// const preserveKey = localStorage.getItem(DASHBOARD_STYLES_LS)
	localStorage.clear()
	removeBeforeUnloadHandler()

	// if (preserveKey) {
	// 	localStorage.setItem(DASHBOARD_STYLES_LS, preserveKey)
	// }
}

export const cleanAndReload = () => {
	if (timer) clearTimeout(timer) // Limpia el timer si existe.
	removeUserActivityListeners() // Elimina los eventos.
	cleanLocalStorage()
	window.location.reload()
}

// Retorna el tiempo real de expiración del token
const getTokenTime = () => {
	const tokenString = localStorage.getItem(REFRESH_TOKEN_NAME)

	// Verifica si el token existe y no es una cadena vacía.
	if (!tokenString) {
		console.log('No token found in localStorage.')
		return null
	}

	try {
		const token: User = jwt_decode(tokenString)
		// Devuelve el tiempo de expiración del token.
		return token && token.exp ? new Date(token.exp * 1000) : null
	} catch (error) {
		console.log('Error decoding token:', error)
		return null
	}
}

// Verifica si el token ha expirado.
const checkTime = (callback?: Callback) => {
	const currentTokenTime = getTokenTime()

	if (!currentTokenTime || new Date() >= currentTokenTime) {
		console.log(new Date())
		console.log(currentTokenTime)
		removeUserActivityListeners() // Remueve los eventos.
		if (callback) {
			callback()
		} else {
			cleanAndReload()
		}
	}
}

// Handler que se reutiliza para los eventos.
const userActivityHandler = (callback?: Callback) => () => {
	checkTime(callback) // Verifica la expiración del token.
}

// Agrega los eventos del navegador.
const addUserActivityListeners = (callback?: Callback) => {
	handlerRef = userActivityHandler(callback) // Guarda la referencia.
	if (handlerRef) {
		document.addEventListener('mousemove', handlerRef)
		document.addEventListener('keydown', handlerRef)
	}
}

// Remueve los eventos del navegador.
const removeUserActivityListeners = () => {
	if (handlerRef) {
		document.removeEventListener('mousemove', handlerRef)
		document.removeEventListener('keydown', handlerRef)
		// window.removeEventListener('beforeunload', handlerRef)
		handlerRef = null // Limpia la referencia.
	}
}

// Lógica principal de auto-cierre de sesión.
export async function autoLogOut(callback?: Callback) {
	let currentTokenTime = getTokenTime()

	if (!currentTokenTime) {
		cleanAndReload()
		return
	}
	console.log('REFRESH TOKEN EXP', currentTokenTime)

	// Calcula el tiempo restante en milisegundos.
	const diff = currentTokenTime.getTime() - Date.now()

	// Limpia cualquier timer previo.
	if (timer) clearTimeout(timer)

	// Configura un nuevo timer basado en el tiempo más reciente.
	timer = setTimeout(() => {
		console.log('timeout', currentTokenTime)
		currentTokenTime = getTokenTime()
		if (!currentTokenTime || new Date() >= currentTokenTime) {
			removeUserActivityListeners() // Remueve los eventos.
			if (callback) {
				callback()
			} else {
				cleanAndReload()
			}
		}
		// Refrescar timer
		else {
			autoLogOut(callback)
		}
	}, diff)

	// Limpia eventos previos y añade nuevos.
	removeUserActivityListeners()
	addUserActivityListeners(callback)
}
