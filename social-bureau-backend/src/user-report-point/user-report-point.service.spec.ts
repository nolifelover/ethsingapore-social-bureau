import { Test, TestingModule } from '@nestjs/testing';
import { UserReportPointService } from './user-report-point.service';

describe('UserReportPointService', () => {
  let service: UserReportPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserReportPointService],
    }).compile();

    service = module.get<UserReportPointService>(UserReportPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
