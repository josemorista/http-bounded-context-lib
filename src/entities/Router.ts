import { HttpController } from '../controllers/HttpController';
import { Http } from './Http';

export abstract class Router {
  protected controllers: Record<string, HttpController>;

  constructor(readonly http: Http, readonly prefix = '') {
    this.controllers = {};
  }

  registerController(name: string, controller: HttpController) {
    this.controllers[name] = controller;
    return this;
  }

  withPrefix(path: string) {
    return this.prefix + path;
  }

  getHandler(name: string) {
    return this.controllers[name].handle;
  }

  abstract register(): void;
}
