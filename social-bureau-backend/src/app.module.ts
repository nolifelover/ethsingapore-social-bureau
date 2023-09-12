import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from 'src/common/configs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from './gql-config.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { FirebaseService } from './utils/firebase/firebase.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CrimeModule } from './crime/crime.module';
import { UploadImageModule } from './upload-image/upload-image.module';
import { CommentModule } from './comment/comment.module';
import { VoteModule } from './vote/vote.module';
import { UserPointModule } from './user-point/user-point.module';
import { UserHistoryModule } from './user-history/user-history.module';
import { ContractService } from './utils/web3/contract.service';
import { UserReportPointModule } from './user-report-point/user-report-point.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    AuthModule,
    UsersModule,
    CrimeModule,
    UploadImageModule,
    CommentModule,
    VoteModule,
    UserPointModule,
    UserHistoryModule,
    UserReportPointModule
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, FirebaseService, ContractService],
})
export class AppModule { }
