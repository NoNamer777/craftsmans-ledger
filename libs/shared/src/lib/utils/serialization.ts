import { ClassConstructor, ClassTransformOptions, instanceToPlain, plainToInstance } from 'class-transformer';

export const classTransformOptions: ClassTransformOptions = {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
};

export function serialize<T, V>(type: ClassConstructor<T>, value: V): T {
    return plainToInstance<T, V>(type, value, classTransformOptions);
}

export function serializeAll<T, V>(type: ClassConstructor<T>, value: V[]): T[] {
    return plainToInstance<T, V>(type, value, classTransformOptions);
}

export function deserialize<T>(value: T) {
    return instanceToPlain<T>(value, classTransformOptions);
}

export function deserializeAll<T>(value: T[]) {
    return instanceToPlain<T>(value, classTransformOptions);
}

export function transform<T, V>(type: ClassConstructor<T>, value: V): T {
    return serialize(type, deserialize(value));
}

export function transformAll<T, V>(type: ClassConstructor<T>, value: V[]): T[] {
    return serializeAll(type, deserializeAll(value));
}
