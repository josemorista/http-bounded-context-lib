import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';
import { NextFunction } from './NextFunction';

export type HttpHandler = (
  request: HttpRequest,
  response: HttpResponse,
  next: NextFunction
) => Promise<void | HttpResponse> | void | HttpResponse;
