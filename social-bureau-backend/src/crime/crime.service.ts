import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCrimeDto } from './dto/create-crime.dto';
import { UpdateCrimeDto } from './dto/update-crime.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CrimeService {
  constructor(
    private firebaseService: FirebaseService,
    private uuid: UuidService,
    private readonly paginationService: PaginationService,
    private readonly userService: UsersService
  ) { }
  async createCrime(createCrimeDto: CreateCrimeDto) {
    Logger.debug(`createCrimeDto == %o`, createCrimeDto);
    const id = await this.uuid.generateUuid();
    const data = {
      ...createCrimeDto,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
    await crimeCollectionRef.doc(id).set(data);
    return data;
  }
  async calculateVote(votes: [], userId: string) {
    const results = {
      upvote: 0,
      downvote: 0,
      upvoter: false,
      downvoter: false,
    };
    const voteCollectionRef = this.firebaseService.firestore.collection('votes');
    for (const vote of votes) {
      const voteResult = await voteCollectionRef.doc(vote).get();
      if (voteResult.data().type === 'UPVOTE') {
        results.upvote += parseInt(voteResult.data().point);
        if (voteResult.data().createdBy === userId) {
          results.upvoter = true;
        }
      }
      if (voteResult.data().type === 'DOWNVOTE') {
        results.downvote += parseInt(voteResult.data().point);
        if (voteResult.data().createdBy === userId) {
          results.downvoter = true;
        }
      }
    }
    return results;
  }
  async getCommentDetails(comments: []) {
    const results = [];
    const commentCollectionRef = this.firebaseService.firestore.collection('comments');
    for (const comment of comments) {
      const commentResult = await commentCollectionRef.doc(comment).get();
      if (commentResult.data()) {
        const commentDetail = commentResult.data();
        commentDetail.createdBy = await this.userService.getUser(commentDetail.createdBy);
        results.push(commentDetail);
      }
    }
    return results;
  }
  async getCrimes(filter: object, order: object, page: number, limit: number, userId: string) {

    const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
    let query: any = crimeCollectionRef;
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, '==', value);
    }
    for (const [key, value] of Object.entries(order)) {
      query = query.orderBy(key, value);
    }

    const crimes = await query.get();

    const datas = [];
    for (const doc of crimes.docs) {
      let u = doc.data();
      if (u.createdBy) {
        u.createdBy = await this.userService.getUser(u.createdBy);
      }
      if (u.votes) {
        const resultVotes = await this.calculateVote(u.votes, userId);
        u = { ...u, ...resultVotes };
      } else {
        const resultVotes = await this.calculateVote([], userId);
        u = { ...u, ...resultVotes };
      }
      if (u.comments) {
        u = { ...u, countComment: u.comments.length };
      } else {
        u = { ...u, countComment: 0 };
      }
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
  async getCrimesByScamType(filter: object, order: object, page: number, limit: number, userId: string) {
    if (filter['scamType'] === undefined) {
      if (userId) {
        const user = await this.userService.getUser(userId);
        if (user.interestingScamType) {
          Object.assign(filter, { scamType: user.interestingScamType });
        }
      }
    }
    const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
    let query: any = crimeCollectionRef;
    for (const [key, value] of Object.entries(filter)) {
      if (key === 'scamType') {
        query = query.where(key, 'in', value);
      } else {
        query = query.where(key, '==', value);
      }
    }
    for (const [key, value] of Object.entries(order)) {
      query = query.orderBy(key, value);
    }

    const crimes = await query.get();

    const datas = [];
    for (const doc of crimes.docs) {
      let u = doc.data();
      if (u.createdBy) {
        u.createdBy = await this.userService.getUser(u.createdBy);
      }
      if (u.votes) {
        const resultVotes = await this.calculateVote(u.votes, userId);
        u = { ...u, ...resultVotes };
      } else {
        const resultVotes = await this.calculateVote([], userId);
        u = { ...u, ...resultVotes };
      }
      if (u.comments) {
        u = { ...u, countComment: u.comments.length };
      } else {
        u = { ...u, countComment: 0 };
      }
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
  async getCrime(id: string, userId: string) {
    const crime = await this.firebaseService.firestore.collection('crimes').doc(id).get();
    if (!crime.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'Crime not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }

    let result = crime.data();
    if (result) {
      result.createdBy = await this.userService.getUser(result.createdBy);
    }
    if (result.votes) {
      const resultVotes = await this.calculateVote(result.votes, userId);
      result = { ...result, ...resultVotes };
    } else {
      const resultVotes = await this.calculateVote([], userId);
      result = { ...result, ...resultVotes };
    }
    if (result.comments) {
      const resultComments = await this.getCommentDetails(result.comments);
      result.comments = resultComments;
    } else {
      const resultComments = await this.getCommentDetails([]);
      result.comments = resultComments;
    }
    return result;
  }

  async updateCrime(id: string, updateCrimeDto: UpdateCrimeDto) {
    const data = {
      ...updateCrimeDto,
      updatedAt: new Date(),
    };
    const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
    let crime = await crimeCollectionRef.doc(id).get();
    if (!crime.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'Crime not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    await crimeCollectionRef.doc(id).update(data);
    crime = await crimeCollectionRef.doc(id).get();
    return crime.data();
  }

  async deleteCrime(id: string) {
    const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
    const crime = await crimeCollectionRef.doc(id).get();
    if (!crime.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'Crime not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    await crimeCollectionRef.doc(id).delete();
    return true;
  }
}
