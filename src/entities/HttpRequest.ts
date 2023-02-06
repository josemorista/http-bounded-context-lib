interface HttpRequestFile {
  filename: string;
  mimetype: string;
  originalname: string;
  fieldname: string;
  size: number;
  path: string;
}

export class HttpRequest {
  url: string;
  path: string;
  query: Record<string, string | Array<string> | undefined>;
  headers: Record<string, string>;
  params: Record<string, string>;
  state: Record<string, any>;
  body?: any;
  files: Array<HttpRequestFile>;

  constructor(input: Omit<HttpRequest, 'state' | 'files'>) {
    this.body = input.body;
    this.path = input.path;
    this.headers = input.headers;
    this.params = input.params;
    this.query = input.query;
    this.url = input.url;
    this.state = {};
    this.files = [];
  }
}
