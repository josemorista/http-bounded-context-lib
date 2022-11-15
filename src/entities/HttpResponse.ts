export class HttpResponse {
  headers: Record<string, string | number>;
  status: number;
  body: any;

  constructor(status = 200, body: any, headers: Record<string, string | number>) {
    this.status = status;
    this.body = body;
    this.headers = headers;
  }
}
