import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export type HttpHandler = (
  request: HttpRequest,
  response: HttpResponse,
  next: (error?: Error) => void
) => Promise<void | HttpResponse>;
