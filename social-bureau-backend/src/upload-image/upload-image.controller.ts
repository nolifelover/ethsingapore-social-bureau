import { Controller, Post, Body, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/utils/firebase/firebase.service';

@Controller('upload-images')
export class UploadImageController {
  constructor(private firebaseService: FirebaseService) { }

  @Post('/crime')
  @UseInterceptors(FilesInterceptor('images'))
  async createImageCrime(@UploadedFiles() files: Array<Express.Multer.File>) {
    const images = [];
    if (files) {
      for (const file of files) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        const time = new Date();
        const res = await this.firebaseService.uploadFile(`files/crimes/${rand}/${time.getTime()}`, file);
        if (res) {
          images.push(res.metadata.fullPath);
        }
      }
    }
    return images;
  }
  @Post('/comment')
  @UseInterceptors(FilesInterceptor('images'))
  async createImageComment(@UploadedFiles() files: Array<Express.Multer.File>) {
    const images = [];
    if (files) {
      for (const file of files) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        const time = new Date();
        const res = await this.firebaseService.uploadFile(`files/comments/${rand}/${time.getTime()}`, file);
        if (res) {
          images.push(res.metadata.fullPath);
        }
      }
    }
    return images;
  }

  @Post('/profile')
  @UseInterceptors(FilesInterceptor('profileImage'))
  async createImageProfile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const images = [];
    if (files) {
      for (const file of files) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        const time = new Date();
        const res = await this.firebaseService.uploadFile(`files/profiles/${rand}/${time.getTime()}`, file);
        if (res) {
          images.push(res.metadata.fullPath);
        }
      }
    }
    return images;
  }


  @Delete()
  async deleteImage(@Body('imagePath') imagePath: string) {
    if (imagePath !== undefined && imagePath !== null) {
      await this.firebaseService.deleteFile(imagePath);
    }
  }
}
