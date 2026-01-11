import { app } from './app';

const port = process.env.PORT || '3001';

console.log(`LumenQuest is running on http://localhost:${port}`);

export default {
	port,
	fetch: app.fetch,
};
