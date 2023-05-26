import { HttpHandler } from '../../entities/HttpHandler';
import { Server, ServerOptions } from '../../entities/Server';
import corsMiddleware, { Options } from 'restify-cors-middleware2';
import { basename } from 'path';
import {
  createServer,
  plugins,
  pre,
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

const handlerDict = {
  get: 'get',
  post: 'post',
  patch: 'patch',
  delete: 'del',
  put: 'put',
  options: 'opts',
} as const;

export class RestifyServerAdapter extends Server {
  private app: RestifyServer;

  constructor(config: ServerOptions, options?: RestifyServerAdapterOptions) {
    super(config);
    this.app = createServer(options);
    const cors = corsMiddleware(options?.corsOptions || {});
    this.app.pre(cors.preflight);
    this.app.pre(pre.sanitizePath());

    this.app.use(cors.actual);
    this.app.use(plugins.fullResponse());
    this.app.use(
      plugins.queryParser({
        mapParams: !!this.config?.mapQueryToParams,
      })
    );
    this.app.use(
      plugins.bodyParser({
        mapParams: !!this.config?.mapBodyToParams,
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
          filename: basename(file.path),
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
    const contentType = response.getHeader('content-type');
    if (contentType && contentType.toString().startsWith('application/json')) {
      res.json(response.body);
      return;
    }
    res.send(response.body);
  }

  protected on(
    method: 'get' | 'post' | 'patch' | 'delete' | 'options' | 'put',
    path: string,
    middlewares: HttpHandler[]
  ): void {
    this.app[handlerDict[method]](path, async (req, res) => {
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

  close() {
    return new Promise<void>((resolve) => this.app.close(resolve));
  }
}
