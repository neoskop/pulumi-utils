import { Configuration } from '../configuration';

export class ConfigurationMock implements Configuration {
    checkConfig = jest.fn();
    diffConfig = jest.fn();
    configure = jest.fn();
}

export const ConfigurationImpl = jest.fn().mockImplementation(function() {
    return new ConfigurationMock();
});
