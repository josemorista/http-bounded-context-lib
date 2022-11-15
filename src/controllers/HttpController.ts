import { HttpContext } from '../entities/HttpContext';
import { HttpResponse } from '../entities/HttpResponse';

export abstract class HttpController {
  abstract handle(ctx: HttpContext): Promise<HttpResponse>;

  constructor() {
    this.handle = this.handle.bind(this);
  }
}
