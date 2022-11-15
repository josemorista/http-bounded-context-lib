import { HttpContext } from './HttpContext';
import { HttpResponse } from './HttpResponse';

export type HttpErrorHandleFunction = (error: Error, ctx: HttpContext) => Promise<HttpResponse>;
