export const locationsFilters = (
	regions?: number[],
	departments?: number[],
	cities?: number[]
) => {
	let _regions: number[] = []
	let _departments: number[] = []
	let _cities: number[] = []

	// Si hay regionales, departamentos y ciudades, solo enviar cities al filtro
	if (regions?.length && departments?.length && cities?.length) {
		_cities = cities
	}
	// Si hay regionales y departamentos, solo enviar departments al filtro
	else if (regions?.length && departments?.length) {
		_departments = departments
	}
	// Solo enviar regionales
	else if (regions?.length) {
		_regions = regions
	}

	return {
		idRegionals: _regions,
		idDepartments: _departments,
		idCities: _cities,
	}
}
