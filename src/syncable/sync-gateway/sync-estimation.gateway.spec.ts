import { Test, TestingModule } from '@nestjs/testing';
import { SyncEstimationGateway } from './sync-estimation.gateway';

describe('SyncEstimationGateway', () => {
  let gateway: SyncEstimationGateway;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SyncEstimationGateway],
    }).compile();
    gateway = module.get<SyncEstimationGateway>(SyncEstimationGateway);
  });
  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
