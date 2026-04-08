export class ApiResponse<T> {
    message?: string;
    success: boolean;
    data: T|null|undefined;

    constructor({ message, success, data }: { message?: string, success?: boolean, data: T | null}) {
        this.data = data;
        this.success = success ?? true;
        this.message = message ?? 'Api call successful'
    }
}