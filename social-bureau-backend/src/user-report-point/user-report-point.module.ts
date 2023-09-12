import { Module } from '@nestjs/common';
import { UserReportPointService } from './user-report-point.service';
import { UserReportPointController } from './user-report-point.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';

@Module({
  controllers: [UserReportPointController],
  providers: [UserReportPointService, FirebaseService, UuidService],
})
export class UserReportPointModule { }
