import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export abstract class HttpController {
  constructor() {
    this.handle = this.handle.bind(this);
  }

  abstract handle(request: HttpRequest, response: HttpResponse): Promise<void | HttpResponse>;
}
