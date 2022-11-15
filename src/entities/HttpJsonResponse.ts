import { HttpResponse } from './HttpResponse';

export class HttpJsonResponse extends HttpResponse {
  constructor(status = 200, body: any, headers: Record<string, unknown> = {}) {
    super(status, body, { ...headers, 'Content-Type': 'application/json; charset=utf-8' });
  }
}
