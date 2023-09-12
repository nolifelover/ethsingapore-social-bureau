import { Module } from '@nestjs/common';
import { UploadImageController } from './upload-image.controller';
import { FirebaseService } from 'src/utils/firebase/firebase.service';

@Module({
  controllers: [UploadImageController],
  providers: [FirebaseService],
})
export class UploadImageModule {}
