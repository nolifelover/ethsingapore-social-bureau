import { Test, TestingModule } from '@nestjs/testing';
import { UserReportPointController } from './user-report-point.controller';
import { UserReportPointService } from './user-report-point.service';

describe('UserReportPointController', () => {
  let controller: UserReportPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserReportPointController],
      providers: [UserReportPointService],
    }).compile();

    controller = module.get<UserReportPointController>(UserReportPointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
