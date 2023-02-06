import { HttpHandler } from './HttpHandler';

interface ServerOptions {
  uploadDir: string;
}

export abstract class Server {
  constructor(public config: ServerOptions) {}

  protected abstract on(
    method: 'get' | 'post' | 'patch' | 'delete' | 'options' | 'put',
    path: string,
    middlewares: Array<HttpHandler>
  ): void;

  abstract listen(port: number, callback: () => void): void;

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
