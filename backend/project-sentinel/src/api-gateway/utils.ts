import { Hono } from 'hono';
import { Env } from './raindrop.gen';
import { ScamDetectionRequest } from './interfaces';

const createRoutes = (env: Env) => {
  const app = new Hono();

  app.post('/v1/scam/detect', async (c) => {
    try {
      const body = await c.req.json<ScamDetectionRequest>();
      const result = await env.INTELLIGENCE_SERVICE.analyze({
        content: body.content,
      });
      return c.json(result);
    } catch {
      // this.env.logger.error('Error in scam detection', { error });
      return c.json({ error: 'Internal Server Error' }, 500);
    }
  });

  return app;
};

export const createApiGateway = (env: Env): Hono => {
  const app = createRoutes(env) as unknown as Hono;
  return app;
};