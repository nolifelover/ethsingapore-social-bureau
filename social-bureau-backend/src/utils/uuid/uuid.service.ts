import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

@Injectable()
export class UuidService {
  async generateUuid() {
    const uniqueToken = uuid.v4();
    return uniqueToken;
  }
}
