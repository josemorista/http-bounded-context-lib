import { HttpHandler } from '../../entities/HttpHandler';
import { HttpResponse } from '../../entities/HttpResponse';
import { Server } from '../../entities/Server';
import { HttpRequest } from '../../entities/HttpRequest';

import express, { Application, Response, Request } from 'express';
import 'express-async-errors';
import multer from 'multer';
import cors from 'cors';

export class ExpressServerAdapter extends Server {
  private app: Application;
  private multer: multer.Multer;

  constructor(config?: Server['config'], corsOptions?: cors.CorsOptions) {
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
    if (response.headers['content-type'] === 'application/json') {
      return res.json(response.body);
    }
    return res.send(response.body);
  }

  private parseRequest(req: Request) {
    const query: HttpRequest['query'] = {};
    for (const [key, value] of Object.entries(req.query)) {
      query[key] = Array.isArray(value) ? value.map((el) => String(el)) : String(value);
    }

    const request = new HttpRequest({
      headers: req.headers,
      query,
      params: req.params,
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
