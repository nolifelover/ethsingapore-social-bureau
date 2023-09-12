import { Module } from '@nestjs/common';
import { CrimeService } from './crime.service';
import { CrimeController } from './crime.controller';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UsersService } from 'src/users/users.service';
import { ContractService } from 'src/utils/web3/contract.service';

@Module({
  controllers: [CrimeController],
  providers: [CrimeService, FirebaseService, UuidService, PaginationService, UsersService, ContractService],
})
export class CrimeModule {}
