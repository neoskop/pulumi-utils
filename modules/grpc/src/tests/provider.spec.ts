import { ResourceProviderClient, ResourceProviderService } from '../grpc/provider_grpc_pb';

describe('ProviderService', () => {
    it('should export provider service', () => {
        expect(ResourceProviderService).toBeDefined();
    });

    it('should export provider client', () => {
        expect(ResourceProviderClient).toBeDefined();
    });
});
