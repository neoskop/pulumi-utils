import { output } from '@pulumi/pulumi';

import { AsInputs, AsInput } from './types';

type Str = 'foo' | 'bar';
interface Test {
    typedString: Str;
    string: string;
    nbr: number;
    typedStringArray: Str[];
    stringArray: string[];
    objArray: { test: number };
    obj: {
        str: Str;
    };
}

type TestInputs = AsInputs<Test>;

describe('AsInputs', () => {
    it('should not throw typescript errors', () => {
        const t: TestInputs = {
            typedString: output('foo' as Str),
            string: output('str'),
            nbr: output(1),
            typedStringArray: output([output('foo' as Str)]),
            stringArray: output([output('str')]),
            objArray: output({
                test: output(123)
            }),
            obj: output({
                str: output('foo' as Str)
            })
        };
        expect(true).toBeTruthy();
    });
});
