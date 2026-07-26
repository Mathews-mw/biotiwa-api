import { env } from '@/env';
import { app } from './app';

app.listen({ host: env.HOST, port: env.PORT }).then(() => {
	console.log(
		`🚀 Server is running. Listening on port ${env.PORT}. Current API Version: ${process.env.npm_package_version}`
	);
});
