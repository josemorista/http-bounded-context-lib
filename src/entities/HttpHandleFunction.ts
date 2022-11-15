import { HttpContext } from './HttpContext';
import { HttpResponse } from './HttpResponse';

export type HttpHandleFunction = (ctx: HttpContext) => Promise<HttpResponse>;
