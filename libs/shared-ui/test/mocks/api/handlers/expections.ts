import { HttpResponse } from 'msw';

export class NotFoundException extends Error {}

export class BadRequestException extends Error {}

interface ExceptionResponseParams {
    message: string;
    error: string;
    status: number;
}

export function sendExceptionResponse(error: Error) {
    if (error instanceof NotFoundException) return sendNotFoundExceptionResponse(error.message);
    if (error instanceof BadRequestException) return sendBadRequestExceptionResponse(error.message);
    return sendInternalServerErrorResponse(error.message);
}

export function sendBadRequestExceptionResponse(message: string) {
    return constructExceptionResponse({ message: message, error: 'Bad Request', status: 400 });
}

export function sendNotFoundExceptionResponse(message: string) {
    return constructExceptionResponse({ message: message, error: 'Not Found', status: 404 });
}

export function sendInternalServerErrorResponse(message: string) {
    return constructExceptionResponse({ message: message, error: 'Internal Server Error', status: 500 });
}

function constructExceptionResponse(params: ExceptionResponseParams) {
    const { message, error, status } = params;

    return HttpResponse.json(
        {
            message: message,
            timestamp: new Date(),
            error: error,
            status: status,
        },
        {
            type: 'error',
            status: status,
            statusText: error,
        }
    );
}
