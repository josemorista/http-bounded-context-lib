import { HttpHandler } from '../../entities/HttpHandler';
import { HttpResponse } from '../../entities/HttpResponse';
import { Server } from '../../entities/Server';
import express, { Application, Response, Request } from 'express';
import 'express-async-errors';
import multer from 'multer';
import { HttpRequest } from '../../entities/HttpRequest';

export class ExpressServerAdapter extends Server {
  private app: Application;
  private multer: multer.Multer;

  constructor(config: Server['config']) {
    super(config);
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.multer = multer({
      dest: this.config.uploadDir,
    });
  }

  private parseResponse(res: Response, response: HttpResponse) {
    res.status(response.statusCode);
    for (const [name, value] of Object.entries(response.headers)) {
      res.setHeader(name, value);
    }
    if (response.headers['content-type'] === 'application/json') {
      return res.json(response.body);
    }
    return res.send(response.body);
  }

  private parseRequest(req: Request) {
    const query: HttpRequest['query'] = {};
    const headers: HttpRequest['headers'] = {};
    for (const [key, value] of Object.entries(req.query)) {
      query[key] = Array.isArray(value) ? value.map((el) => String(el)) : String(value);
    }
    for (const [name, value] of Object.entries(req.headers)) {
      headers[name] = String(value);
    }
    const request = new HttpRequest({
      headers,
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
      for (const middleware of middlewares) {
        const handlerResponse = await middleware(request, response, (error) => {
          if (error) throw error;
        });
        if (handlerResponse && handlerResponse instanceof HttpResponse) return this.parseResponse(res, handlerResponse);
      }
    });
  }

  listen(port: number, callback: () => void): void {
    this.app.listen(port, callback);
  }
}