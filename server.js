import { serverStatusTask } from './trigger/server-status'

// ... your existing server code ...

// Handle graceful shutdown
process.on('SIGTERM', async () => {
	try {
		await serverStatusTask.trigger({
			status: 'shutdown',
			message: `Server shutdown initiated at ${new Date().toISOString()}`,
		})
	} catch (error) {
		console.error('Failed to send shutdown notification:', error)
	}

	// ... your existing shutdown logic ...
	server.close()
	process.exit(0)
})

// Optionally handle startup notification
serverStatusTask.trigger({
	status: 'startup',
	message: `Server started at ${new Date().toISOString()}`,
})
