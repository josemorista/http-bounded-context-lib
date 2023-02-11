import { HttpHandler } from './HttpHandler';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';
import { tmpdir } from 'os';

interface ServerOptions {
  uploadDir: string;
}

type HttpErrorFn = (request: HttpRequest, response: HttpResponse, error: Error) => HttpResponse;
export abstract class Server {
  onError?: HttpErrorFn;

  constructor(public config: ServerOptions = { uploadDir: tmpdir() }) {}

  protected abstract on(
    method: 'get' | 'post' | 'patch' | 'delete' | 'options' | 'put',
    path: string,
    middlewares: Array<HttpHandler>
  ): void;

  abstract listen(port: number, callback: () => void): void;

  setErrorHandler(onError: HttpErrorFn) {
    this.onError = onError;
  }

  get(path: string, ...middlewares: Array<HttpHandler>) {
    this.on('get', path, middlewares);
  }

  post(path: string, ...middlewares: Array<HttpHandler>) {
    this.on('post', path, middlewares);
  }

  put(path: string, ...middlewares: Array<HttpHandler>) {
    this.on('put', path, middlewares);
  }

  patch(path: string, ...middlewares: Array<HttpHandler>) {
    this.on('patch', path, middlewares);
  }

  delete(path: string, ...middlewares: Array<HttpHandler>) {
    this.on('delete', path, middlewares);
  }

  options(path: string, ...middlewares: Array<HttpHandler>) {
    this.on('options', path, middlewares);
  }
}
