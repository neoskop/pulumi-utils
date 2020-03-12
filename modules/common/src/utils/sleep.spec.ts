import { sleep } from './sleep';

describe('utils / sleep', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('it should return a promise', () => {
        expect(sleep(1)).toBeInstanceOf(Promise);
    });

    it('it should resolve after given ms', async () => {
        const cb = jest.fn();
        const promise = sleep(1000).then(cb);

        expect(cb).not.toBeCalled();
        expect(setTimeout).toBeCalledTimes(1);
        expect(setTimeout).toBeCalledWith(expect.any(Function), 1000);

        jest.advanceTimersByTime(500);

        expect(cb).not.toBeCalled();

        jest.advanceTimersByTime(500);

        await promise;
        expect(cb).toBeCalled();
    });
});
