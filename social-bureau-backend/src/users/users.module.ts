import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { ContractService } from 'src/utils/web3/contract.service';

@Module({
  imports: [],
  providers: [UsersService, FirebaseService, PaginationService, ContractService],
  controllers: [UsersController],
})
export class UsersModule {}
