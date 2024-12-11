import { task } from '@trigger.dev/sdk/v3'
import { AbortTaskRunError } from '@trigger.dev/sdk/v3'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export const serverStatusTask = task({
	id: 'server-status-notification',
	retry: {
		maxAttempts: 3,
		factor: 2,
		minTimeoutInMs: 1000,
		maxTimeoutInMs: 10000,
	},
	run: async (payload) => {
		if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
			throw new AbortTaskRunError('Telegram credentials not configured')
		}

		const emoji = payload.status === 'shutdown' ? '🔴' : '🟢'
		const message = `${emoji} Server status: ${payload.status}`

		await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
			method: 'POST',
			body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
		})
	},
})
