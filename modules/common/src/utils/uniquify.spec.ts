import { uniqify } from './uniquify';

describe('utils / uniquify', () => {
    let spy: jest.SpyInstance;
    beforeEach(() => {
        spy = jest
            .spyOn(Math, 'random')
            .mockReturnValueOnce(0.1)
            .mockReturnValueOnce(0.2)
            .mockReturnValueOnce(0.3)
            .mockReturnValueOnce(0.4)
            .mockReturnValueOnce(0.5)
            .mockReturnValueOnce(0.6)
            .mockReturnValueOnce(0.7)
            .mockReturnValueOnce(0.8);
    });
    afterEach(() => {
        spy.mockRestore();
    });

    it('should return prefix with default 5 digit long random suffix', () => {
        expect(uniqify('foobar')).toEqual('foobar-37aei');
    });

    it('should return prefix with random suffix custom length', () => {
        expect(uniqify('foobar', 8)).toEqual('foobar-37aeilps');
    });
});
