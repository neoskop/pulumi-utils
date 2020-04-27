import { AsInputs } from './types';
import { output } from '@pulumi/pulumi';

interface Test {
    str: string;
    nbr: number;
    strArr: string[];
    obj: {
        str: string;
    };
}

type TestInputs = AsInputs<Test>;

describe('AsInputs', () => {
    it('should not throw typescript errors', () => {
        const t: TestInputs = {
            str: output('string'),
            nbr: output(1),
            strArr: output([output('foo')]),
            obj: output({
                str: output('string')
            })
        };
        expect(true).toBeTruthy();
    });
});
