import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { UserHistoryService } from './user-history.service';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Role } from 'src/users/models/role.enum';
import { UserHistoriesListDto } from './dto/get-user-history.dto';

@Controller('user-histories')
export class UserHistoryController {
  constructor(private readonly userHistoryService: UserHistoryService) {}

  @Post()
  create(@Body() createUserHistoryDto: CreateUserHistoryDto) {
    return this.userHistoryService.createUserHistory(createUserHistoryDto);
  }

  @Auth(Role.INSPECTOR, Role.USER)
  @Get()
 async getHistories(@Query() query: UserHistoriesListDto, @Req() req: any) {
    const { type, action, crimeId, orderBy, page = 1, limit = 10 } = query;
    const filter = {};
    const order = {};

    if (type) {
      Object.assign(filter, { type });
    }
    if (action) {
      Object.assign(filter, { action });
    }
    if (crimeId) {
      Object.assign(filter, { crimeId });
    }
    if (req.user.uid) {
      Object.assign(filter, { uid: req.user.uid });
    }
    if (orderBy) {
      const o = orderBy.split(':');
      Object.assign(order, { [o[0]]: o[1] });
    }

    const result = await this.userHistoryService.getUserHistories(filter, order, Number(page), Number(limit));
    return result;
  }

}
