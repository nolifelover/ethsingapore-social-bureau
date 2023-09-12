import { Test, TestingModule } from '@nestjs/testing';
import { UserHistoriesController } from './user-history.controller';
import { UserHistoriesService } from './user-history.service';

describe('UserHistoriesController', () => {
  let controller: UserHistoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserHistoriesController],
      providers: [UserHistoriesService],
    }).compile();

    controller = module.get<UserHistoriesController>(UserHistoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
