import { Module } from '@nestjs/common';
import { UserHistoryService } from './user-history.service';
import { UserHistoryController } from './user-history.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';

@Module({
  controllers: [UserHistoryController],
  providers: [UserHistoryService, FirebaseService, UuidService, PaginationService],
})
export class UserHistoryModule {}
