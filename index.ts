import { ExpressServerAdapter } from './src/adapters/express';
import { FastifyServerAdapter } from './src/adapters/fastify';
import { RestifyServerAdapter } from './src/adapters/restify';

const server = new RestifyServerAdapter({
  mapBodyToParams: true,
  mapQueryToParams: true,
});

server.post('/:id', async (request, response) => {
  return response.json({
    message: 'Hello world',
  });
});

server.listen(3000, () => {
  console.log('Server is online');
});
