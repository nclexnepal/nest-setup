import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, merge, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidationError } from 'class-validator';
import mongoose from 'mongoose';
import { BSONError } from 'bson';

export interface Response<T> {
  statusCode: number;
  success: boolean;
  message: T;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private logger: Logger = new Logger('RESPONSE ERROR INTERCEPTOR');

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        success: true,
        message: data.message,
        data: data.data,
      })),
      catchError((err) => {
        this.logger.log('Error :', err);
        const success = false;
        let statusCode, reason, field;
        if (err instanceof ValidationError) {
          reason =
            typeof err.constraints === 'object'
              ? Object.values(err.constraints)[0]
              : err.constraints;
          field = err.property;
          statusCode = HttpStatus.BAD_REQUEST;
        }
        //error interceptor for microservice
        else if (
          typeof err == 'object' &&
          Object.keys(err).length === 2 &&
          err.status === 'error'
        ) {
          statusCode = HttpStatus.FORBIDDEN;
          reason = err.message || 'microserive';
          field = 'Microservice';
        }
        //error interceptor for Moongose error
        else if (err instanceof mongoose.Error) {
          if (err instanceof ValidationError) {
            statusCode = HttpStatus.BAD_REQUEST;
            reason = err.property;
            field = err.value;
          } else if (err instanceof TypeError) {
            console.log('Type Error ', err);
          } else if (err instanceof mongoose.Error.ValidatorError) {
            statusCode = HttpStatus.BAD_REQUEST;
            reason = err.path;
            field = err.value;
          } else if (err instanceof mongoose.Error.ValidationError) {
            statusCode = HttpStatus.BAD_REQUEST;
            reason = err.message;
            field = err.name;
          } else if (err instanceof mongoose.Error.CastError) {
            statusCode = HttpStatus.BAD_REQUEST;
            reason = `object not found with id : "${err.value._id}`;
            field = err.kind;
          } else if (err instanceof BSONError) {
            statusCode = HttpStatus.BAD_REQUEST;
            reason = err.message;
            field = err.name;
          } else {
            statusCode = HttpStatus.BAD_REQUEST;
            reason = err.message;
            field = err.name;
          }
        } else if (err instanceof TypeError) {
          statusCode = HttpStatus.BAD_REQUEST;
          reason = err.message;
          field = err.name;
        }

        //microservice error
        else if (err.name === 'CastError') {
          statusCode = HttpStatus.BAD_REQUEST;
          reason = `object not found with id : "${err.value}`;
          field = err.kind;
        } else if (err.code === 11000) {
          statusCode = HttpStatus.BAD_REQUEST;
          reason = `Duplicate field value entered `;
          field = err.kind;
        } else if (err.name === 'ValidationError') {
          const fields = Object.getOwnPropertyNames(err.errors);
          statusCode = HttpStatus.BAD_REQUEST;
          reason = `Duplicate field value entered :  ${err._message}`;
          field = fields.toString();
        } else if (err.error?.name === 'ValidationError') {
          statusCode = HttpStatus.BAD_REQUEST;
          reason =
            err.message.split(':')[0] +
            `, Duplicate fields:  ${Object.getOwnPropertyNames(
              err.error.errors,
            ).toString()}`;
          field = Object.getOwnPropertyNames(err.error.errors).toString();
        } else {
          !err.status
            ? HttpStatus.FORBIDDEN
            : (statusCode = err.status || HttpStatus.FORBIDDEN);

          !err.response
            ? (reason = ' unknown ')
            : (reason = err.response.reason || err.message);

          !err.response.field
            ? (field = err.response.error || ' unknown ')
            : (field = err.response.field || err.response.error);
        }
        return throwError(
          new HttpException(
            {
              statusCode,
              success,
              message: {
                reason,
                field,
              },
            },
            statusCode,
          ),
        );
      }),
    );
  }
}
