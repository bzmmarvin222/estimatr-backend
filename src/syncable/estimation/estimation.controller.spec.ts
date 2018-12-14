import { Test, TestingModule } from '@nestjs/testing';
import { EstimationController } from './estimation.controller';

describe('Estimation Controller', () => {
  let module: TestingModule;
  
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [EstimationController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: EstimationController = module.get<EstimationController>(EstimationController);
    expect(controller).toBeDefined();
  });
});
