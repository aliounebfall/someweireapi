const tag = 'ERROR_CONTROLLER';

export function handle404(request, response) {
    response.status(404).send('Resource not found');
}