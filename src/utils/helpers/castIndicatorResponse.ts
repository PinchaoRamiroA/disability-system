import { secondsToTime } from './date'

export const castResponse = (value: number, time = false) => {
	if (time) {
		return secondsToTime(Math.round(value), true)
	}
	return Number(value.toFixed(2))
}

export const isNumber = (value: number | string) => {
	return !isNaN(Number(value))
}
