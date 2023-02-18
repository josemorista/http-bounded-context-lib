import { serialize, CookieSerializeOptions } from 'cookie';

export class HttpObject {
  cookies: Record<string, string>;
  headers: Record<string, string | Array<string> | undefined>;
  body?: any;

  constructor() {
    this.headers = {};
    this.cookies = {};
  }

  setCookie(name: string, value: string, options?: CookieSerializeOptions) {
    this.cookies[name] = value;
    this.setHeader('set-cookie', serialize(name, value, options));
  }

  setHeader(name: string, value: string) {
    this.headers[name.toLowerCase()] = value;
  }

  getHeader(name: string) {
    return this.headers[name.toLowerCase()];
  }
}
