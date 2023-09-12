import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';
import { FieldValue } from 'firebase-admin/firestore';
import { UserHistoryService } from 'src/user-history/user-history.service';
import { UsersService } from 'src/users/users.service';
import { Type } from 'src/user-history/models/type.enum';


@Injectable()
export class CommentService {
  constructor(
    private firebaseService: FirebaseService,
    private uuid: UuidService,
    private readonly paginationService: PaginationService,
    private readonly userHistoryService: UserHistoryService,
    private readonly usersService: UsersService,
  ) {}
  async createComment(createCommentDto: CreateCommentDto) {
    Logger.debug(`payload == %o`, createCommentDto);
    const { crimeId, createdBy, vote } = createCommentDto;
    const id = await this.uuid.generateUuid();
    const data = {
      ...createCommentDto,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const commentCollectionRef = this.firebaseService.firestore.collection('comments');
    await commentCollectionRef.doc(id).set(data);
    const comment = await commentCollectionRef.doc(id).get();
    if (comment.data()) {
      const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
      const crime = await crimeCollectionRef.doc(crimeId).get();
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
      await crimeCollectionRef.doc(crimeId).update({ comments: FieldValue.arrayUnion(id) });
      const crimeDetail = crime.data();
      const userDetail = await this.usersService.getUser(createdBy);
      const dataHistory = {
        uid: createdBy,
        type: Type.COMMENT,
        power: parseInt(userDetail.power),
        crimeId: crimeId,
        refId: id,
        action: vote,
        message: `${userDetail.fristname || ''} comment to crime: ${crimeDetail.name}`
      }
      await this.userHistoryService.createUserHistory(dataHistory);
    }
    return data;
  }

  async getComments(filter: object, order: object, page: number, limit: number) {
    const commentCollectionRef = this.firebaseService.firestore.collection('comments');
    let query: any = commentCollectionRef;
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, '==', value);
    }
    for (const [key, value] of Object.entries(order)) {
      query = query.orderBy(key, value);
    }
    const comments = await query.get();

    const datas = [];
    for (const doc of comments.docs) {
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

  async getComment(id: string) {
    const comment = await this.firebaseService.firestore.collection('comments').doc(id).get();
    if (!comment.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'Comment not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    const result = comment.data();
    return result;
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto) {
    const data = {
      ...updateCommentDto,
      updatedAt: new Date(),
    };
    const commentCollectionRef = this.firebaseService.firestore.collection('comments');
    let comment = await commentCollectionRef.doc(id).get();
    if (!comment.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'Comment not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    await commentCollectionRef.doc(id).update(data);
    comment = await commentCollectionRef.doc(id).get();
    if (comment){
    const commentResult = comment.data();
    const history = await this.userHistoryService.getUserHistoryByRefId(id, Type.COMMENT)
    if (history) {
      const dataHistory = {
        action: commentResult.vote,
      }
      await this.userHistoryService.updateHistory(history.id, dataHistory);
    }
  }
    return comment.data();
  }

  async deleteComment(id: string) {
    const commentCollectionRef = this.firebaseService.firestore.collection('comments');
    const comment = await commentCollectionRef.doc(id).get();
    if (!comment.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'Comment not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    if (comment.data()) {
      const crimeId = comment.data().crimeId;
      const crimeCollectionRef = this.firebaseService.firestore.collection('crimes');
      const crime = await crimeCollectionRef.doc(crimeId).get();
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
      await crimeCollectionRef.doc(crimeId).update({ comments: FieldValue.arrayRemove(id) });
      const history = await this.userHistoryService.getUserHistoryByRefId(id, Type.COMMENT)
      if (history) {
        await this.userHistoryService.deleteUserHistory(history.id);
      }
    }
    await commentCollectionRef.doc(id).delete();
    return true;
  }
}
