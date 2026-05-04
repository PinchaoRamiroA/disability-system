import { Color } from './Dashboard'

export interface GetWidgetConfig {
	idOrg: number
	idVa: number
}

export interface GetWidgetAvatar {
	idOrg: number
	idVa: number
}

export interface UpdateWidgetConfig {
	idOrg: number
	payload: {
		idVa: number
		idOrg: number
	} & WidgetConfig
}

export interface UpdateWidgetAvatar {
	idOrg: number
	payload: {
		idVa: number
		nameImage: string
	}
}

export interface WidgetConfigRaw {
	Colores: string
	font: string
}

export interface WidgetConfig {
	colores: ColorsStruct
	font: {
		family: string
		category: string
		variant: string
	}
}

export interface ColorsStruct {
	steps: Steps
	header: Header
	chat: Chat
	footer: Footer
	popups: Popups
}

export interface Header {
	background: string
	color: string
}

export interface Steps {
	buttons: {
		background: string
		color: string
	}
}

export interface Chat {
	background: string
	messages: Messages
}

export interface WidgetChat {
	header: Color
	messages: Messages
	footer: Footer
}

export interface Messages {
	client: {
		background: string
		color: string
	}
	agent: {
		background: string
		color: string
	}
}

export interface Popups {
	header: {
		background: string
		color: string
	}
	body: {
		background: string
		color: string
	}
	buttons: Buttons
}

export interface Buttons {
	primary: {
		background: string
		color: string
	}
	default: {
		background: string
		color: string
	}
}

export interface Footer {
	background: string
	icons: string
}

export interface GoogleFontsAPI {
	kind: string
	items: Item[]
}

export interface GoogleFont {
	family: string
	category: string
	variants: string[]
}

export interface Item {
	family: string
	variants: string[]
	subsets: string[]
	version: string
	lastModified: string
	files: { [key: string]: string }
	category: Category
	kind: Kind
	menu: string
}

export enum Category {
	Display = 'display',
	Handwriting = 'handwriting',
	Monospace = 'monospace',
	SansSerif = 'sans-serif',
	Serif = 'serif',
}

export enum Kind {
	WebfontsWebfont = 'webfonts#webfont',
}

export interface UpdateWidgetAvatarResponse {
	Imagen: string
}

export interface AvatarType {
	url: string
	file: File | null
}
