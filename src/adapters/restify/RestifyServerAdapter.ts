import { HttpHandler } from '../../entities/HttpHandler';
import { Server, ServerOptions } from '../../entities/Server';
import corsMiddleware, { Options } from 'restify-cors-middleware2';
import {
  createServer,
  plugins,
  ServerOptions as RestifyOptions,
  Server as RestifyServer,
  Request,
  Response,
} from 'restify';
import { HttpRequest } from '../../entities/HttpRequest';
import { HttpResponse } from '../../entities/HttpResponse';

type RestifyServerAdapterOptions = RestifyOptions & {
  corsOptions: Options;
};

export class RestifyServerAdapter extends Server {
  private app: RestifyServer;

  constructor(config: ServerOptions, options: RestifyServerAdapterOptions) {
    super(config);
    this.app = createServer(options);
    const cors = corsMiddleware(options.corsOptions);
    this.app.pre(cors.preflight);
    this.app.use(cors.actual);
    this.app.use(plugins.fullResponse());
    this.app.use(
      plugins.queryParser({
        mapParams: true,
      })
    );
    this.app.use(
      plugins.bodyParser({
        mapParams: true,
        uploadDir: this.config.uploadDir,
      })
    );
  }

  private parseRequest(req: Request): HttpRequest {
    const request = new HttpRequest({
      headers: req.headers,
      params: req.params,
      path: req.getPath(),
      query: req.query,
      url: req.url || '',
      body: req.body,
    });
    for (const [name, file] of Object.entries(req.files || {})) {
      file &&
        request.files.push({
          fieldname: name,
          originalname: file.name || '',
          filename: file.name || '',
          size: file.size,
          mimetype: file.type || '',
          path: file.path,
        });
    }
    return request;
  }

  private parseResponse(res: Response, response: HttpResponse) {
    res.status(response.statusCode);
    for (const [name, value] of Object.entries(response.headers)) {
      value && res.setHeader(name, value);
    }
    if (response.headers['content-type'] === 'application/json') {
      return res.json(response.body);
    }
    return res.send(response.body);
  }

  protected on(
    method: 'get' | 'post' | 'patch' | 'delete' | 'options' | 'put',
    path: string,
    middlewares: HttpHandler[]
  ): void {
    const handler = {
      get: this.app.get,
      post: this.app.post,
      patch: this.app.patch,
      delete: this.app.del,
      put: this.app.put,
      options: this.app.opts,
    };

    handler[method](path, async (req, res) => {
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
    this.app.listen(port, callback);
  }
}
