import { Test, TestingModule } from '@nestjs/testing';
import { EstimationController } from './estimation.controller';
import {SessionProviderService} from '../services/session-provider/session-provider.service';

describe('Estimation Controller', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [EstimationController],
      providers: [SessionProviderService],
    }).compile();
  });
  it('should be defined', () => {
    const controller: EstimationController = module.get<EstimationController>(EstimationController);
    expect(controller).toBeDefined();
  });
});
