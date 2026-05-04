import React from 'react'
import Image from 'next/image'
import logowpp from '@/assets/images/logowpp.png'
import logoig from '@/assets/images/logoig.avif'
import logofb from '@/assets/images/logofb.png'
import logoweb from '@/assets/images/logoweb.webp'

import { Avatar, Tooltip } from '@mui/material'

interface Props {
	channel: string
	title?: string
}

export const ChannelIcon = ({ channel, title }: Props) => {
	let channelIcon

	if (channel === 'Web' || channel === '1') {
		channelIcon = <Image src={logoweb} alt={channel} layout="fill" />
	} else if (channel === 'Facebook' || channel === '2') {
		channelIcon = <Image src={logofb} alt={channel} layout="fill" />
	} else if (channel === 'Whatsapp' || channel === '3') {
		channelIcon = <Image src={logowpp} alt={channel} layout="fill" />
	} else if (channel === 'Instagram' || channel === '5') {
		channelIcon = <Image src={logoig} alt={channel} layout="fill" />
	} else {
		channelIcon = <Image src={logoweb} alt={channel} layout="fill" />
	}

	return (
		<Tooltip title={title ?? channel}>
			<Avatar sx={{ height: 35, width: 35, bgcolor: '#1f88e6' }}>
				{channelIcon}
			</Avatar>
		</Tooltip>
	)
}
