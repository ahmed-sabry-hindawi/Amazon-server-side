import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    if (status === HttpStatus.TOO_MANY_REQUESTS) {
      const retryAfter = request.rateLimit?.resetTime
        ? new Date(request.rateLimit.resetTime)
        : null;
      const currentTime = new Date();
      const remainingTime = retryAfter
        ? Math.ceil((retryAfter.getTime() - currentTime.getTime()) / 1000)
        : 'shortly'; // Default message if not available

      response.status(status).json({
        statusCode: status,
        message: `You have exceeded the allowed number of requests. Please try again ${remainingTime} seconds.`,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: exception.getResponse(),
      });
    }
  }
}
