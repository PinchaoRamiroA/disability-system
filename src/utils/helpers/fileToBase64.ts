export const fileToBase64 = (file: File): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			const base64String = reader.result as string
			resolve(base64String.split(',')[1]) // Extract base64 data from the result
		}
		reader.onerror = (error) => {
			reject(error)
		}
		reader.readAsDataURL(file) // Read the file as a data URL
	})
}
