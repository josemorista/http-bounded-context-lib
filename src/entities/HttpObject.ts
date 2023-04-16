import { serialize, CookieSerializeOptions, parse } from 'cookie';

export class HttpObject {
  cookies: Record<string, string>;
  headers: Record<string, string | Array<string> | undefined>;
  body?: any;

  constructor() {
    this.headers = {};
    this.cookies = {};
  }

  setCookie(name: string, value: string, options?: CookieSerializeOptions) {
    this.setHeader('set-cookie', serialize(name, value, options));
    this.cookies[name] = value;
  }

  getCookie(name: string): string | undefined {
    if (this.cookies[name]) return this.cookies[name];
    const cookieHeader = this.getHeader('cookie');
    if (cookieHeader) {
      const cookies = parse(String(cookieHeader));
      return cookies[name];
    }
  }

  setHeader(name: string, value: string) {
    const _name = name.toLowerCase();
    const current = this.headers[_name];
    if (current) {
      if (typeof current === 'string') {
        this.headers[_name] = [current, value];
        return;
      }
      this.headers[_name] = [...current, value];
      return;
    }
    this.headers[_name] = value;
  }

  getHeader(name: string) {
    return this.headers[name.toLowerCase()];
  }
}
