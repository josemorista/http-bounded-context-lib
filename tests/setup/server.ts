import { ExpressServerAdapterLoader, Server } from '../../src';
import { RestifyServerAdapterLoader } from '../../src';

export default async (infra: 'express' | 'restify') => {
  const ServerClass = infra === 'express' ? await ExpressServerAdapterLoader : await RestifyServerAdapterLoader;
  const server = new ServerClass({});

  server.get('/', async (request, response) => {
    return response.json(request);
  });

  server.get('/status', async (request, response) => {
    return response.sendStatus(Number(request.query.status));
  });

  server.get('/text', async (request, response) => {
    return response.send('Hello world');
  });

  server.get('/params/:id', async (request, response) => {
    return response.json(request.params);
  });

  server.post('/', async (request, response) => {
    return response.json(request);
  });

  server.patch('/', async (request, response) => {
    return response.json(request);
  });

  server.delete('/', async (request, response) => {
    return response.json(request);
  });

  server.get(
    '/middleware',
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

  return new Promise<Server>((resolve) => {
    server.listen(3000, () => {
      resolve(server);
    });
  });
};
