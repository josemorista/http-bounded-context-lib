import { Server } from '../../src';
import { ExpressServerAdapter } from '../../src/adapters/express';
import { RestifyServerAdapter } from '../../src/adapters/restify';

export default async (infra: 'express' | 'restify') => {
  const server = infra === 'express' ? new ExpressServerAdapter({}) : new RestifyServerAdapter({});

  server.get('/json', async (request, response) => {
    return response.json(request);
  });

  server.get('/status', async (request, response) => {
    return response.sendStatus(Number(request.query.status));
  });

  server.get('/text', async (request, response) => {
    return response.send('Hello world');
  });

  server.get('/json/params/:id', async (request, response) => {
    return response.json(request);
  });

  server.get(
    '/json/middleware',
    async (request, response) => {
      if (request.query.skipMiddleware === 'true') {
        request.middlewareSkipped = true;
        return;
      }
      return response.sendStatus(403);
    },
    async (request, response) => {
      return response.json(request);
    }
  );

  server.post('/json', async (request, response) => {
    response.status(201);
    return response.json(request);
  });

  server.put('/json', async (request, response) => {
    return response.json(request);
  });

  server.patch('/json', async (request, response) => {
    return response.json(request);
  });

  server.del('/json', async (request, response) => {
    return response.json(request);
  });

  server.opts('/status', async (request, response) => {
    return response.sendStatus(204);
  });

  return new Promise<Server>((resolve) => {
    server.listen(3000, () => {
      resolve(server);
    });
  });
};
