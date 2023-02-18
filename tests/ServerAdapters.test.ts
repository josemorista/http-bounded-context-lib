import { Server } from '../src';
import getServer from './setup/server';

let server: Server;
(['express', 'restify'] as const).forEach((adapter) => {
  describe(`${adapter} server adapter tests`, () => {
    beforeAll(async () => {
      server = await getServer(adapter);
    });

    afterAll(async () => {
      await server.close();
    });

    describe('[GET]', () => {
      it('Should return 404 when handler is not found', async () => {
        const response = await fetch('http://localhost:3000/404');
        expect(response.status).toBe(404);
      });
      it('Should return body as JSON on /json', async () => {
        const response = await fetch('http://localhost:3000/json');
        const body = await response.json();
        expect(response.headers.get('content-type')).toMatch(/^(application\/json)/);
        expect(body).toHaveProperty('headers');
      });
      it('Should return statusCode correctly', async () => {
        const response = await fetch('http://localhost:3000/status?status=204');
        expect(response.status).toBe(204);
      });
      it('Should return text body', async () => {
        const response = await fetch('http://localhost:3000/text');
        expect(await response.text()).toBe('Hello world');
      });
      it('Should parse query params correctly', async () => {
        const response = await fetch('http://localhost:3000/json?test1=1&test2=1&test2=2');
        const body = await response.json();
        expect(body).toMatchObject({
          query: {
            test1: '1',
            test2: ['1', '2'],
          },
        });
      });
      it('Should parse url params correctly', async () => {
        const response = await fetch('http://localhost:3000/json/params/1');
        const body = await response.json();
        expect(body).toMatchObject({
          params: {
            id: '1',
          },
        });
      });
      it('Should return 403 when middleware returns a response', async () => {
        const response = await fetch('http://localhost:3000/json/middleware');
        expect(response.status).toBe(403);
      });
      it('Should return 200 and populated request when middleware calls next', async () => {
        const response = await fetch('http://localhost:3000/json/middleware?skipMiddleware=true');
        expect(response.status).toBe(200);
        const body = await response.json();
        expect(body.middlewareSkipped).toBe(true);
      });
    });

    describe('[POST]', () => {
      it('Should return 201 and parse request json body correctly', async () => {
        const body = {
          hello: 'world',
        };
        const response = await fetch('http://localhost:3000/json', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        });
        expect(response.status).toBe(201);
        expect((await response.json()).body).toMatchObject(body);
      });
    });

    describe('[PUT]', () => {
      it('Should return 200 and parse request json body correctly', async () => {
        const body = {
          hello: 'world',
        };
        const response = await fetch('http://localhost:3000/json', {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        });
        expect(response.status).toBe(200);
        expect((await response.json()).body).toMatchObject(body);
      });
    });

    describe('[PATCH]', () => {
      it('Should return 200 and parse request json body correctly', async () => {
        const body = {
          hello: 'world',
        };
        const response = await fetch('http://localhost:3000/json', {
          method: 'PATCH',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        });
        expect(response.status).toBe(200);
        expect((await response.json()).body).toMatchObject(body);
      });
    });

    describe('[DEL]', () => {
      it('Should return 204 and parse json response correctly', async () => {
        const response = await fetch('http://localhost:3000/json', {
          method: 'DELETE',
        });
        expect(response.status).toBe(200);
        expect(await response.json()).toHaveProperty('headers');
      });
    });

    describe('[OPTS]', () => {
      it('Should return 204', async () => {
        const response = await fetch('http://localhost:3000/status', {
          method: 'OPTIONS',
        });
        expect(response.status).toBe(204);
      });
    });
  });
});
