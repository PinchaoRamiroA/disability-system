import { City, Department, Region } from '@/types/Locations'

type ToSort = Region | Department | City

export const sortLocation = (a: ToSort, b: ToSort) => {
	// a.name = a.name.toLowerCase()
	// b.name = b.name.toLowerCase()

	return a.name > b.name ? 1 : b.name > a.name ? -1 : 0
}
