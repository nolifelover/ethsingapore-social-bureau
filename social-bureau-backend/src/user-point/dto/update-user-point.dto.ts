import { PartialType } from '@nestjs/swagger';
import { CreateUserPointDto } from './create-user-point.dto';

export class UpdateUserPointDto extends PartialType(CreateUserPointDto) {}
