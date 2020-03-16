export type Constructor<T> = {
    new (...args: any[]): T;
    prototype: T;
};

export function ensure<T>(value: T): T {
    return value;
}
