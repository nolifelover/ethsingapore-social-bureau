import { PartialType } from '@nestjs/swagger';
import { CreateUserReportPointDto } from './create-user-report-point.dto';

export class UpdateUserReportPointDto extends PartialType(CreateUserReportPointDto) {}
