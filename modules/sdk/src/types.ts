import { Output, Input, output } from '@pulumi/pulumi';

export type AsOutputs<T extends {}> = {
    [K in keyof T]: Output<T[K]>;
};

export type AsInput<T> = T extends string | number | boolean
    ? Input<T>
    : T extends (infer A)[]
    ? Input<AsInput<A>[]>
    : T extends {}
    ? Input<
          {
              [K in keyof T]: AsInput<T[K]>;
          }
      >
    : never;

export type AsInputs<T extends {}> = {
    [K in keyof T]: AsInput<T[K]>;
};
