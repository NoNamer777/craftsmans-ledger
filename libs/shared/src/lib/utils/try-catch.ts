type Success<T> = { data: T; error: null };

type Failure<E = Error> = { data: null; error: E };

type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(promise: Promise<T> | (() => T)): Promise<Result<T, E>> {
    try {
        if (promise instanceof Promise) return { data: await promise, error: null };
        return { data: promise(), error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}
