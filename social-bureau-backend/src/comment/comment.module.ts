import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { UsersService } from 'src/users/users.service';
import { UserHistoryService } from 'src/user-history/user-history.service';
import { ContractService } from 'src/utils/web3/contract.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, FirebaseService, UuidService, PaginationService, UsersService, UserHistoryService, ContractService],
})
export class CommentModule {}
