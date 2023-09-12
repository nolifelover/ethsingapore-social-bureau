import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { UserListDto } from './dto/user-list.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { Role } from './models/role.enum';
import { FirebaseService } from 'src/utils/firebase/firebase.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private firebaseService: FirebaseService) {}

  @Auth(Role.ADMIN)
  @Get()
  async getUsers(@Query() query: UserListDto) {
    const { mobilePhone, orderBy, page = 1, limit = 10 } = query;
    const filter = {};
    const order = {};

    if (mobilePhone) {
      Object.assign(filter, { mobilePhone });
    }
    if (orderBy) {
      const o = orderBy.split(':');
      Object.assign(order, { [o[0]]: o[1] });
    }

    const result = await this.usersService.getUsers(filter, order, Number(page), Number(limit));

    return result;
  }

  @Auth()
  @Get('/me')
  async me(@Req() req: any) {
    const { user } = req;
    const result = await this.usersService.getUser(user.uid);
    return result;
  }

  @Auth(Role.ADMIN)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.getUser(id);
    return user;
  }

  @Auth()
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserInput) {
    const user = await this.usersService.updateUser(id, body);
    return user;
  }

  @Auth(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
    return { code: 200, message: 'user deleted' };
  }
}
