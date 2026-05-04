export const idOrgQueryParam = (idOrg?: number) => {
	return idOrg ? `?idOrg=${idOrg}` : ''
}
