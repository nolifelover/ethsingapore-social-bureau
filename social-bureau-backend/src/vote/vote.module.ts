import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { UserHistoryService } from 'src/user-history/user-history.service';
import { UsersService } from 'src/users/users.service';
import { ContractService } from 'src/utils/web3/contract.service';

@Module({
  controllers: [VoteController],
  providers: [VoteService, FirebaseService, UuidService, PaginationService, UserHistoryService, UsersService, ContractService],
})
export class VoteModule {}
