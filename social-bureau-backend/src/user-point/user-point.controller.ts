import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserPointService } from './user-point.service';
import { CreateUserPointDto } from './dto/create-user-point.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Role } from 'src/users/models/role.enum';

@Controller('user-points')
export class UserPointController {
  constructor(private readonly userPointService: UserPointService) {}
  // @Auth(Role.INSPECTOR, Role.ADMIN)
  @Post()
  createUserPoint(@Body() createUserPointDto: CreateUserPointDto) {
    return this.userPointService.createUserPoint(createUserPointDto);
  }

  @Auth(Role.INSPECTOR, Role.USER)
  @Get('/my-point')
  getUserPoint(@Req() req: any) {
    return this.userPointService.getUserPoint(req.user.uid);
  }

}
