import { env } from '@/env';
import { app } from './app';

async function startServer() {
	try {
		const address = await app.listen({ host: env.HOST, port: env.PORT });

		app.log.info(
			{
				address,
				version: process.env.npm_package_version,
			},
			'Server is running'
		);

		console.log(
			`🚀 Server is running. Listening on port ${env.PORT}. Current API Version: ${process.env.npm_package_version}`
		);
	} catch (error) {
		app.log.error(error, 'Failed to start server');
		process.exit(1);
	}
}

async function shutdown(signal: string) {
	app.log.info({ signal }, 'Shutting down server');

	try {
		await app.close();
	} catch (error) {
		app.log.error(error, 'Failed to close server gracefully');
		process.exitCode = 1;
	}
}

process.once('SIGTERM', () => {
	void shutdown('SIGTERM');
});

process.once('SIGINT', () => {
	void shutdown('SIGINT');
});

void startServer();
