import { Observable, OperatorFunction } from 'rxjs';

/**
 * A RxJS operator that simply logs the value to the console.
 *
 * You can provide the `overwrite` function to customize what and how the value is logged.
 * If you don't provide the `overwrite` function, the value will directly be logged to the console.
 */
export function log<T, K>(overwrite?: (value: T) => K): OperatorFunction<T, T> {
    return (source: Observable<T>) => {
        return new Observable((subscriber) => {
            const subscription = source.subscribe({
                next: (value: T) => {
                    if (!overwrite) console.log(value);
                    else console.log(overwrite(value));

                    subscriber.next(value);
                },
                error: (error) => subscriber.error(error),
                complete: () => subscriber.complete(),
            });

            return () => subscription.unsubscribe();
        });
    };
}
