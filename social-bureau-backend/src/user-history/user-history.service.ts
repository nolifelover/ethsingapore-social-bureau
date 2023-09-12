import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';
import { UpdateUserHistoryDto } from './dto/update-user-history.dto';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { PaginationService } from 'src/utils/pagination/pagination.service';

@Injectable()
export class UserHistoryService {
  constructor(
    private firebaseService: FirebaseService,
    private readonly paginationService: PaginationService,
    private uuid: UuidService,
  ) { }

  async createUserHistory(createUserHistoryDto: CreateUserHistoryDto) {
    const userHistoryCollectionRef = this.firebaseService.firestore.collection('user-histories');
    const id = await this.uuid.generateUuid();
    const data = {
      ...createUserHistoryDto,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await userHistoryCollectionRef.doc(id).set(data);
    return data;
  }

  async getUserHistories(filter: object, order: object, page: number, limit: number) {
    const userHistoryCollectionRef = this.firebaseService.firestore.collection('user-histories');
    let query: any = userHistoryCollectionRef;
    for (const [key, value] of Object.entries(filter)) {
      query = query.where(key, '==', value);
    }
    for (const [key, value] of Object.entries(order)) {
      query = query.orderBy(key, value);
    }
    const histories = await query.get();

    const datas = [];
    for (const doc of histories.docs) {
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

  async getUserHistoryByRefId(refId: string, type: string) {
    const userHistoryCollectionRef = await this.firebaseService.firestore.collection('user-histories');
    const querySnapshot = await userHistoryCollectionRef
      .where('refId', '==', refId)
      .where('type', '==', type)
      .get();
    if (querySnapshot.empty) {
      return null
    }
    const result = querySnapshot.docs[0].data();
    return result;
  }

  async updateHistory(id: string, updateUserHistoryDto: UpdateUserHistoryDto) {
    const data = {
      ...updateUserHistoryDto,
      updatedAt: new Date(),
    };
    const historyCollectionRef = this.firebaseService.firestore.collection('user-histories');
    let history = await historyCollectionRef.doc(id).get();
    if (!history.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'History not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    await historyCollectionRef.doc(id).update(data);
    history = await historyCollectionRef.doc(id).get();
    return history.data();
  }

  async deleteUserHistory(id: string) {
    const historyCollectionRef = this.firebaseService.firestore.collection('user-histories');
    const history = await historyCollectionRef.doc(id).get();
    if (!history.exists) {
      return false
    }
    await historyCollectionRef.doc(id).delete();
    return true;
  }
}
