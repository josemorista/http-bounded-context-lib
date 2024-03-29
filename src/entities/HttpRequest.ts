import { HttpObject } from './HttpObject';
import { HttpRequestFile } from './HttpRequestFile';

export class HttpRequest extends HttpObject {
  url: string;
  path: string;
  query: Record<string, string | Array<string> | undefined>;
  headers: Record<string, string | Array<string> | undefined>;
  params: Record<string, unknown>;
  files: Array<HttpRequestFile>;
  [key: string]: any;

  constructor(input: Pick<HttpRequest, 'body' | 'path' | 'url' | 'headers' | 'params' | 'query'>) {
    super();
    this.body = input.body;
    this.path = input.path;
    this.headers = input.headers;
    this.params = input.params;
    this.query = input.query;
    this.url = input.url;
    this.files = [];
  }
}
