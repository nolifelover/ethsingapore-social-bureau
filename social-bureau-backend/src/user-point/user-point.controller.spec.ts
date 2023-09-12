import { Test, TestingModule } from '@nestjs/testing';
import { UserPointsController } from './user-point.controller';
import { UserPointsService } from './user-point.service';

describe('UserPointsController', () => {
  let controller: UserPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPointsController],
      providers: [UserPointsService],
    }).compile();

    controller = module.get<UserPointsController>(UserPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
