import { Controller, Get, Post, Put, Body, Patch, Param, Delete, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserReportPointService } from './user-report-point.service';
import { CreateUserReportPointDto } from './dto/create-user-report-point.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Role } from 'src/users/models/role.enum';
import { UpdateUserReportPointDto } from './dto/update-user-report-point.dto';

@Controller('user-report-points')
export class UserReportPointController {
  constructor(private readonly userReportPointService: UserReportPointService) { }

  @Auth(Role.INSPECTOR, Role.ADMIN)
  @Post()
  createUserReportPoint(@Body() createUserReportPointDto: CreateUserReportPointDto) {
    return this.userReportPointService.createUserReportPoint(createUserReportPointDto);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  async updateUserReportPoint(@Param('id') id: string, @Body() updateUserReportPointDto: UpdateUserReportPointDto) {
    return this.userReportPointService.updateUserReportPoint(id, updateUserReportPointDto);
  }

  @Auth(Role.INSPECTOR, Role.USER)
  @Get('/my-point/:crimeId/:category')
  getUserReportPoint(@Param('crimeId') crimeId: string, @Param('category') category: string, @Req() req: any) {
    return this.userReportPointService.getUserReportPoint(req.user.uid, crimeId, category);
  }

  @Auth(Role.INSPECTOR, Role.USER)
  @Get('/my-point')
  getSumUserReportPoint(@Req() req: any) {
    return this.userReportPointService.getSumUserReportPoint(req.user.uid);
  }

}
