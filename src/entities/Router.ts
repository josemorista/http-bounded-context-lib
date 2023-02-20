import { HttpController } from './HttpController';
import { HttpHandler } from './HttpHandler';
import { Server } from './Server';

export abstract class Router {
  handlers: Record<string, HttpHandler>;

  constructor(public prefix: string, protected controllers: Record<string, HttpController>) {
    this.handlers = new Proxy(this.controllers, {
      get(target, key: string) {
        return target[key].handle;
      },
    }) as any;
  }

  protected prefixed(path?: string) {
    return `${this.prefix}${path || ''}`;
  }

  abstract register(server: Server): void;
}
