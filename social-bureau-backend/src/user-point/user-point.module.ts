import { Module } from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { UserPointController } from './user-point.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';

@Module({
  controllers: [UserPointController],
  providers: [UserPointService, FirebaseService, UuidService],
})
export class UserPointModule {}
