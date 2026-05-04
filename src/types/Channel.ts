export type Channels = {
	types: {
		[name: string]: ChannelLabel
	}
}

export type ChannelLabel = 'Facebook' | 'Web' | 'Whatsapp' | 'Instagram'

export type NomalizedChannel = {
	id: number
	label: string
	checked: boolean
	color?: string
	type?: string
}
