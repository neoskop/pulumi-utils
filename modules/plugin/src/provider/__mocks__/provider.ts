import { IProvider } from '../provider.interface';

export class ProviderMock implements IProvider {
    check = jest.fn();
    diff = jest.fn();
    create = jest.fn();
    read = jest.fn();
    update = jest.fn();
    delete = jest.fn();
    cancel = jest.fn();
    invoke = jest.fn();
}

export const ProviderMockImpl = jest.fn().mockImplementation(() => {
    return new ProviderMock();
});
