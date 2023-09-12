import { UsersService } from 'src/users/users.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { FieldValue } from 'firebase-admin/firestore';
import { UserHistoryService } from 'src/user-history/user-history.service';
import { Type } from 'src/user-history/models/type.enum';

@Injectable()
export class VoteService {
  constructor(
    private firebaseService: FirebaseService,
    private uuid: UuidService,
    private readonly paginationService: PaginationService,
    private readonly userHistoryService: UserHistoryService,
    private readonly usersService: UsersService,
  ) { }
  async createVote(createVoteDto: CreateVoteDto) {
    const { crimeId, createdBy, type } = createVoteDto;
    const voteCollectionRef = this.firebaseService.firestore.collection('votes');
    const querySnapshot = await voteCollectionRef
      .where('crimeId', '==', crimeId)
      .where('createdBy', '==', createdBy)
      .get();
    let vote = null;
    if (querySnapshot.empty) { // ไม่มี vote สร้าง vote ใหม่
      const id = await this.uuid.generateUuid();
      const data = {
        ...createVoteDto,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await voteCollectionRef.doc(id).set(data);
      vote = await voteCollectionRef.doc(id).get();
      if (vote) { // add voteId เข้า crimes
         Logger.debug(`create vote == %o`, createVoteDto);
        const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
        const crime = await crimeCollectionRef.doc(crimeId).get();
        await crimeCollectionRef.doc(crimeId).update({ votes: FieldValue.arrayUnion(id) });
        const crimeDetail = crime.data();
        const userDetail = await this.usersService.getUser(createdBy);
        const dataHistory = {
          uid: createdBy,
          type: Type.VOTE,
          power: parseInt(userDetail.power),
          crimeId: crimeId,
          refId: id,
          action: type,
          message: `${userDetail.fristname || ''} vote(${type})  to crime: ${crimeDetail.name}`
        }
        await this.userHistoryService.createUserHistory(dataHistory);
      }
    } else { // มีโหวตแล้วแค่ต้องการ vote ไปอีก type

      const voteData = querySnapshot.docs[0].data();
      if (voteData && voteData.type !== type) {
      Logger.debug(`update vote == %o`, createVoteDto);
        const payload = {
          ...createVoteDto,
          updatedAt: new Date(),
        };
        await voteCollectionRef.doc(voteData.id).update(payload);
        vote = await voteCollectionRef.doc(voteData.id).get();
        if (vote) {
          const history = await this.userHistoryService.getUserHistoryByRefId(voteData.id, Type.VOTE)
          if (history) {
            const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
            const crime = await crimeCollectionRef.doc(crimeId).get();
            const crimeDetail = crime.data();
            const userDetail = await this.usersService.getUser(createdBy);
            const dataHistory = {
              action:type,
              message: `${userDetail.fristname || ''} update(${type})  to crime: ${crimeDetail.name}`
            }
            await this.userHistoryService.updateHistory(history.id, dataHistory);
          }
        }
      } else if (voteData && voteData.type === type) { // มีโหวตแล้วแต่กดtypeเดิม ต้องลบออก
        Logger.debug(`delete vote == %o`, createVoteDto);
        await voteCollectionRef.doc(voteData.id).delete();
        const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
        await crimeCollectionRef.doc(crimeId).get();
        await crimeCollectionRef.doc(crimeId).update({ votes: FieldValue.arrayRemove(voteData.id) });
        const history = await this.userHistoryService.getUserHistoryByRefId(voteData.id, Type.VOTE)
        if (history) {
          await this.userHistoryService.deleteUserHistory(history.id);
        }
      }
    }
    if (vote) {
      return vote.data();
    }
    return vote;
  }
  /** Frontend not use */
  async getVotes(filter: object, order: object, page: number, limit: number) {
    const voteCollectionRef = this.firebaseService.firestore.collection('votes');
    let query: any = voteCollectionRef;
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, '==', value);
    }
    for (const [key, value] of Object.entries(order)) {
      query = query.orderBy(key, value);
    }
    const votes = await query.get();

    const datas = [];
    for (const doc of votes.docs) {
      const u = doc.data();
      datas.push(u);
    }

    const result = {
      results: [],
      page,
      limit,
      totalPages: 0,
      totalResults: 0,
    };
    const totalResults = datas.length;
    const totalPages = Math.ceil(totalResults / limit);
    result.totalResults = totalResults;
    result.totalPages = totalPages;
    result.results = await this.paginationService.paginate(datas, limit, page);
    return result;
  }

  async getVote(id: string) {
    const vote = await this.firebaseService.firestore.collection('votes').doc(id).get();
    if (!vote.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'Vote not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    const result = vote.data();
    return result;
  }

  async updateVote(id: string, updateVoteDto: UpdateVoteDto) {
    const data = {
      ...updateVoteDto,
      updatedAt: new Date(),
    };
    const voteCollectionRef = this.firebaseService.firestore.collection('votes');
    let vote = await voteCollectionRef.doc(id).get();
    if (!vote.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'Vote not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    await voteCollectionRef.doc(id).update(data);
    vote = await voteCollectionRef.doc(id).get();
    return vote.data();
  }

  async deleteVote(id: string) {
    const voteCollectionRef = this.firebaseService.firestore.collection('votes');
    const vote = await voteCollectionRef.doc(id).get();
    if (!vote.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'Vote not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    await voteCollectionRef.doc(id).delete();
    return true;
  }
  /** Frontend not use */
}
