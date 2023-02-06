import { ExpressServerAdapter } from './adapters/express/ExpressServerAdapter';
import { HttpHandler } from './entities/HttpHandler';

const server = new ExpressServerAdapter({
  uploadDir: __dirname,
});

const debug: HttpHandler = async (request, _, next) => {
  console.log('[URL]', request.url);
  console.log('[PATH]', request.path);
  console.group('[HEADERS]');
  console.table(request.headers);
  console.groupEnd();

  console.group('[QUERY]');
  console.table(request.query);
  console.groupEnd();

  console.group('[PARAMS]');
  console.table(request.params);
  console.groupEnd();

  console.log('[BODY]', request.body);
  request.state.debug = true;
  return next();
};

server.post('/hello/:id', debug, async (request, response) => {
  return response.json({
    message: 'Hello world',
  });
});

server.listen(3000, () => {
  console.log('Server is online');
});
