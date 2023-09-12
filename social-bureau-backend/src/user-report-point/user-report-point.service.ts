import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserReportPointDto } from './dto/create-user-report-point.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';
import { UpdateUserReportPointDto } from './dto/update-user-report-point.dto';

@Injectable()
export class UserReportPointService {

  constructor(
    private firebaseService: FirebaseService,
    private uuid: UuidService,
  ) { }

  async createUserReportPoint(createUserReportPointDto: CreateUserReportPointDto) {
    Logger.debug(`payload == %o`, createUserReportPointDto);
    const { uid } = createUserReportPointDto;
    const pointCollectionRef = this.firebaseService.firestore.collection('user-report-points');
    const querySnapshot = await pointCollectionRef
      .where('uid', '==', uid)
      .get();
    let point = null;
    if (querySnapshot.empty) {
      const id = await this.uuid.generateUuid();
      const data = {
        ...createUserReportPointDto,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await pointCollectionRef.doc(id).set(data);
      point = await pointCollectionRef.doc(id).get();
    } else {
      const pointData = querySnapshot.docs[0].data();
      if (pointData) {
        const payload = {
          ...createUserReportPointDto,
          point: pointData.point += createUserReportPointDto.point,
          updatedAt: new Date(),
        };
        await pointCollectionRef.doc(pointData.id).update(payload);
        point = await pointCollectionRef.doc(pointData.id).get();
      }
    }
    return point.data();
  }

  async updateUserReportPoint(id: string, updateUserReportPointDao: UpdateUserReportPointDto) {
    const data = {
      ...updateUserReportPointDao,
      updatedAt: new Date(),
    };
    const userReportPointCollectionRef = this.firebaseService.firestore.collection('user-report-points');
    let userReportPoint = await userReportPointCollectionRef.doc(id).get();
    if (!userReportPoint.exists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: 'User Report Point not found',
          },
        },
        HttpStatus.CONFLICT
      );
    }
    await userReportPointCollectionRef.doc(id).update(data);
    userReportPoint = await userReportPointCollectionRef.doc(id).get();
    return userReportPoint.data();
  }

  async getUserReportPoint(uid: string, crimeId: string, category: string) {
    const pointCollectionRef = await this.firebaseService.firestore.collection('user-report-points');
    const querySnapshot = await pointCollectionRef
      .where('uid', '==', uid)
      .where('crimeId', '==', crimeId)
      .where('category', '==', category.replace("%20", " "))
      .get();

    if (querySnapshot.empty) {
      // throw new HttpException(
      //   {
      //     status: HttpStatus.CONFLICT,
      //     errors: {
      //       message: 'User Report point not found',
      //     },
      //   },
      //   HttpStatus.CONFLICT
      // );
      return null;
    }
    const result = querySnapshot.docs[0].data();
    return result;
  }

  async getSumUserReportPoint(uid: string) {
    const pointCollectionRef = await this.firebaseService.firestore.collection('user-report-points');
    const querySnapshot = await pointCollectionRef
      .where('uid', '==', uid)
      .get();

    const results = [];

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
    }

    return results;
  }
}
