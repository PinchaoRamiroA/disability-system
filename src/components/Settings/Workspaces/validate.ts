export const validateType = (type: number, value: string) => {
	const egPath = 'http://ejemplo.com'
	if (value.indexOf(egPath).toString() !== '-1') {
		let expresionRegular
		const posicion = value.lastIndexOf('.')
		const respuesta = value.slice(posicion).replace(/\r?\n$/, '')
		switch (type) {
			case 1:
				return false
			case 2:
				return value.indexOf('http') !== -1 ||
					value.indexOf('https') !== -1
					? false
					: true
			case 3:
				expresionRegular = /\.(gif|jpg|jpeg|png)$/i
				return !expresionRegular.test(respuesta)
			// return value.indexOf('.png') !== -1 || value.indexOf('.jpeg') !== -1 || value.indexOf('.jpg') !== -1 || value.indexOf('.gif') !== -1 ||
			// value.indexOf('https') !== -1 ? false : true;
			case 4:
				expresionRegular = /\.(docx|doc|pdf)$/i
				return !expresionRegular.test(respuesta)
			// return value.indexOf('.docx') !== -1 || value.indexOf('.doc') !== -1 || value.indexOf('.pdf') !== -1 ? false : true;
			case 5:
				return value.indexOf('.youtube') !== -1 ||
					value.indexOf('.mp3') !== -1 ||
					value.indexOf('.mp4') !== -1
					? false
					: true
			default:
				return false
		}
	} else {
		if (type === 1) {
			return false
		}
		return true
	}
}
