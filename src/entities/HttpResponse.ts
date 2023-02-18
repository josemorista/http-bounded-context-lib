import { HttpObject } from './HttpObject';

export class HttpResponse extends HttpObject {
  statusCode: number;

  constructor() {
    super();
    this.body = '';
    this.statusCode = 200;
  }

  send(body: unknown) {
    if (!this.getHeader('content-type')) {
      this.setHeader('content-type', 'text/html');
    }
    this.body = body;
    return this;
  }

  json(body: unknown) {
    this.setHeader('content-type', 'application/json');
    this.body = body;
    return this;
  }

  status(status: number) {
    this.statusCode = status;
  }

  sendStatus(status: number) {
    this.statusCode = status;
    this.body = '';
    return this;
  }
}
