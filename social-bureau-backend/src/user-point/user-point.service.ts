import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserPointDto } from './dto/create-user-point.dto';
import { FirebaseService } from 'src/utils/firebase/firebase.service';
import { UuidService } from 'src/utils/uuid/uuid.service';

@Injectable()
export class UserPointService {
  constructor(
    private firebaseService: FirebaseService,
    private uuid: UuidService,
  ) {}
  async createUserPoint(createUserPointDto: CreateUserPointDto) {
    Logger.debug(`payload == %o`, createUserPointDto);
    const { uid } = createUserPointDto;
    const pointCollectionRef = this.firebaseService.firestore.collection('user-points');
    const querySnapshot = await pointCollectionRef
      .where('uid', '==', uid)
      .get();
    let point = null;
    if (querySnapshot.empty) {
      const id = await this.uuid.generateUuid();
      const data = {
        ...createUserPointDto,
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
          ...createUserPointDto,
          point: pointData.point += createUserPointDto.point,
          updatedAt: new Date(),
        };
        await pointCollectionRef.doc(pointData.id).update(payload);
        point = await pointCollectionRef.doc(pointData.id).get();
      }
    }
    return point.data();
  }

 async getUserPoint(uid: string) {
    const pointCollectionRef = await this.firebaseService.firestore.collection('user-points');
    const querySnapshot = await pointCollectionRef
    .where('uid', '==', uid)
    .get();
    if (querySnapshot.empty) {
      return [];
    }
    const result = querySnapshot.docs[0].data();
    return result;
  }
}
