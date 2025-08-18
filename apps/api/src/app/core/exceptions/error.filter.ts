import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
    public catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        console.error(exception);

        const response = ctx.getResponse<FastifyReply>();

        if (exception instanceof HttpException) {
            response.status(exception.getStatus()).send({
                message: exception.getResponse(),
                code: exception.getStatus(),
                error: exception.message,
                timestamp: new Date(),
            });
            return;
        }
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: exception.message,
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Internal Server Error',
            timestamp: new Date(),
        });
    }
}
