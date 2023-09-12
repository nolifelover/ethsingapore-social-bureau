import { Test, TestingModule } from '@nestjs/testing';
import { CrimesController } from './crime.controller';
import { CrimesService } from './crime.service';

describe('CrimesController', () => {
  let controller: CrimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrimesController],
      providers: [CrimesService],
    }).compile();

    controller = module.get<CrimesController>(CrimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
