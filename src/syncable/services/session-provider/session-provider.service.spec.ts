import { Test, TestingModule } from '@nestjs/testing';
import { SessionProviderService } from './session-provider.service';

describe('SessionProviderService', () => {
  let service: SessionProviderService;
  
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionProviderService],
    }).compile();
    service = module.get<SessionProviderService>(SessionProviderService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
