import express, { Response, Express } from 'express';
import 'express-async-errors';
import { Http } from '../entities/Http';
import { HttpContext } from '../entities/HttpContext';
import { HttpHandleFunction } from '../entities/HttpHandleFunction';
import { HttpHandleOptions } from '../entities/HttpHandleOptions';
import { HttpMiddleware } from '../entities/HttpMiddleware';
import { HttpResponse } from '../entities/HttpResponse';
import multer from 'multer';
import cors, { CorsOptions } from 'cors';
import { randomUUID } from 'crypto';

export class ExpressHttpAdapter extends Http {
  private app: Express;
  private upload: multer.Multer;

  constructor(uploadPath: string, corsOptions: CorsOptions = {}) {
    super();
    this.app = express();
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.upload = multer({
      dest: uploadPath,
      storage: multer.diskStorage({
        destination: uploadPath,
        filename: (req, file, callback) => {
          const filename = `${randomUUID()}-${file.originalname}`;
          return callback(null, filename);
        },
      }),
    });
  }

  private sendResponse(res: Response, response: HttpResponse) {
    for (const key in response.headers) {
      res.setHeader(key, response.headers[key]);
    }
    res.status(response.status).send(response.body);
  }

  addGlobalMiddleware(middleware: HttpMiddleware): void {
    this.app.use(async (req, res, next) => {
      const data = await middleware(new HttpContext(req.url, req.query, req.body, req.params));
      if (data instanceof HttpResponse) {
        return this.sendResponse(res, data);
      }
      next();
    });
  }

  on(
    path: string,
    method: 'post' | 'get' | 'put' | 'patch' | 'delete',
    handle: HttpHandleFunction,
    middlewares?: HttpMiddleware[],
    options?: HttpHandleOptions
  ): void {
    this.app[method](
      path,
      options?.multipartField ? this.upload.single(options.multipartField) : this.upload.none(),
      async (req, res) => {
        const ctx = new HttpContext(req.url, req.query, req.body, req.params, req.headers, req.file?.filename);
        try {
          if (middlewares) {
            for (const fn of middlewares) {
              const data = await fn(ctx);
              if (data instanceof HttpResponse) {
                return this.sendResponse(res, data);
              }
            }
          }
          const response = await handle(ctx);
          return this.sendResponse(res, response);
        } catch (error) {
          if (this.errorHandler) {
            return this.sendResponse(res, await this.errorHandler(error, ctx));
          }
          throw error;
        }
      }
    );
  }

  listen(port: number, callback: () => void): void {
    this.app.listen(port, callback);
  }
}
