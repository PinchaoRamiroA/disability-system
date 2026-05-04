export const PASSWORD_STRONG =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*._-])[A-Za-z\d!@#$%^&*._-]{12,20}$/

export const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export const ALFA_ESPACIO = /^[a-z\s]*$/i
export const ALFA_NO_ESPACIO = /^[a-z]*$/i

export const ALFA_ACENTO_ESPACIO = /^[a-záéíóúäëïöüñ\s]*$/i
export const ALFA_ACENTO_NO_ESPACIO = /^[a-záéíóúäëïöüñ]*$/i

export const ALFANUM_ESPACIO = /^[a-z\d\s]*$/i
export const ALFANUM_NO_ESPACIO = /^[a-z\d]*$/i

export const NUMERICO_ESPACIO = /^[\d\s]*$/
export const NUMERICO_NO_ESPACIO = /^\d*$/

export const ALFANUM_PUNTO_GUION_ESPACIO = /^[a-z_\-.\d\s]*$/i
export const ALFANUM_PUNTO_GUION_NO_ESPACIO = /^[a-z_\-.\d]*$/i

export const ALFANUM_CHARS_ESPACIO = /^[a-záéíóúäëïöüñ\(\).,:;\+\-_\¿\?\d\s]*$/i
export const ALFANUM_CHARS_NO_ESPACIO =
	/^[a-záéíóúäëïöüñ\(\).,:;\+\-_\¿\d\?]*$/i

export const ALFA_CHARS_PUNTO_GUION_ESPACIO = /^[a-záéíóúäëïöüñ_\-.\s]*$/i
export const ALFA_CHARS_PUNTO_GUION_NO_ESPACIO = /^[a-záéíóúäëïöüñ_\-.]*$/i

export const ALFANUM_CHARS_PUNTO_GUION_ESPACIO = /^[a-záéíóúäëïöüñ_\-.\d\s]*$/i
export const ALFANUM_CHARS_PUNTO_GUION_NO_ESPACIO = /^[a-záéíóúäëïöüñ_\-.\d]*$/i
