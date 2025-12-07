// import {
//   CallHandler,
//   ExecutionContext,
//   HttpException,
//   HttpStatus,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { catchError, Observable, throwError } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { ValidationError } from 'class-validator';
// import { tap } from 'rxjs/operators';

// export class loggingInterceptor implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> | Promise<Observable<any>> {
//     const now = Date.now();
//     return next
//       .handle()
//       .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
//   }
// }
