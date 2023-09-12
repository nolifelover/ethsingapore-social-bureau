import { Test, TestingModule } from '@nestjs/testing';
import { UserPointsService } from './user-point.service';

describe('UserPointsService', () => {
  let service: UserPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPointsService],
    }).compile();

    service = module.get<UserPointsService>(UserPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
