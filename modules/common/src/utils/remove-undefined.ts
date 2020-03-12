type NonUndefined<T> = T extends undefined ? never : T;

export type WithoutUndefined<T extends {}> = {
    [P in keyof T]-?: T[P] extends (infer C)[]
        ? WithoutUndefined<C>[]
        : T[P] extends string | number | boolean | null
        ? NonUndefined<T[P]>
        : WithoutUndefined<NonUndefined<T[P]>>;
};

export function removeUndefined<T extends {}>(obj: T): WithoutUndefined<T> {
    return clearValue(obj);
}

function clearValue(value: any): any {
    if(null == value || ['number','string','boolean'].includes(typeof value)) {
        return value;
    }
    if(Array.isArray(value)) {
        return value.filter(v => v !== undefined).map(clearValue);
    } else if(value.constructor !== Object){
        throw new TypeError(`Invalid value "${value}"`)
    } else {
        return Object.keys(value).reduce((o, k) => {
            if(value[k] !== undefined) {
                o[k] = clearValue(value[k]);
            }
            return o;
        }, {} as any);
    }
}
