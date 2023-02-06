export class HttpResponse {
  statusCode: number;
  headers: Record<string, string>;
  body?: any;

  constructor() {
    this.body = '';
    this.statusCode = 200;
    this.headers = {};
  }

  setHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  send(body: unknown) {
    this.body = body;
    return this;
  }

  json(body: unknown) {
    this.setHeader('content-type', 'application/json');
    this.body = body;
    return this;
  }
}
