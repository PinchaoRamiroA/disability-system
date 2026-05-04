import { Client } from '@stomp/stompjs'

export const socket = new Client({
	reconnectDelay: 5000,
	heartbeatOutgoing: 0,
	heartbeatIncoming: 30000,
	splitLargeFrames: true,

	brokerURL: process.env.NEXT_PUBLIC_WEBSOCKET_API,
	debug: function (str) {
		console.log(str)
	},
})
