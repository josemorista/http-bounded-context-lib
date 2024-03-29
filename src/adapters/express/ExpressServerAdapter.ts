import { HttpHandler } from '../../entities/HttpHandler';
import { HttpResponse } from '../../entities/HttpResponse';
import { Server, ServerOptions } from '../../entities/Server';
import { HttpRequest } from '../../entities/HttpRequest';
import { Server as NativeServer } from 'http';

import express, { Application, Response, Request } from 'express';
import 'express-async-errors';
import multer from 'multer';
import cors from 'cors';

export class ExpressServerAdapter extends Server {
  private app: Application;
  private multer: multer.Multer;
  private listener?: NativeServer;

  constructor(config: ServerOptions, corsOptions?: cors.CorsOptions) {
    super(config);
    this.app = express();
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.multer = multer({
      dest: this.config.uploadDir,
    });
  }

  private parseResponse(res: Response, response: HttpResponse) {
    res.status(response.statusCode);
    for (const [name, value] of Object.entries(response.headers)) {
      value && res.setHeader(name, value);
    }
    const contentType = response.getHeader('content-type');
    if (contentType && contentType.toString().startsWith('application/json')) {
      return res.json(response.body);
    }
    return res.send(response.body);
  }

  private parseRequest(req: Request) {
    const query: HttpRequest['query'] = {};
    const url = new URL(`http://localhost${req.originalUrl}`);
    let params: HttpRequest['params'] = {};
    for (const key of url.searchParams.keys()) {
      const values = url.searchParams.getAll(key);
      query[key] = values.length > 1 ? values : values[0];
      if (this.config.mapQueryToParams) {
        params[key] = query[key];
      }
    }
    if (this.config.mapBodyToParams && typeof req.body === 'object') {
      params = { ...params, ...req.body };
    }
    params = { ...params, ...req.params };
    const request = new HttpRequest({
      headers: req.headers,
      query,
      params,
      url: req.url,
      path: req.path,
      body: req.body,
    });
    if (req.files && Array.isArray(req.files)) request.files = req.files;
    return request;
  }

  protected on(
    method: 'get' | 'post' | 'patch' | 'delete' | 'options' | 'put',
    path: string,
    middlewares: HttpHandler[]
  ): void {
    this.app[method](path, this.multer.any(), async (req, res) => {
      const request = this.parseRequest(req);
      let response = new HttpResponse();
      try {
        for (const middleware of middlewares) {
          const handlerResponse = await middleware(request, response, (error) => {
            if (error) throw error;
          });
          if (handlerResponse && handlerResponse instanceof HttpResponse)
            return this.parseResponse(res, handlerResponse);
        }
        return this.parseResponse(res, response);
      } catch (error) {
        if (error instanceof Error && this.onError) {
          response = await this.onError(request, response, error);
        }
        return this.parseResponse(res, response);
      }
    });
  }

  listen(port: number, callback: () => void): void {
    this.listener = this.app.listen(port, callback);
  }

  close() {
    return new Promise<void>((resolve) => {
      this.listener?.close(() => {
        resolve();
      });
    });
  }
}
