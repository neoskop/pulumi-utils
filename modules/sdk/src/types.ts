import { Input, Output } from '@pulumi/pulumi';

export type AsOutputs<T extends {}> = {
    [K in keyof T]: Output<T[K]>;
};

export type Scalar = string | number | boolean | null;

export type AsInput<T> = T extends object ? Input<{ [K in keyof T]: T[K] extends Scalar ? Input<T[K]> : AsInput<T[K]> }> : Input<T>;

export type AsInputs<T> = {
    [K in keyof T]: T[K] extends Scalar ? Input<T[K]> : AsInput<T[K]>;
};
