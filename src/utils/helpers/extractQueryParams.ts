interface QueryParams {
	[key: string]: string | undefined
}

export const extractQueryParams = () => {
	return window.location.search
		.slice(1)
		.split('&')
		.reduce((acc, s) => {
			const [k, v] = s.split('=')
			return Object.assign(acc, { [k]: v })
		}, {} as QueryParams)
}
