import { HttpHandler } from '../../entities/HttpHandler';
import { HttpRequest } from '../../entities/HttpRequest';
import { HttpResponse } from '../../entities/HttpResponse';
import { Server, ServerOptions } from '../../entities/Server';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';

export class FastifyServerAdapter extends Server {
  private app: ReturnType<typeof Fastify>;

  constructor(serverOptions: ServerOptions) {
    super(serverOptions);
    this.app = Fastify({
      ignoreTrailingSlash: true,
    });
  }

  parseRequest(req: FastifyRequest) {
    let params: HttpRequest['params'] = {};
    if (this.config.mapQueryToParams && typeof req.query === 'object') {
      params = { ...params, ...req.query };
    }
    if (this.config.mapBodyToParams && typeof req.body === 'object') {
      params = { ...params, ...req.body };
    }
    if (typeof req.params === 'object') {
      params = { ...params, ...req.params };
    }
    return new HttpRequest({
      url: req.url,
      body: req.body,
      params: params as Record<string, string>,
      headers: req.headers,
      path: req.url,
      query: req.query as HttpRequest['query'],
    });
  }

  parseResponse(res: FastifyReply, response: HttpResponse) {
    res.statusCode = response.statusCode;
    for (const [header, value] of Object.entries(response.headers)) {
      value && res.header(header, value);
    }
    return res.send(response.body);
  }

  protected on(
    method: 'get' | 'post' | 'patch' | 'delete' | 'options' | 'put',
    path: string,
    middlewares: HttpHandler[]
  ): void {
    this.app[method](path, async (req, res) => {
      const request = this.parseRequest(req);
      const response = new HttpResponse();
      try {
        for (const middleware of middlewares) {
          const handlerResponse = await middleware(request, response, (error) => {
            if (error) throw error;
          });
          if (handlerResponse && handlerResponse instanceof HttpResponse)
            return this.parseResponse(res, handlerResponse);
        }
      } catch (error) {
        if (error instanceof Error && this.onError)
          return this.parseResponse(res, this.onError(request, response, error));
        throw error;
      }
    });
  }

  listen(port: number, callback: () => void): void {
    this.app
      .listen({
        port,
      })
      .then(() => {
        callback();
      });
  }

  close(): Promise<void> {
    return this.app.close();
  }
}
