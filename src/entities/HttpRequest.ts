import { HttpRequestFile } from './HttpRequestFile';

export class HttpRequest {
  url: string;
  path: string;
  query: Record<string, string | Array<string> | undefined>;
  headers: Record<string, string>;
  params: Record<string, string>
  body?: any;
  files: Array<HttpRequestFile>;
  [key: string]: any;

  constructor(input: Omit<HttpRequest, 'state' | 'files'>) {
    this.body = input.body;
    this.path = input.path;
    this.headers = input.headers;
    this.params = input.params;
    this.query = input.query;
    this.url = input.url;
    this.files = [];
  }
}
