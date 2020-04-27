import { Output, Input } from '@pulumi/pulumi';

export type AsOutputs<T extends {}> = {
    [K in keyof T]: Output<T[K]>;
};

export type AsInputs<T> = T extends {}
    ? {
          [K in keyof T]: AsInputs<T[K]>;
      }
    : T extends (infer A)[]
    ? Input<AsInputs<A>[]>
    : Input<T>;
