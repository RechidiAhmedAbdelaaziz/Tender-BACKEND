import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthToken } from '../types/auth-token';
import { ApiResponse } from '../types/api-response';



@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: ApiResponse<T>) => this.responseHandler(res, context)),
    );
  }



  responseHandler<T>(response: ApiResponse<T>, context: ExecutionContext) {
    const res = context.switchToHttp().getResponse();
    const statusCode = res.statusCode;

    return {
      sucess: true,
      statusCode,
      ...response,
    }
  }
}
