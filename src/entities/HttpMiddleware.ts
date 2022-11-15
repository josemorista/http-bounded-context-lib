import { HttpContext } from './HttpContext';
import { HttpResponse } from './HttpResponse';

export type HttpMiddleware = (ctx: HttpContext) => Promise<void | HttpResponse>;
