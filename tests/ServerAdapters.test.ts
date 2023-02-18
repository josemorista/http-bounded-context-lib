import { Server } from '../src';
import getExpressServer from './setup/server';

let server: Server;
(['express', 'restify'] as const).forEach((infra) => {
  describe(`${infra} adapter tests`, () => {
    beforeAll(async () => {
      server = await getExpressServer(infra);
    });

    afterAll(async () => {
      await server.close();
    });

    describe('[GET]', () => {
      it('Should parse query params and return body as JSON on /', async () => {
        const response = await fetch('http://localhost:3000/?test1=1&test2=1&test2=2');
        const body = await response.json();
        expect(response.headers.get('content-type')).toMatch(/^(application\/json)/);
        expect(body).toMatchObject({
          query: {
            test1: '1',
            test2: ['1', '2'],
          },
        });
      });
    });
  });
});
