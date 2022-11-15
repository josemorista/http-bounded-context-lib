export class HttpContext {
  url: string;
  file?: string;
  state: Record<string, any>;
  query: Record<string, string | Array<string> | unknown | undefined>;
  body: any;
  headers: Record<string, string | Array<string> | undefined>;
  params: Record<string, string>;

  constructor(
    url: string,
    query?: HttpContext['query'],
    body?: any,
    params?: Record<string, string>,
    headers?: HttpContext['headers'],
    file?: string
  ) {
    this.url = url;
    this.query = query || {};
    this.params = params || {};
    this.body = body || {};
    this.state = {};
    this.headers = headers || {};
    this.file = file;
  }
}
